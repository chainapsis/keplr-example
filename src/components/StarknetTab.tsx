import React, { useState, useEffect } from "react";

const chainIdMap = {
  "0x534e5f4d41494e": "SN_MAIN",
  "0x534e5f5345504f4c4941": "SN_SEPOLIA",
};

export const StarknetTab: React.FC = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [currentChainId, setCurrentChainId] = useState<string>("");

  const [tokenAddress, setTokenAddress] = useState<string>(
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
  );

  const [typedDataJson, setTypedDataJson] = useState<string>(
    JSON.stringify(
      {
        types: {
          StarkNetDomain: [
            { name: "name", type: "felt" },
            { name: "version", type: "felt" },
            { name: "chainId", type: "felt" },
          ],
          Message: [{ name: "message", type: "felt" }],
        },
        primaryType: "Message",
        domain: {
          name: "Example DApp",
          version: "1",
          chainId: currentChainId === "SN_SEPOLIA" ? "SN_SEPOLIA" : "SN_MAIN",
        },
        message: {
          message: "Hello, Starknet!",
        },
      },
      null,
      2
    )
  );
  const [signedTypedData, setSignedTypedData] = useState<string>("");

  const [targetChain, setTargetChain] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        if (window.keplr?.starknet) {
          const chain = await window.keplr.starknet.request<string>({
            type: "wallet_requestChainId",
          });
          if (chain) {
            setCurrentChainId(
              `starknet:${chainIdMap[chain as keyof typeof chainIdMap]}`
            );
          }
        }
      } catch (error) {
        console.error("Failed to get chain ID:", error);
      }
    };

    init();
  }, []);

  const requestAccounts = async () => {
    try {
      const result = await window.keplr?.starknet.request<string[]>({
        type: "wallet_requestAccounts",
      });

      if (result && Array.isArray(result)) {
        setAccounts(result);
      }
    } catch (error) {
      console.error("Failed to request accounts:", error);
    }
  };

  const switchChain = async () => {
    try {
      await window.keplr?.starknet.request({
        type: "wallet_switchStarknetChain",
        params: { chainId: targetChain },
      });

      const chain = await window.keplr?.starknet.request<string>({
        type: "wallet_requestChainId",
      });

      if (chain) {
        setCurrentChainId(
          `starknet:${chainIdMap[chain as keyof typeof chainIdMap]}`
        );
      }
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [formattedStrkBalance, setFormattedStrkBalance] = useState<string>("0");

  const getBlockNumber = async () => {
    try {
      const result = await window.keplr?.starknet.request<number>({
        type: "starknet_blockNumber",
      });

      if (result) {
        setBlockNumber(result);
      }
    } catch (error) {
      console.error("Failed to get block number:", error);
    }
  };

  const getStrkBalance = async () => {
    try {
      const addresses = await window.keplr?.starknet.request<string[]>({
        type: "wallet_requestAccounts",
      });

      if (addresses) {
        const result = await window.keplr?.starknet.request<string[]>({
          type: "starknet_call",
          params: {
            block_id: "latest",
            request: {
              contract_address:
                "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
              entry_point_selector:
                "0x02e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e",
              calldata: [addresses[0]],
            },
          },
        });
        if (result) {
          const rawBalance = (
            (BigInt(result[1]) << BigInt(128)) |
            BigInt(result[0])
          ).toString();

          const decimals = 18;
          let formatted = formatTokenBalance(rawBalance, decimals);
          setFormattedStrkBalance(formatted);
        }
      }
    } catch (error) {
      console.error("Failed to get STRK balance:", error);
    }
  };

  const formatTokenBalance = (value: string, decimals: number): string => {
    if (!value || value === "0") return "0";

    if (value.length <= decimals) {
      return `0.${"0".repeat(decimals - value.length)}${value}`;
    }

    const integerPart = value.slice(0, value.length - decimals);
    const fractionalPart = value.slice(value.length - decimals);

    const trimmedFractionalPart = fractionalPart.replace(/0+$/, "");

    if (trimmedFractionalPart.length === 0) {
      return integerPart;
    }

    return `${integerPart}.${trimmedFractionalPart}`;
  };

  const suggestToken = async () => {
    try {
      await window.keplr?.starknet.request({
        type: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
          },
        },
      });
    } catch (error) {
      console.error("Failed to suggest token:", error);
    }
  };

  const signTypedData = async () => {
    try {
      let typedData;
      try {
        typedData = JSON.parse(typedDataJson);
      } catch (e) {
        alert("타입 데이터 형식이 잘못되었습니다. 유효한 JSON을 입력하세요.");
        return;
      }

      const result = await window.keplr?.starknet.request({
        type: "wallet_signTypedData",
        params: typedData,
      });

      setSignedTypedData(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Failed to sign typed data:", error);
      setSignedTypedData(
        `오류: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>
        Request to Starknet Chain via Keplr Starknet Provider
      </h2>
      <div className="item-container">
        <div className="item">
          <div className="item-title">Account Info</div>
          <div className="item-content">
            <button className="keplr-button" onClick={requestAccounts}>
              Request Accounts
            </button>

            {accounts.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <span>Address: </span>
                <span>{accounts[0] || "Not connected"}</span>
              </div>
            )}
          </div>
        </div>

        <div className="item">
          <div className="item-title">Switch Chain</div>
          <div className="item-content">
            <div style={{ display: "flex", flexDirection: "column" }}>
              Chain ID:
              <select
                value={targetChain}
                onChange={(e) => setTargetChain(e.target.value)}
              >
                <option value="">Select Chain</option>
                <option value="0x534e5f4d41494e">Starknet Mainnet</option>
                <option value="0x534e5f5345504f4c4941">Starknet Sepolia</option>
              </select>
            </div>

            <button className="keplr-button" onClick={switchChain}>
              Switch Chain
            </button>
            <div style={{ marginTop: "10px" }}>
              <div>Current Chain ID: {currentChainId || "Not connected"}</div>
            </div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Get Data From RPC Node</div>
          <div className="item-content">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button className="keplr-button" onClick={getBlockNumber}>
                Get Block Number
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button className="keplr-button" onClick={getStrkBalance}>
                Get STRK Balance
              </button>
            </div>
            <div style={{ marginTop: "10px" }}>
              <div>Current Block Number: {blockNumber}</div>
              <div>STRK Balance: {formattedStrkBalance} STRK</div>
            </div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Suggest ERC20 Token</div>
          <div className="item-content">
            <div style={{ display: "flex", flexDirection: "column" }}>
              Token Address:
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter token address"
              />
            </div>

            <button className="keplr-button" onClick={suggestToken}>
              Suggest Token
            </button>
          </div>
        </div>

        <div className="item">
          <div className="item-title">Sign Typed Data</div>
          <div className="item-content">
            <div style={{ display: "flex", flexDirection: "column" }}>
              Typed Data (JSON):
              <textarea
                value={typedDataJson}
                onChange={(e) => setTypedDataJson(e.target.value)}
                placeholder="Enter typed data in JSON format"
                style={{ minHeight: "150px" }}
              />
            </div>

            <button className="keplr-button" onClick={signTypedData}>
              Sign Typed Data
            </button>

            {signedTypedData && (
              <div style={{ marginTop: "10px" }}>
                <div>Signature:</div>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    background: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "5px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {signedTypedData}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
