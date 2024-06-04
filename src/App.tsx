import React, { useEffect } from "react";
import { OsmosisChainInfo } from "./constants";
import { Balances } from "./types/balance";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { isAddress } from "@ethersproject/address";
import { sendMsgs } from "./util/sendMsgs";
import { api } from "./util/api";
import { simulateMsgs } from "./util/simulateMsgs";
import { MsgSend } from "./proto-types-gen/src/cosmos/bank/v1beta1/tx";
import "./styles/container.css";
import "./styles/button.css";
import "./styles/item.css";

function App() {
  const [address, setAddress] = React.useState<string>("");
  const [balance, setBalance] = React.useState<string>("");
  const [recipient, setRecipient] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");

  const [evmResult1, setEvmResult1] = React.useState<string>("");

  const [evmResult2, setEvmResult2] = React.useState<string>("");

  const [evmResult3, setEvmResult3] = React.useState<string>("");

  const [evmRecipient, setEvmRecipient] = React.useState<string>("");
  const [evmAmount, setEvmAmount] = React.useState<string>("");
  const [evmResult4, setEvmResult4] = React.useState<string>("");

  const [evmChainId, setEvmChainId] = React.useState<string>("");

  const [evmTokenAddress, setEvmTokenAddress] = React.useState<string>("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const keplr = window.keplr;
    if (keplr) {
      try {
        await keplr.experimentalSuggestChain(OsmosisChainInfo);
        if (!keplr.ethereum.isConnected()) {
          await keplr.ethereum.enable();
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

  const getKeyFromKeplr = async () => {
    const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);
    if (key) {
      setAddress(key.bech32Address);
    }
  };

  const getBalance = async () => {
    const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);

    if (key) {
      const uri = `${OsmosisChainInfo.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;

      const data = await api<Balances>(uri);
      const balance = data.balances.find(
        (balance) => balance.denom === "uosmo"
      );
      const osmoDecimal = OsmosisChainInfo.currencies.find(
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
      const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);
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
        const gasUsed = await simulateMsgs(
          OsmosisChainInfo,
          key.bech32Address,
          [protoMsgs],
          [{ denom: "uosmo", amount: "236" }]
        );

        if (gasUsed) {
          await sendMsgs(
            window.keplr,
            OsmosisChainInfo,
            key.bech32Address,
            [protoMsgs],
            {
              amount: [{ denom: "uosmo", amount: "236" }],
              gas: Math.floor(gasUsed * 1.5).toString(),
            }
          );
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

  return (
    <div className="root-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <img
          src="/keplr-logo.png"
          style={{ maxWidth: "200px" }}
          alt="keplr-logo"
        />
      </div>

      <h2 style={{ marginTop: "30px" }}>
        Request to Osmosis Testnet via Keplr Provider
      </h2>

      <div className="item-container">
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

            <button className="keplr-button" onClick={sendBalance}>
              Send
            </button>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: "60px" }}>
        Request to EVM Chain via Keplr Ethereum Provider
      </h2>

      <div
        className="item-container"
        style={{ maxWidth: 576, overflowWrap: "anywhere" }}
      >
        <div className="item">
          <div className="item-title">Get Data From Wallet</div>

          <div className="item-content">
            {[
              {
                method: "eth_chainId",
              },
              {
                method: "eth_accounts",
              },
            ].map(({ method }) => (
              <div key={method}>
                <button
                  className="keplr-button"
                  onClick={async () => {
                    const result = await window.keplr?.ethereum.request({
                      method,
                    });
                    setEvmResult1(result.toString());
                  }}
                >
                  {method}
                </button>
              </div>
            ))}

            <div>Result: {evmResult1}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Get Data From RPC Node</div>

          <div className="item-content">
            {[
              {
                method: "eth_blockNumber",
              },
              {
                method: "eth_getBalance",
                params: [window.keplr?.ethereum.selectedAddress, "latest"],
              },
            ].map(({ method, params }) => (
              <div key={method}>
                <button
                  className="keplr-button"
                  onClick={async () => {
                    const result = await window.keplr?.ethereum.request({
                      method,
                      params,
                    });
                    setEvmResult2(result);
                  }}
                >
                  {method}
                </button>
              </div>
            ))}

            <div>Result: {evmResult2}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Sign Data</div>

          <div className="item-content">
            {[
              {
                method: "personal_sign",
                params: [
                  "This is an example message",
                  window.keplr?.ethereum.selectedAddress,
                ],
              },
              {
                method: "eth_signTypedData_v3",
                params: [
                  window.keplr?.ethereum.selectedAddress,
                  {
                    types: {
                      EIP712Domain: [
                        {
                          name: "name",
                          type: "string",
                        },
                        {
                          name: "version",
                          type: "string",
                        },
                        {
                          name: "chainId",
                          type: "uint256",
                        },
                        {
                          name: "verifyingContract",
                          type: "address",
                        },
                      ],
                      Person: [
                        {
                          name: "name",
                          type: "string",
                        },
                        {
                          name: "wallet",
                          type: "address",
                        },
                      ],
                      Mail: [
                        {
                          name: "from",
                          type: "Person",
                        },
                        {
                          name: "to",
                          type: "Person",
                        },
                        {
                          name: "contents",
                          type: "string",
                        },
                      ],
                    },
                    primaryType: "Mail",
                    domain: {
                      name: "Ether Mail",
                      version: 1,
                      chainId: 1,
                      verifyingContract:
                        "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
                    },
                    message: {
                      from: {
                        name: "Cow",
                        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
                      },
                      to: {
                        name: "Bob",
                        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                      },
                      contents: "Hello, Bob!",
                    },
                  },
                ],
              },
              {
                method: "eth_signTypedData_v4",
                params: [
                  window.keplr?.ethereum.selectedAddress,
                  {
                    domain: {
                      chainId: 1,
                      name: "Ether Mail",
                      verifyingContract:
                        "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
                      version: "1",
                    },
                    message: {
                      contents: "Hello, Bob!",
                      attachedMoneyInEth: 4.2,
                      from: {
                        name: "Cow",
                        wallets: [
                          "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
                          "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
                        ],
                      },
                      to: [
                        {
                          name: "Bob",
                          wallets: [
                            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                            "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
                            "0xB0B0b0b0b0b0B000000000000000000000000000",
                          ],
                        },
                      ],
                    },
                    // This refers to the keys of the following types object.
                    primaryType: "Mail",
                    types: {
                      EIP712Domain: [
                        { name: "name", type: "string" },
                        { name: "version", type: "string" },
                        { name: "chainId", type: "uint256" },
                        { name: "verifyingContract", type: "address" },
                      ],
                      Mail: [
                        { name: "from", type: "Person" },
                        { name: "to", type: "Person[]" },
                        { name: "contents", type: "string" },
                      ],
                      Person: [
                        { name: "name", type: "string" },
                        { name: "wallets", type: "address[]" },
                      ],
                    },
                  },
                ],
              },
            ].map(({ method, params }) => (
              <div key={method}>
                <button
                  className="keplr-button"
                  onClick={async () => {
                    const result = await window.keplr?.ethereum.request({
                      method,
                      params,
                    });
                    setEvmResult3(result);
                  }}
                >
                  {method}
                </button>
              </div>
            ))}

            <div>Signature: {evmResult3}</div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Send Native Token</div>

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
                value={evmRecipient}
                onChange={(e) => setEvmRecipient(e.target.value)}
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
                type="number"
                value={evmAmount}
                onChange={(e) => setEvmAmount(e.target.value)}
              />
            </div>
            <button
              className="keplr-button"
              onClick={async () => {
                const parsedEvmAmount = parseFloat(evmAmount);

                if (isNaN(parsedEvmAmount) || !isAddress(evmRecipient)) {
                  return;
                }

                const currentChainId = window.keplr?.ethereum._currentChainId;

                const currentChainInfo =
                  await window.keplr?.getChainInfoWithoutEndpoints(
                    currentChainId
                  );

                if (currentChainInfo === undefined) {
                  return;
                }

                const mainCurrency =
                  currentChainInfo.stakeCurrency ??
                  currentChainInfo.currencies[0];

                const amountValue = `0x${parseInt(
                  new Dec(parsedEvmAmount)
                    .mulTruncate(
                      DecUtils.getTenExponentN(mainCurrency.coinDecimals)
                    )
                    .toString()
                ).toString(16)}`;

                const tx = {
                  from: window.keplr?.ethereum.selectedAddress,
                  to: evmRecipient,
                  value: amountValue,
                };

                const gasUsed = await window.keplr?.ethereum.request({
                  method: "eth_estimateGas",
                  params: [tx],
                });

                const result = await window.keplr?.ethereum.request({
                  method: "eth_sendTransaction",
                  params: [{ ...tx, gas: gasUsed }],
                });
                setEvmResult4(result);
              }}
            >
              {"eth_sendTransaction"}
            </button>

            <div>Transaction Hash: {evmResult4}</div>
          </div>
        </div>
        <div className="item">
          <div className="item-title">Switch to another EVM Chain</div>

          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              EVM Chain ID:
              <input
                type="number"
                value={evmChainId}
                onChange={(e) => setEvmChainId(e.target.value)}
              />
            </div>
            <button
              className="keplr-button"
              onClick={async () => {
                await window.keplr?.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [
                    {
                      chainId: `0x${parseInt(evmChainId).toString(16)}`,
                    },
                  ],
                });
              }}
            >
              {"wallet_switchEthereumChain"}
            </button>
          </div>
        </div>
        <div className="item">
          <div className="item-title">Add ERC20 Token</div>

          <div className="item-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              ERC20 Token Address:
              <input
                type="text"
                value={evmTokenAddress}
                onChange={(e) => setEvmTokenAddress(e.target.value)}
              />
            </div>
            <button
              className="keplr-button"
              onClick={async () => {
                await window.keplr?.ethereum.request({
                  method: "wallet_watchAsset",
                  params: {
                    type: "ERC20",
                    options: {
                      address: evmTokenAddress,
                    },
                  },
                });
              }}
            >
              {"wallet_watchAsset"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
