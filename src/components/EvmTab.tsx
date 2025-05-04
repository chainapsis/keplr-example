import React, { useState, useEffect } from "react";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { isAddress } from "@ethersproject/address";

export const EvmTab: React.FC = () => {
  const [evmResult1, setEvmResult1] = useState<string>("");
  const [evmResult2, setEvmResult2] = useState<string>("");
  const [evmResult3, setEvmResult3] = useState<string>("");
  const [evmRecipient, setEvmRecipient] = useState<string>("");
  const [evmAmount, setEvmAmount] = useState<string>("");
  const [evmResult4, setEvmResult4] = useState<string>("");
  const [evmChainId, setEvmChainId] = useState<string>("");
  const [evmTokenAddress, setEvmTokenAddress] = useState<string>("");
  const [keplrEip6963ProviderInfo, setKeplrEip6963ProviderInfo] =
    useState<any>();

  useEffect(() => {
    const handleAnnounceProvider = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail.info.rdns === "app.keplr") {
        setKeplrEip6963ProviderInfo(event.detail.info);
      }
    };

    window.addEventListener("eip6963:announceProvider", handleAnnounceProvider);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        handleAnnounceProvider
      );
    };
  }, []);

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>
        Request to EVM Chain via Keplr Ethereum Provider
      </h2>

      <div
        className="item-container"
        style={{ maxWidth: 576, overflowWrap: "anywhere" }}
      >
        {keplrEip6963ProviderInfo && (
          <div className="item">
            <div className="item-title">EIP-6963 Provider Info</div>

            <div className="item-content">
              <div>UUID: {keplrEip6963ProviderInfo.uuid}</div>
              <div>Name: {keplrEip6963ProviderInfo.name}</div>
              <div>RDNS: {keplrEip6963ProviderInfo.rdns}</div>
              <div>
                Icon:{" "}
                <img
                  src={keplrEip6963ProviderInfo.icon}
                  alt={keplrEip6963ProviderInfo.name}
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
        )}

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
                    const result = await window.keplr?.ethereum?.request({
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
              },
            ].map(({ method }) => (
              <div key={method}>
                <button
                  className="keplr-button"
                  onClick={async () => {
                    const params = (() => {
                      switch (method) {
                        case "eth_getBalance":
                          return [
                            window.keplr?.ethereum?.selectedAddress,
                            "latest",
                          ];
                        default:
                          return;
                      }
                    })();

                    const result = await window.keplr?.ethereum?.request({
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
              },
              {
                method: "eth_signTypedData_v3",
              },
              {
                method: "eth_signTypedData_v4",
              },
            ].map(({ method }) => (
              <div key={method}>
                <button
                  className="keplr-button"
                  onClick={async () => {
                    const params = (() => {
                      switch (method) {
                        case "personal_sign":
                          return [
                            "0x536d9d5261206b3fd7ca989fe1c0afa69de8a1c673a14fcd5c98e1a641fad979",
                            window.keplr?.ethereum?.selectedAddress,
                          ];
                        case "eth_signTypedData_v3":
                          return [
                            window.keplr?.ethereum?.selectedAddress,
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
                                  wallet:
                                    "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
                                },
                                to: {
                                  name: "Bob",
                                  wallet:
                                    "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                                },
                                contents: "Hello, Bob!",
                              },
                            },
                          ];
                        case "eth_signTypedData_v4":
                          return [
                            window.keplr?.ethereum?.selectedAddress,
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
                                  {
                                    name: "verifyingContract",
                                    type: "address",
                                  },
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
                          ];
                        default:
                          return [];
                      }
                    })();

                    const result = await window.keplr?.ethereum?.request({
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

                const currentChainId = window.keplr?.ethereum?._currentChainId;

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
                  from: window.keplr?.ethereum?.selectedAddress,
                  to: evmRecipient,
                  value: amountValue,
                };

                const result = await window.keplr?.ethereum?.request({
                  method: "eth_sendTransaction",
                  params: [tx],
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
          <div className="item-title">Add an EVM Chain</div>

          <div className="item-content">
            <div>Chain ID: 0x64</div>
            <div>ChainName: Gnosis</div>
            <div>RPC URL: https://rpc.gnosischain.com</div>
            <button
              className="keplr-button"
              onClick={async () => {
                await window.keplr?.ethereum?.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x64",
                      chainName: "Gnosis",
                      rpcUrls: [
                        "https://rpc.gnosischain.com",
                        "wss://rpc.gnosischain.com",
                      ],
                      iconUrls: [
                        "https://xdaichain.com/fake/example/url/xdai.svg",
                        "https://xdaichain.com/fake/example/url/xdai.png",
                      ],
                      nativeCurrency: {
                        name: "XDAI",
                        symbol: "XDAI",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://blockscout.com/poa/xdai/"],
                    },
                  ],
                });
              }}
            >
              {"wallet_addEthereumChain"}
            </button>
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
                await window.keplr?.ethereum?.request({
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
                await window.keplr?.ethereum?.request({
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
    </>
  );
};
