import React, { useState, useEffect } from "react";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { isAddress } from "@ethersproject/address";
import {
  createWalletClient,
  custom,
  extractChain,
  GetCallsStatusReturnType,
  GetCapabilitiesReturnType,
} from "viem";
import { base, mainnet, optimism } from "viem/chains";

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
        <EIP5792 />
      </div>
    </>
  );
};

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

const EIP5792: React.FC = () => {
  const [walletCapabilities, setWalletCapabilities] =
    useState<GetCapabilitiesReturnType | null>(null);
  const [sendCallsResult, setSendCallsResult] = useState<string | null>(null);
  const [getCallsStatusResult, setGetCallsStatusResult] =
    useState<GetCallsStatusReturnType | null>(null);
  const [getCallsStatusId, setGetCallsStatusId] = useState<string>("");
  const [showCallsStatusId, setShowCallsStatusId] = useState<string>("");

  // For sendCalls input management
  const [calls, setCalls] = useState<{ address: string; amount: string }[]>([
    { address: "", amount: "" },
  ]);

  const client = createWalletClient({
    transport: custom(window.keplr?.ethereum),
  });

  const getWalletCapabilities = async () => {
    const capabilities = await client.getCapabilities({});
    setWalletCapabilities(capabilities);
  };

  const sendCalls = async () => {
    const chainId = await client.getChainId();
    const sendCallsParams = calls.map((call) => ({
      to: call.address as `0x${string}`,
      value: BigInt(call.amount),
    }));

    const chain = extractChain({
      chains: [base, mainnet, optimism],
      id: chainId as any,
    });

    const { id } = await client.sendCalls({
      calls: sendCallsParams,
      chain,
    });

    setSendCallsResult(id);
  };
  const getCallsStatus = async () => {
    if (!getCallsStatusId) return;
    const status = await client.getCallsStatus({
      id: getCallsStatusId,
    });
    setGetCallsStatusResult(status);
  };
  const showCallsStatus = async () => {
    if (!showCallsStatusId) return;
    await client.showCallsStatus({
      id: showCallsStatusId,
    });
  };

  const renderResult = (result: any) => (
    <div style={{ marginTop: 8 }}>
      {result ? (
        <pre
          style={{
            background: "#f5f5f5",
            padding: "8px",
            borderRadius: "4px",
            maxHeight: "200px",
            overflow: "auto",
            fontSize: "13px",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : (
        <span style={{ color: "#888" }}>No result</span>
      )}
    </div>
  );

  // Add a new call input box (up to 5)
  const addCall = () => {
    if (calls.length < 5) {
      setCalls([...calls, { address: "", amount: "" }]);
    }
  };

  // Remove a call input box
  const removeCall = (idx: number) => {
    setCalls(calls.filter((_, i) => i !== idx));
  };

  // Update a call input
  const updateCall = (
    idx: number,
    field: "address" | "amount",
    value: string
  ) => {
    setCalls(
      calls.map((call, i) => (i === idx ? { ...call, [field]: value } : call))
    );
  };

  return (
    <div className="item">
      <div className="item-title">EIP-5792: Wallet Calls</div>
      <div className="item-content">
        <div className="sub-item">
          <div className="sub-item-title">Get Wallet Capabilities</div>
          <div className="sub-item-content">
            <button className="keplr-button" onClick={getWalletCapabilities}>
              wallet_getCapabilities
            </button>
            {renderResult(walletCapabilities)}
          </div>
        </div>

        <div className="sub-item">
          <div className="sub-item-title">Send Calls</div>
          <div className="sub-item-content">
            {calls.map((call, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  type="text"
                  placeholder="Address"
                  value={call.address}
                  onChange={(e) => updateCall(idx, "address", e.target.value)}
                  style={{ flex: 2, minWidth: 0 }}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={call.amount}
                  onChange={(e) => updateCall(idx, "amount", e.target.value)}
                  style={{ flex: 1, minWidth: 0 }}
                />
                {calls.length > 1 && (
                  <button
                    className="keplr-button"
                    style={{
                      background: "#eee",
                      color: "#333",
                      width: 28,
                      minWidth: 28,
                      height: 28,
                      padding: 0,
                      flex: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: "bold",
                      lineHeight: 1,
                    }}
                    onClick={() => removeCall(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              className="keplr-button"
              onClick={addCall}
              disabled={calls.length >= 5}
              style={{ marginBottom: 10 }}
            >
              + Add Call
            </button>
            <button className="keplr-button" onClick={sendCalls}>
              wallet_sendCalls
            </button>
            {renderResult(sendCallsResult)}
          </div>
        </div>

        <div className="sub-item">
          <div className="sub-item-title">Get Calls Status</div>
          <div className="sub-item-content">
            <input
              type="text"
              placeholder="Enter id"
              value={getCallsStatusId}
              onChange={(e) => setGetCallsStatusId(e.target.value)}
              style={{ marginBottom: 8, width: "100%" }}
            />
            <button className="keplr-button" onClick={getCallsStatus}>
              wallet_getCallsStatus
            </button>
            {renderResult(getCallsStatusResult)}
          </div>
        </div>

        <div className="sub-item">
          <div className="sub-item-title">Show Calls Status</div>
          <div className="sub-item-content">
            <input
              type="text"
              placeholder="Enter id"
              value={showCallsStatusId}
              onChange={(e) => setShowCallsStatusId(e.target.value)}
              style={{ marginBottom: 8, width: "100%" }}
            />
            <button className="keplr-button" onClick={showCallsStatus}>
              wallet_showCallsStatus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
