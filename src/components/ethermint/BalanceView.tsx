import React, { useState } from "react";
import { Dec } from "@keplr-wallet/unit";
import { api } from "../../util/api";
import { Balances } from "../../types/balance";

interface Props {
  chainInfo: any;
  bech32Address: string;
  hexAddress: string;
}

export const BalanceView: React.FC<Props> = ({
  chainInfo,
  bech32Address,
  hexAddress,
}) => {
  const [cosmosBalance, setCosmosBalance] = useState("");
  const [evmBalance, setEvmBalance] = useState("");

  const fetchCosmosBalance = async () => {
    const uri = `${chainInfo.rest}/cosmos/bank/v1beta1/balances/${bech32Address}?pagination.limit=1000`;
    const data = await api<Balances>(uri);
    const nativeDenom = chainInfo.currencies[0].coinMinimalDenom;
    const decimals = chainInfo.currencies[0].coinDecimals;
    const balance = data.balances.find((b) => b.denom === nativeDenom);
    if (balance) {
      setCosmosBalance(
        `${new Dec(balance.amount, decimals).toString(decimals)} ${
          chainInfo.currencies[0].coinDenom
        }`
      );
    } else {
      setCosmosBalance(`0 ${chainInfo.currencies[0].coinDenom}`);
    }
  };

  const fetchEvmBalance = async () => {
    const ethereum = window.keplr?.ethereum;
    if (!ethereum) return;
    const result = (await ethereum.request({
      method: "eth_getBalance",
      params: [hexAddress, "latest"],
    })) as string;
    const wei = BigInt(result);
    const decimals = chainInfo.currencies[0].coinDecimals;
    const divisor = BigInt(10 ** decimals);
    const integer = wei / divisor;
    const fraction = wei % divisor;
    setEvmBalance(
      `${integer}.${fraction.toString().padStart(decimals, "0")} ${
        chainInfo.currencies[0].coinDenom
      }`
    );
  };

  const fetchBoth = async () => {
    if (window.keplr?.ethereum && chainInfo.evm) {
      try {
        await window.keplr.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + chainInfo.evm.chainId.toString(16) }],
        });
      } catch (e) {
        console.error("switchChain failed:", e);
      }
    }
    await Promise.all([fetchCosmosBalance(), fetchEvmBalance()]);
  };

  return (
    <div className="item">
      <div className="item-title">Balance Comparison</div>
      <div className="item-content">
        <button className="keplr-button" onClick={fetchBoth}>
          Fetch Balances
        </button>
        {cosmosBalance && (
          <div>
            <span style={{ color: "#6b7280" }}>Cosmos (bech32):</span>{" "}
            {cosmosBalance}
          </div>
        )}
        {evmBalance && (
          <div>
            <span style={{ color: "#6b7280" }}>EVM (hex):</span> {evmBalance}
          </div>
        )}
      </div>
    </div>
  );
};
