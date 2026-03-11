import React, { useState } from "react";
import { Buffer } from "buffer";

interface Props {
  chainInfo: any;
  hexAddress: string;
}

export const EvmSign: React.FC<Props> = ({ chainInfo, hexAddress }) => {
  const [personalSignResult, setPersonalSignResult] = useState("");
  const [sendTxResult, setSendTxResult] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [switched, setSwitched] = useState(false);

  const switchToChain = async () => {
    const ethereum = window.keplr?.ethereum;
    if (!ethereum || !chainInfo.evm) return;
    const evmChainIdHex = "0x" + chainInfo.evm.chainId.toString(16);
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: evmChainIdHex }],
    });
    setSwitched(true);
  };

  const personalSign = async () => {
    const ethereum = window.keplr?.ethereum;
    if (!ethereum) return;
    try {
      if (!switched) await switchToChain();
      const message =
        "0x" + Buffer.from("Hello from Ethermint QA test!").toString("hex");
      const result = await ethereum.request({
        method: "personal_sign",
        params: [message, hexAddress],
      });
      setPersonalSignResult(result as string);
    } catch (e) {
      setPersonalSignResult(
        `Error: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  };

  const sendTransaction = async () => {
    const ethereum = window.keplr?.ethereum;
    if (!ethereum || !sendRecipient) return;
    try {
      if (!switched) await switchToChain();
      const amountWei = BigInt(
        Math.floor(parseFloat(sendAmount || "0") * 1e18)
      ).toString(16);
      const result = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: hexAddress,
            to: sendRecipient,
            value: "0x" + amountWei,
          },
        ],
      });
      setSendTxResult(`TX Hash: ${result}`);
    } catch (e) {
      setSendTxResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <>
      <div className="item">
        <div className="item-title">EVM Provider: Switch Chain</div>
        <button className="keplr-button" onClick={switchToChain}>
          Switch to {chainInfo.chainName} EVM (0x
          {chainInfo.evm?.chainId.toString(16)})
        </button>
        {switched && <div>✓ Switched</div>}
      </div>

      <div className="item">
        <div className="item-title">EVM Provider: personal_sign</div>
        <button className="keplr-button" onClick={personalSign}>
          Personal Sign
        </button>
        {personalSignResult && (
          <div style={{ wordBreak: "break-all", fontSize: "12px" }}>
            {personalSignResult}
          </div>
        )}
      </div>

      <div className="item">
        <div className="item-title">EVM Provider: eth_sendTransaction</div>
        <input
          type="text"
          placeholder="Recipient (0x...)"
          value={sendRecipient}
          onChange={(e) => setSendRecipient(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "4px" }}
        />
        <input
          type="text"
          placeholder="Amount (in native token, e.g. 0.001)"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <button className="keplr-button" onClick={sendTransaction}>
          Send via EVM
        </button>
        {sendTxResult && <div>{sendTxResult}</div>}
      </div>
    </>
  );
};
