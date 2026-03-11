import React, { useState } from "react";
import { ZetaChainInfo } from "../constants";
import { BalanceView } from "./ethermint/BalanceView";
import { CosmosSign } from "./ethermint/CosmosSign";
import { EvmSign } from "./ethermint/EvmSign";
import { Eip712Sign } from "./ethermint/Eip712Sign";
import { SendTokens } from "./ethermint/SendTokens";

export const EthermintTab: React.FC = () => {
  const chainInfo = ZetaChainInfo;
  const [address, setAddress] = useState("");
  const [hexAddress, setHexAddress] = useState("");

  const init = async () => {
    const keplr = window.keplr;
    if (keplr) {
      await keplr.experimentalSuggestChain(chainInfo as any);
      await keplr.enable(chainInfo.chainId);
      const key = await keplr.getKey(chainInfo.chainId);
      setAddress(key.bech32Address);
      setHexAddress(key.ethereumHexAddress ?? "");
    }
  };

  return (
    <>
      <h2 style={{ marginTop: "30px" }}>
        Ethermint Chain ({chainInfo.chainName})
      </h2>
      <div
        className="item-container"
        style={{ maxWidth: 576, overflowWrap: "anywhere" }}
      >
        <div className="item">
          <div className="item-title">Connect</div>
          <button className="keplr-button" onClick={init}>
            Connect {chainInfo.chainName}
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
              chainInfo={chainInfo}
              bech32Address={address}
              hexAddress={hexAddress}
            />
            <CosmosSign chainInfo={chainInfo} bech32Address={address} />
            {hexAddress && (
              <EvmSign chainInfo={chainInfo} hexAddress={hexAddress} />
            )}
            <Eip712Sign chainInfo={chainInfo} bech32Address={address} />
            {hexAddress && (
              <SendTokens
                chainInfo={chainInfo}
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
