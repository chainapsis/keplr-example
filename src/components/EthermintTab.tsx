import React, { useState } from "react";
import { EthermintChains } from "../constants";
import { BalanceView } from "./ethermint/BalanceView";
import { CosmosSign } from "./ethermint/CosmosSign";
import { EvmSign } from "./ethermint/EvmSign";
import { Eip712Sign } from "./ethermint/Eip712Sign";
import { SendTokens } from "./ethermint/SendTokens";

export const EthermintTab: React.FC = () => {
  const [selectedChainId, setSelectedChainId] = useState(EthermintChains[0].id);
  const selectedChain =
    EthermintChains.find((c) => c.id === selectedChainId) ?? EthermintChains[0];
  const [address, setAddress] = useState("");
  const [hexAddress, setHexAddress] = useState("");

  const init = async () => {
    const keplr = window.keplr;
    if (keplr) {
      await keplr.experimentalSuggestChain(selectedChain.info as any);
      await keplr.enable(selectedChain.info.chainId);
      const key = await keplr.getKey(selectedChain.info.chainId);
      setAddress(key.bech32Address);
      setHexAddress(key.ethereumHexAddress ?? "");
    }
  };

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>
        Ethermint Chain ({selectedChain.label})
      </h2>
      <div
        className="item-container"
        style={{ maxWidth: 576, overflowWrap: "anywhere" }}
      >
        <div className="item">
          <div className="item-title">Select Chain</div>
          <select
            value={selectedChainId}
            onChange={(e) => setSelectedChainId(e.target.value)}
            style={{ padding: "8px", marginRight: "8px" }}
          >
            {EthermintChains.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <button className="keplr-button" onClick={init}>
            Connect
          </button>
        </div>

        {address && (
          <>
            <div className="item">
              <div className="item-title">Addresses</div>
              <div>Bech32: {address}</div>
              <div>Hex: {hexAddress}</div>
            </div>
            <BalanceView
              chainInfo={selectedChain.info}
              bech32Address={address}
              hexAddress={hexAddress}
            />
            <CosmosSign
              chainInfo={selectedChain.info}
              bech32Address={address}
            />
            {hexAddress && (
              <EvmSign chainInfo={selectedChain.info} hexAddress={hexAddress} />
            )}
            <Eip712Sign
              chainInfo={selectedChain.info}
              bech32Address={address}
            />
            {hexAddress && (
              <SendTokens
                chainInfo={selectedChain.info}
                bech32Address={address}
                hexAddress={hexAddress}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};
