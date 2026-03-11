import React, { useState } from "react";
import { Buffer } from "buffer";

interface Props {
  chainInfo: any;
  bech32Address: string;
}

const sampleEip712Data = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
    ],
    Message: [
      { name: "content", type: "string" },
      { name: "sender", type: "address" },
    ],
  },
  primaryType: "Message",
  domain: {
    name: "Keplr QA Test",
    version: "1",
    chainId: 9001, // Will be overridden per chain
  },
  message: {
    content: "Hello from Ethermint EIP-712 QA test!",
    sender: "0x0000000000000000000000000000000000000000", // Will be overridden
  },
};

export const Eip712Sign: React.FC<Props> = ({ chainInfo, bech32Address }) => {
  const [typedDataJson, setTypedDataJson] = useState(() => {
    const data = { ...sampleEip712Data };
    data.domain = { ...data.domain, chainId: chainInfo.evm?.chainId ?? 9001 };
    return JSON.stringify(data, null, 2);
  });
  const [result, setResult] = useState("");

  const signEip712 = async () => {
    if (!window.keplr) return;
    try {
      const signature = await window.keplr.signEthereum(
        chainInfo.chainId,
        bech32Address,
        typedDataJson,
        "eip-712" as any
      );
      setResult(
        `Signature (${signature.length} bytes): 0x${Buffer.from(
          signature
        ).toString("hex")}`
      );
    } catch (e) {
      setResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="item">
      <div className="item-title">EIP-712 Sign (keplr.signEthereum)</div>
      <textarea
        value={typedDataJson}
        onChange={(e) => setTypedDataJson(e.target.value)}
        style={{
          width: "100%",
          height: "200px",
          fontFamily: "monospace",
          fontSize: "11px",
          padding: "8px",
          marginBottom: "8px",
        }}
      />
      <button className="keplr-button" onClick={signEip712}>
        Sign EIP-712
      </button>
      {result && (
        <div style={{ wordBreak: "break-all", fontSize: "12px" }}>{result}</div>
      )}
    </div>
  );
};
