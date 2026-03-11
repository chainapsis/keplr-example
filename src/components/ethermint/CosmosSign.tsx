import React, { useState } from "react";
import { sendMsgs } from "../../util/sendMsgs";
import { simulateMsgs } from "../../util/simulateMsgs";
import { MsgSend } from "../../proto-types-gen/src/cosmos/bank/v1beta1/tx";

interface Props {
  chainInfo: any;
  bech32Address: string;
}

export const CosmosSign: React.FC<Props> = ({ chainInfo, bech32Address }) => {
  const [aminoResult, setAminoResult] = useState("");
  const [directResult, setDirectResult] = useState("");
  const [adr36Message, setAdr36Message] = useState("");
  const [adr36Result, setAdr36Result] = useState("");

  const signAmino = async () => {
    if (!window.keplr) return;
    try {
      const denom = chainInfo.currencies[0].coinMinimalDenom;
      const signDoc = {
        chain_id: chainInfo.chainId,
        account_number: "0",
        sequence: "0",
        fee: { amount: [{ denom, amount: "5000" }], gas: "200000" },
        msgs: [
          {
            type: "cosmos-sdk/MsgSend",
            value: {
              from_address: bech32Address,
              to_address: bech32Address,
              amount: [{ denom, amount: "1" }],
            },
          },
        ],
        memo: "keplr-example signAmino test",
      };
      const result = await window.keplr.signAmino(
        chainInfo.chainId,
        bech32Address,
        signDoc
      );
      setAminoResult(
        JSON.stringify(
          { signature: result.signature, signed: result.signed },
          null,
          2
        )
      );
    } catch (e) {
      setAminoResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const signDirect = async () => {
    if (!window.keplr) return;
    try {
      const denom = chainInfo.currencies[0].coinMinimalDenom;
      const protoMsgs = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.encode({
          fromAddress: bech32Address,
          toAddress: bech32Address,
          amount: [{ denom, amount: "1" }],
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
        setDirectResult("signDirect + broadcast success");
      }
    } catch (e) {
      setDirectResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const signArbitrary = async () => {
    if (!window.keplr || !adr36Message.trim()) return;
    try {
      const result = await window.keplr.signArbitrary(
        chainInfo.chainId,
        bech32Address,
        adr36Message
      );
      setAdr36Result(
        JSON.stringify(
          { signature: result.signature, pub_key: result.pub_key },
          null,
          2
        )
      );
    } catch (e) {
      setAdr36Result(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <>
      <div className="item">
        <div className="item-title">Cosmos signAmino (MsgSend)</div>
        <div className="item-content">
          <button className="keplr-button" onClick={signAmino}>
            Sign Amino
          </button>
          {aminoResult && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: 12,
                maxHeight: 200,
                overflow: "auto",
                background: "#f5f5f5",
                padding: 12,
                borderRadius: 4,
                margin: 0,
              }}
            >
              {aminoResult}
            </pre>
          )}
        </div>
      </div>

      <div className="item">
        <div className="item-title">
          Cosmos signDirect (MsgSend + Broadcast)
        </div>
        <div className="item-content">
          <button className="keplr-button" onClick={signDirect}>
            Sign Direct & Send
          </button>
          {directResult && <div>{directResult}</div>}
        </div>
      </div>

      <div className="item">
        <div className="item-title">ADR-36 Arbitrary Sign</div>
        <div className="item-content">
          <input
            type="text"
            placeholder="Message to sign"
            value={adr36Message}
            onChange={(e) => setAdr36Message(e.target.value)}
          />
          <button className="keplr-button" onClick={signArbitrary}>
            Sign Arbitrary
          </button>
          {adr36Result && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: 12,
                maxHeight: 200,
                overflow: "auto",
                background: "#f5f5f5",
                padding: 12,
                borderRadius: 4,
                margin: 0,
              }}
            >
              {adr36Result}
            </pre>
          )}
        </div>
      </div>
    </>
  );
};
