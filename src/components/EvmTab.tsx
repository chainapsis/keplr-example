import React, { useState, useEffect } from "react";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { isAddress } from "@ethersproject/address";

const ProviderInfo: React.FC<{ providerInfo: any }> = ({ providerInfo }) => {
  if (!providerInfo) return null;

  return (
    <div className="item">
      <div className="item-title">EIP-6963 Provider Info</div>
      <div className="item-content">
        <div>UUID: {providerInfo.uuid}</div>
        <div>Name: {providerInfo.name}</div>
        <div>RDNS: {providerInfo.rdns}</div>
        <div>
          Icon:{" "}
          <img
            src={providerInfo.icon}
            alt={providerInfo.name}
            width={32}
            height={32}
          />
        </div>
      </div>
    </div>
  );
};

const WalletData: React.FC = () => {
  const [result, setResult] = useState<string>("");

  return (
    <div className="item">
      <div className="item-title">Get Data From Wallet</div>
      <div className="item-content">
        {[{ method: "eth_chainId" }, { method: "eth_accounts" }].map(
          ({ method }) => (
            <div key={method}>
              <button
                className="keplr-button"
                onClick={async () => {
                  const result = await window.keplr?.ethereum?.request({
                    method,
                  });
                  setResult(result.toString());
                }}
              >
                {method}
              </button>
            </div>
          )
        )}
        <div>Result: {result}</div>
      </div>
    </div>
  );
};

const RpcData: React.FC = () => {
  const [result, setResult] = useState<string>("");

  return (
    <div className="item">
      <div className="item-title">Get Data From RPC Node</div>
      <div className="item-content">
        {[{ method: "eth_blockNumber" }, { method: "eth_getBalance" }].map(
          ({ method }) => (
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
                  setResult(result);
                }}
              >
                {method}
              </button>
            </div>
          )
        )}
        <div>Result: {result}</div>
      </div>
    </div>
  );
};

const SignData: React.FC = () => {
  const [signature, setSignature] = useState<string>("");

  const getSignParams = (method: string) => {
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
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
              ],
              Person: [
                { name: "name", type: "string" },
                { name: "wallet", type: "address" },
              ],
              Mail: [
                { name: "from", type: "Person" },
                { name: "to", type: "Person" },
                { name: "contents", type: "string" },
              ],
            },
            primaryType: "Mail",
            domain: {
              name: "Ether Mail",
              version: 1,
              chainId: 1,
              verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
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
        ];
      case "eth_signTypedData_v4":
        return [
          window.keplr?.ethereum?.selectedAddress,
          {
            domain: {
              chainId: 1,
              name: "Ether Mail",
              verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
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
        ];
      default:
        return [];
    }
  };

  return (
    <div className="item">
      <div className="item-title">Sign Data</div>
      <div className="item-content">
        {[
          { method: "personal_sign" },
          { method: "eth_signTypedData_v3" },
          { method: "eth_signTypedData_v4" },
        ].map(({ method }) => (
          <div key={method}>
            <button
              className="keplr-button"
              onClick={async () => {
                const params = getSignParams(method);
                const result = await window.keplr?.ethereum?.request({
                  method,
                  params,
                });
                setSignature(result);
              }}
            >
              {method}
            </button>
          </div>
        ))}
        <div>Signature: {signature}</div>
      </div>
    </div>
  );
};

const SendNativeToken: React.FC = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const handleSend = async () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || !isAddress(recipient)) {
      return;
    }

    const currentChainId = window.keplr?.ethereum?._currentChainId;
    const currentChainInfo = await window.keplr?.getChainInfoWithoutEndpoints(
      currentChainId
    );

    if (currentChainInfo === undefined) {
      return;
    }

    const mainCurrency =
      currentChainInfo.stakeCurrency ?? currentChainInfo.currencies[0];
    const amountValue = `0x${parseInt(
      new Dec(parsedAmount)
        .mulTruncate(DecUtils.getTenExponentN(mainCurrency.coinDecimals))
        .toString()
    ).toString(16)}`;

    const tx = {
      from: window.keplr?.ethereum?.selectedAddress,
      to: recipient,
      value: amountValue,
    };

    const result = await window.keplr?.ethereum?.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
    setTxHash(result);
  };

  return (
    <div className="item">
      <div className="item-title">Send Native Token</div>
      <div className="item-content">
        <div style={{ display: "flex", flexDirection: "column" }}>
          Recipient:
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button className="keplr-button" onClick={handleSend}>
          eth_sendTransaction
        </button>
        <div>Transaction Hash: {txHash}</div>
      </div>
    </div>
  );
};

const AddEVMChain: React.FC = () => {
  return (
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
          wallet_addEthereumChain
        </button>
      </div>
    </div>
  );
};

const SwitchEVMChain: React.FC = () => {
  const [chainId, setChainId] = useState<string>("");

  return (
    <div className="item">
      <div className="item-title">Switch to another EVM Chain</div>
      <div className="item-content">
        <div style={{ display: "flex", flexDirection: "column" }}>
          EVM Chain ID:
          <input
            type="number"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
          />
        </div>
        <button
          className="keplr-button"
          onClick={async () => {
            await window.keplr?.ethereum?.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: `0x${parseInt(chainId).toString(16)}`,
                },
              ],
            });
          }}
        >
          wallet_switchEthereumChain
        </button>
      </div>
    </div>
  );
};

const AddERC20Token: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState<string>("");

  return (
    <div className="item">
      <div className="item-title">Add ERC20 Token</div>
      <div className="item-content">
        <div style={{ display: "flex", flexDirection: "column" }}>
          ERC20 Token Address:
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
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
                  address: tokenAddress,
                },
              },
            });
          }}
        >
          wallet_watchAsset
        </button>
      </div>
    </div>
  );
};

export const EvmTab: React.FC = () => {
  const [keplrEip6963ProviderInfo, setKeplrEip6963ProviderInfo] =
    useState<any>();

  useEffect(() => {
    const init = async () => {
      const keplr = window.keplr;
      if (keplr) {
        if (!keplr.ethereum?.isConnected()) {
          try {
            await keplr.ethereum?.enable();
          } catch (e) {
            if (e instanceof Error) {
              console.log(e.message);
            }
          }
        }
      }
    };

    const handleAnnounceProvider = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail.info.rdns === "app.keplr") {
        setKeplrEip6963ProviderInfo(event.detail.info);
      }
    };

    init();
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
        <ProviderInfo providerInfo={keplrEip6963ProviderInfo} />
        <WalletData />
        <RpcData />
        <SignData />
        <SendNativeToken />
        <AddEVMChain />
        <SwitchEVMChain />
        <AddERC20Token />
      </div>
    </>
  );
};
