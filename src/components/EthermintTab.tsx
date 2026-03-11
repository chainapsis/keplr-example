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
  const [selectedChainId, setSelectedChainId] = useState(EthermintChains[0].id);
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

  const selectedChain =
    EthermintChains.find((c) => c.id === selectedChainId) ?? EthermintChains[0];
  const state = chainStates[selectedChainId];

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>
        Ethermint Chain ({selectedChain.label})
      </h2>

      <div className="item-container">
        <div className="item">
          <div className="item-title">Connection</div>
          <div className="item-content">
            <select
              value={selectedChainId}
              onChange={(e) => setSelectedChainId(e.target.value)}
            >
              {EthermintChains.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
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
              chainInfo={selectedChain.info}
              bech32Address={state.address}
              hexAddress={state.hexAddress}
            />
            <CosmosSign
              chainInfo={selectedChain.info}
              bech32Address={state.address}
            />
            {state.hexAddress && (
              <EvmSign
                chainInfo={selectedChain.info}
                hexAddress={state.hexAddress}
              />
            )}
            <Eip712Sign
              chainInfo={selectedChain.info}
              bech32Address={state.address}
            />
            {state.hexAddress && (
              <SendTokens
                chainInfo={selectedChain.info}
                bech32Address={state.address}
                hexAddress={state.hexAddress}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};
