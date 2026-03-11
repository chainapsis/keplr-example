import React, { useState } from "react";
import { sendMsgs } from "../../util/sendMsgs";
import { simulateMsgs } from "../../util/simulateMsgs";
import { MsgSend } from "../../proto-types-gen/src/cosmos/bank/v1beta1/tx";

interface Props {
  chainInfo: any;
  bech32Address: string;
  hexAddress: string;
}

export const SendTokens: React.FC<Props> = ({
  chainInfo,
  bech32Address,
  hexAddress,
}) => {
  const [mode, setMode] = useState<"cosmos" | "evm">("cosmos");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");

  const sendCosmos = async () => {
    if (!window.keplr) return;
    const denom = chainInfo.currencies[0].coinMinimalDenom;
    const decimals = chainInfo.currencies[0].coinDecimals;
    const amountInMinimal = BigInt(
      Math.floor(parseFloat(amount) * 10 ** decimals)
    ).toString();
    const protoMsgs = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: MsgSend.encode({
        fromAddress: bech32Address,
        toAddress: recipient,
        amount: [{ denom, amount: amountInMinimal }],
      }).finish(),
    };
    const gasUsed = await simulateMsgs(
      chainInfo,
      bech32Address,
      [protoMsgs],
      [{ denom, amount: "5000" }]
    );
    if (gasUsed) {
      await sendMsgs(window.keplr, chainInfo, bech32Address, [protoMsgs], {
        amount: [{ denom, amount: "5000" }],
        gas: Math.floor(gasUsed * 1.5).toString(),
      });
      setResult("Cosmos send success");
    }
  };

  const sendEvm = async () => {
    const ethereum = window.keplr?.ethereum;
    if (!ethereum) return;
    const evmChainIdHex = "0x" + chainInfo.evm.chainId.toString(16);
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: evmChainIdHex }],
    });
    const amountWei = BigInt(Math.floor(parseFloat(amount) * 1e18)).toString(
      16
    );
    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [{ from: hexAddress, to: recipient, value: "0x" + amountWei }],
    });
    setResult(`EVM send success. TX: ${txHash}`);
  };

  const send = async () => {
    setResult("");
    try {
      if (mode === "cosmos") await sendCosmos();
      else await sendEvm();
    } catch (e) {
      setResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="item">
      <div className="item-title">Send Native Token</div>
      <div className="item-content">
        <div style={{ display: "flex", gap: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="radio"
              checked={mode === "cosmos"}
              onChange={() => setMode("cosmos")}
            />
            Cosmos (bech32)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="radio"
              checked={mode === "evm"}
              onChange={() => setMode("evm")}
            />
            EVM (hex)
          </label>
        </div>
        <input
          type="text"
          placeholder={
            mode === "cosmos" ? "Recipient (bech32)" : "Recipient (0x...)"
          }
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder={`Amount (${chainInfo.currencies[0].coinDenom})`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="keplr-button" onClick={send}>
          Send ({mode})
        </button>
        {result && <div>{result}</div>}
      </div>
    </div>
  );
};
