import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { OsmosisChainInfo, OsmosisTestnetChainInfo } from "../constants";
import { Balances } from "../types/balance";
import { api } from "../util/api";
import { sendMsgs } from "../util/sendMsgs";
import { simulateMsgs } from "../util/simulateMsgs";
import { MsgSend } from "../proto-types-gen/src/cosmos/bank/v1beta1/tx";

export const OsmosisTab: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [skipSimulation, setSkipSimulation] = useState<boolean>(false);
  const [targetChainId, setTargetChainId] = useState<string>(
    OsmosisTestnetChainInfo.chainId
  );
  const [adr36Message, setAdr36Message] = useState<string>("");
  const [adr36Signature, setAdr36Signature] = useState<string>("");
  // TODO: getAllWallets/switchAccount are not yet in @keplr-wallet/types. Remove type assertion when types are published.
  const [wallets, setWallets] = useState<
    {
      id: string;
      name: string;
      isSelected: boolean;
      addresses: { [chainId: string]: string };
    }[]
  >([]);
  const [walletsError, setWalletsError] = useState<string>("");

  const isExperimental = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("experimental") === "true";
  }, []);

  const chains = useMemo(
    () => [
      {
        id: OsmosisTestnetChainInfo.chainId,
        label: "Osmosis Testnet",
        info: OsmosisTestnetChainInfo,
      },
      {
        id: OsmosisChainInfo.chainId,
        label: "Osmosis",
        info: OsmosisChainInfo,
      },
    ],
    []
  );

  const selectedChain = useMemo(
    () => chains.find((c) => c.id === targetChainId) ?? chains[0],
    [chains, targetChainId]
  );

  const init = useCallback(async () => {
    const keplr = window.keplr;
    if (keplr) {
      try {
        // Ensure the selected chain is available in Keplr and enabled
        await keplr.experimentalSuggestChain(selectedChain.info as any);
        await keplr.enable(selectedChain.id);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  }, [selectedChain]);

  const getKeyFromKeplr = useCallback(async () => {
    const key = await window.keplr?.getKey(selectedChain.id);
    if (key) {
      setAddress(key.bech32Address);
    }
  }, [selectedChain.id]);

  const fetchAllWallets = useCallback(async () => {
    try {
      setWalletsError("");
      const keplr = window.keplr as any;
      if (!keplr?.getAllWallets) {
        return;
      }
      const result = await keplr.getAllWallets();
      setWallets(result ?? []);
    } catch (e) {
      if (e instanceof Error) {
        setWalletsError(e.message);
      }
    }
  }, []);

  const getBalance = async () => {
    const key = await window.keplr?.getKey(selectedChain.id);

    if (key) {
      const uri = `${selectedChain.info.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;

      const data = await api<Balances>(uri);
      const balance = data.balances.find(
        (balance) => balance.denom === "uosmo"
      );
      const osmoDecimal = selectedChain.info.currencies.find(
        (currency) => currency.coinMinimalDenom === "uosmo"
      )?.coinDecimals;

      if (balance) {
        const amount = new Dec(balance.amount, osmoDecimal);
        setBalance(`${amount.toString(osmoDecimal)} OSMO`);
      } else {
        setBalance(`0 OSMO`);
      }
    }
  };

  const sendBalance = async () => {
    if (window.keplr) {
      const key = await window.keplr?.getKey(selectedChain.id);
      const protoMsgs = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.encode({
          fromAddress: key.bech32Address,
          toAddress: recipient,
          amount: [
            {
              denom: "uosmo",
              amount: DecUtils.getTenExponentN(6)
                .mul(new Dec(amount))
                .truncate()
                .toString(),
            },
          ],
        }).finish(),
      };

      try {
        if (isExperimental && skipSimulation) {
          // Use a safe default gas when skipping simulation
          const defaultGas = "200000";
          await sendMsgs(
            window.keplr,
            selectedChain.info as any,
            key.bech32Address,
            [protoMsgs],
            {
              amount: [{ denom: "uosmo", amount: "236" }],
              gas: defaultGas,
            }
          );
        } else {
          const gasUsed = await simulateMsgs(
            selectedChain.info as any,
            key.bech32Address,
            [protoMsgs],
            [{ denom: "uosmo", amount: "236" }]
          );

          if (gasUsed) {
            await sendMsgs(
              window.keplr,
              selectedChain.info as any,
              key.bech32Address,
              [protoMsgs],
              {
                amount: [{ denom: "uosmo", amount: "236" }],
                gas: Math.floor(gasUsed * 1.5).toString(),
              }
            );
          }
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

  const signAdr36Message = async () => {
    if (window.keplr && adr36Message.trim()) {
      try {
        const key = await window.keplr?.getKey(selectedChain.id);
        if (key) {
          const signature = await window.keplr.signArbitrary(
            selectedChain.id,
            key.bech32Address,
            adr36Message
          );
          setAdr36Signature(
            JSON.stringify(
              {
                signature: signature.signature,
                pub_key: signature.pub_key,
              },
              null,
              2
            )
          );
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
          setAdr36Signature(`Error: ${e.message}`);
        }
      }
    }
  };

  const [aminoSignResult, setAminoSignResult] = useState<string>("");

  const signAminoTest = async () => {
    if (!window.keplr) return;
    try {
      const key = await window.keplr.getKey(selectedChain.id);
      const signDoc = {
        chain_id: selectedChain.id,
        account_number: "0",
        sequence: "0",
        fee: { amount: [{ denom: "uosmo", amount: "5000" }], gas: "200000" },
        msgs: [
          {
            type: "cosmos-sdk/MsgSend",
            value: {
              from_address: key.bech32Address,
              to_address: key.bech32Address,
              amount: [{ denom: "uosmo", amount: "1" }],
            },
          },
        ],
        memo: "keplr-example signAmino test",
      };
      const result = await window.keplr.signAmino(
        selectedChain.id,
        key.bech32Address,
        signDoc
      );
      setAminoSignResult(
        JSON.stringify(
          { signature: result.signature, signed: result.signed },
          null,
          2
        )
      );
    } catch (e) {
      setAminoSignResult(
        `Error: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  };

  useEffect(() => {
    void init();
    // Reset displayed data on chain change
    setAddress("");
    setBalance("");
  }, [init]);

  useEffect(() => {
    const handleKeyringChange = () => {
      fetchAllWallets();
      getKeyFromKeplr();
    };

    window.addEventListener("keplr_keystorechange", handleKeyringChange);
    return () => {
      window.removeEventListener("keplr_keystorechange", handleKeyringChange);
    };
  }, [fetchAllWallets, getKeyFromKeplr]);

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>
        Request to {selectedChain.label} via Keplr Provider
      </h2>

      <div className="item-container">
        {isExperimental && (
          <div className="item">
            <div className="item-title">Switch Cosmos Chain</div>
            <div className="item-content">
              <div style={{ display: "flex", flexDirection: "column" }}>
                Chain:
                <select
                  value={targetChainId}
                  onChange={(e) => setTargetChainId(e.target.value)}
                >
                  {chains.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: "10px" }}>
                Current Chain ID: {selectedChain.id}
              </div>
            </div>
          </div>
        )}

        <div className="item">
          <div className="item-title">Get OSMO Address</div>

          <div className="item-content">
            <div>
              <button className="keplr-button" onClick={getKeyFromKeplr}>
                Get Address
              </button>
            </div>
            <div>Address: {address}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Get OSMO Balance</div>

          <div className="item-content">
            <button className="keplr-button" onClick={getBalance}>
              Get Balance
            </button>

            <div>Balance: {balance}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Send OSMO</div>

          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Recipient:
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Amount:
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {isExperimental && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 14, opacity: 0.9 }}>
                  Skip gas simulation
                </div>
                <div
                  role="switch"
                  aria-checked={skipSimulation}
                  onClick={() => setSkipSimulation((v) => !v)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 44,
                      height: 24,
                      borderRadius: 9999,
                      background: skipSimulation ? "#4ade80" : "#cbd5e1",
                      transition: "background-color 150ms ease",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: skipSimulation ? 22 : 2,
                        width: 20,
                        height: 20,
                        borderRadius: 9999,
                        background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 150ms ease",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: "#334155" }}>
                    {skipSimulation ? "On" : "Off"}
                  </span>
                </div>
              </div>
            )}

            <button className="keplr-button" onClick={sendBalance}>
              Send
            </button>
          </div>
        </div>

        {isExperimental && (
          <div className="item">
            <div className="item-title">Wallet Management</div>

            <div className="item-content">
              <button className="keplr-button" onClick={fetchAllWallets}>
                Get All Wallets
              </button>

              {walletsError && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  Error: {walletsError}
                </div>
              )}

              {wallets.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      style={{
                        padding: "12px",
                        margin: "4px 0",
                        background: wallet.isSelected ? "#e8f5e9" : "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{ flex: 1, minWidth: 0, overflow: "hidden" }}
                        >
                          <div
                            style={{
                              fontWeight: wallet.isSelected ? "bold" : "normal",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {wallet.name} {wallet.isSelected && "(selected)"}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            ID: {wallet.id}
                          </div>
                        </div>
                        {!wallet.isSelected && (
                          <button
                            style={{ flexShrink: 0, width: "auto" }}
                            className="keplr-button"
                            onClick={async () => {
                              try {
                                setWalletsError("");
                                const keplr = window.keplr as any;
                                await keplr?.switchAccount(wallet.id);
                                const result = await keplr?.getAllWallets();
                                setWallets(result ?? []);
                              } catch (e) {
                                if (e instanceof Error) {
                                  setWalletsError(e.message);
                                }
                              }
                            }}
                          >
                            Switch
                          </button>
                        )}
                      </div>
                      {wallet.addresses &&
                        Object.keys(wallet.addresses).length > 0 && (
                          <div
                            style={{
                              marginTop: "8px",
                              paddingTop: "8px",
                              borderTop: "1px solid rgba(0,0,0,0.1)",
                              fontSize: "12px",
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            }}
                          >
                            {Object.entries(wallet.addresses).map(
                              ([chainId, addr]) => (
                                <div
                                  key={chainId}
                                  style={{ marginBottom: "2px" }}
                                >
                                  <span style={{ color: "#888" }}>
                                    {chainId}
                                  </span>
                                  : {addr as string}
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="item">
          <div className="item-title">Sign ADR-36 Message</div>

          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Message:
              <textarea
                value={adr36Message}
                onChange={(e) => setAdr36Message(e.target.value)}
                placeholder="Enter message to sign"
                style={{
                  minHeight: "80px",
                  padding: "8px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              className="keplr-button"
              onClick={signAdr36Message}
              disabled={!adr36Message.trim()}
              style={{
                marginTop: "10px",
                opacity: !adr36Message.trim() ? 0.5 : 1,
                cursor: !adr36Message.trim() ? "not-allowed" : "pointer",
              }}
            >
              Sign Message
            </button>

            {adr36Signature && (
              <div style={{ marginTop: "15px" }}>
                <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                  Signature:
                </div>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "4px",
                    overflow: "auto",
                    fontSize: "12px",
                    maxHeight: "200px",
                    wordBreak: "break-all",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {adr36Signature}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="item">
          <div className="item-title">Sign Amino (MsgSend)</div>
          <button className="keplr-button" onClick={signAminoTest}>
            Sign Amino
          </button>
          {aminoSignResult && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "12px",
                maxHeight: "200px",
                overflow: "auto",
              }}
            >
              {aminoSignResult}
            </pre>
          )}
        </div>
      </div>
    </>
  );
};
