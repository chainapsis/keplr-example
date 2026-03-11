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

  const switchToCurrentChain = async () => {
    const ethereum = window.keplr?.ethereum;
    if (!ethereum || !chainInfo.evm) return;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainInfo.evm.chainId.toString(16) }],
    });
  };

  const personalSign = async () => {
    const ethereum = window.keplr?.ethereum;
    if (!ethereum) return;
    try {
      await switchToCurrentChain();
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
      await switchToCurrentChain();
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
        <div className="item-title">EVM: personal_sign</div>
        <div className="item-content">
          <button className="keplr-button" onClick={personalSign}>
            Personal Sign
          </button>
          {personalSignResult && (
            <div
              style={{
                wordBreak: "break-all",
                fontSize: 12,
                fontFamily: "monospace",
                background: "#f5f5f5",
                padding: 12,
                borderRadius: 4,
              }}
            >
              {personalSignResult}
            </div>
          )}
        </div>
      </div>

      <div className="item">
        <div className="item-title">EVM: eth_sendTransaction</div>
        <div className="item-content">
          <input
            type="text"
            placeholder="Recipient (0x...)"
            value={sendRecipient}
            onChange={(e) => setSendRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount (in native token, e.g. 0.001)"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />
          <button className="keplr-button" onClick={sendTransaction}>
            Send via EVM
          </button>
          {sendTxResult && <div>{sendTxResult}</div>}
        </div>
      </div>
    </>
  );
};
