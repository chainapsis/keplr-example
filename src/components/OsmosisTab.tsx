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
    OsmosisTestnetChainInfo.chainId,
  );

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
    [],
  );

  const selectedChain = useMemo(
    () => chains.find((c) => c.id === targetChainId) ?? chains[0],
    [chains, targetChainId],
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

  const getKeyFromKeplr = async () => {
    const key = await window.keplr?.getKey(selectedChain.id);
    if (key) {
      setAddress(key.bech32Address);
    }
  };

  const getBalance = async () => {
    const key = await window.keplr?.getKey(selectedChain.id);

    if (key) {
      const uri = `${selectedChain.info.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;

      const data = await api<Balances>(uri);
      const balance = data.balances.find(
        (balance) => balance.denom === "uosmo",
      );
      const osmoDecimal = selectedChain.info.currencies.find(
        (currency) => currency.coinMinimalDenom === "uosmo",
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
            },
          );
        } else {
          const gasUsed = await simulateMsgs(
            selectedChain.info as any,
            key.bech32Address,
            [protoMsgs],
            [{ denom: "uosmo", amount: "236" }],
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
              },
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

  useEffect(() => {
    void init();
    // Reset displayed data on chain change
    setAddress("");
    setBalance("");
  }, [init]);

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
      </div>
    </>
  );
};
