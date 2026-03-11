import React, { useCallback, useEffect, useState } from "react";
import { EthermintChains } from "../constants";
import { BalanceView } from "./ethermint/BalanceView";
import { CosmosSign } from "./ethermint/CosmosSign";
import { EvmSign } from "./ethermint/EvmSign";
import { Eip712Sign } from "./ethermint/Eip712Sign";
import { SendTokens } from "./ethermint/SendTokens";

interface ChainState {
  address: string;
  hexAddress: string;
  error: string;
}

const emptyState: ChainState = { address: "", hexAddress: "", error: "" };

export const EthermintTab: React.FC = () => {
  const [chainStates, setChainStates] = useState<Record<string, ChainState>>(
    () =>
      Object.fromEntries(EthermintChains.map((c) => [c.id, { ...emptyState }]))
  );

  const connectAll = useCallback(async () => {
    const keplr = window.keplr;
    if (!keplr) return;

    for (const chain of EthermintChains) {
      try {
        await keplr.experimentalSuggestChain(chain.info as any);
        await keplr.enable(chain.info.chainId);
        const key = await keplr.getKey(chain.info.chainId);
        setChainStates((prev) => ({
          ...prev,
          [chain.id]: {
            address: key.bech32Address,
            hexAddress: key.ethereumHexAddress ?? "",
            error: "",
          },
        }));
      } catch (e) {
        setChainStates((prev) => ({
          ...prev,
          [chain.id]: {
            ...emptyState,
            error: e instanceof Error ? e.message : String(e),
          },
        }));
      }
    }
  }, []);

  useEffect(() => {
    void connectAll();
  }, [connectAll]);

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>Ethermint Chains</h2>

      {EthermintChains.map((chain) => {
        const state = chainStates[chain.id];
        return (
          <div key={chain.id} style={{ marginTop: 24 }}>
            <h3 style={{ margin: "0 0 12px" }}>{chain.label}</h3>

            <div className="item-container">
              <div className="item">
                <div className="item-title">Connection</div>
                <div className="item-content">
                  {state.error ? (
                    <div style={{ color: "#dc2626" }}>Error: {state.error}</div>
                  ) : state.address ? (
                    <>
                      <div>
                        <span style={{ color: "#6b7280" }}>Bech32:</span>{" "}
                        <span style={{ fontFamily: "monospace", fontSize: 13 }}>
                          {state.address}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Hex:</span>{" "}
                        <span style={{ fontFamily: "monospace", fontSize: 13 }}>
                          {state.hexAddress}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: "#9ca3af" }}>Connecting...</div>
                  )}
                </div>
              </div>

              {state.address && (
                <>
                  <BalanceView
                    chainInfo={chain.info}
                    bech32Address={state.address}
                    hexAddress={state.hexAddress}
                  />
                  <CosmosSign
                    chainInfo={chain.info}
                    bech32Address={state.address}
                  />
                  {state.hexAddress && (
                    <EvmSign
                      chainInfo={chain.info}
                      hexAddress={state.hexAddress}
                    />
                  )}
                  <Eip712Sign
                    chainInfo={chain.info}
                    bech32Address={state.address}
                  />
                  {state.hexAddress && (
                    <SendTokens
                      chainInfo={chain.info}
                      bech32Address={state.address}
                      hexAddress={state.hexAddress}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
