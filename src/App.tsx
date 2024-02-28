import React, {useEffect} from 'react';
import {getKeplrFromWindow} from "./util/getKeplrFromWindow";
import {OsmosisChainInfo} from "./constants";
import {Balances} from "./types/balance";
import {Dec, DecUtils} from "@keplr-wallet/unit";
import {encodeSecp256k1Signature} from "@keplr-wallet/cosmos"
import {sendMsgs} from "./util/sendMsgs";
import {api} from "./util/api";
import {simulateMsgs} from "./util/simulateMsgs";
import { StdSignature } from "@keplr-wallet/types";
import {MsgSend} from "./proto-types-gen/src/cosmos/bank/v1beta1/tx";
import "./styles/container.css";
import "./styles/button.css";
import "./styles/item.css";

function App() {
  const [address, setAddress] = React.useState<string>('');
  const [balance, setBalance] = React.useState<string>('');

  const [recipient, setRecipient] = React.useState<string>('');
  const [amount, setAmount] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const [stdSignature, setStdSignature] = React.useState<StdSignature | undefined>(undefined);

  const [verifyMessage, setVerifyMessage] = React.useState<string>('');
  const [verifyStdSignature, setVerifyStdSignature] = React.useState<StdSignature | undefined>(undefined);
  const [verificationResult, setVerificationResult] = React.useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const keplr = await getKeplrFromWindow();

    if(keplr) {
      try {
        await keplr.experimentalSuggestChain(OsmosisChainInfo);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  }

  const getKeyFromKeplr = async () => {
    const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);
    if (key) {
      setAddress(key.bech32Address)
    }
  }

  const getBalance = async () => {
    const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);

    if (key) {
      const uri = `${OsmosisChainInfo.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;

      const data = await api<Balances>(uri);
      const balance = data.balances.find((balance) => balance.denom === "uosmo");
      const osmoDecimal = OsmosisChainInfo.currencies.find((currency) => currency.coinMinimalDenom === "uosmo")?.coinDecimals;

      if(balance) {
        const amount = new Dec(balance.amount, osmoDecimal);
        setBalance(`${amount.toString(osmoDecimal)} OSMO`)
      } else {
        setBalance(`0 OSMO`)
      }
    }
  }

  const sendBalance = async () => {
    if (window.keplr) {
      const key = await window.keplr.getKey(OsmosisChainInfo.chainId);
      const protoMsgs = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.encode({
          fromAddress: key.bech32Address,
          toAddress: recipient,
          amount: [
            {
              denom: "uosmo",
              amount: DecUtils.getTenExponentN(6).mul(new Dec(amount)).truncate().toString(),
            },
          ],
        }).finish(),
      }

      try {
        const gasUsed = await simulateMsgs(
          OsmosisChainInfo,
          key.bech32Address,
          [protoMsgs],
          [{denom: "uosmo",
            amount: "236",}]
          );

        if(gasUsed) {
          await sendMsgs(
            window.keplr,
            OsmosisChainInfo,
            key.bech32Address,
            [protoMsgs],
            {
              amount: [{denom: "uosmo",
                amount: "236",}],
              gas: Math.floor(gasUsed * 1.5).toString(),
            })
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }

    }
  }

  const signMessage = async () => {
    if (window.keplr) {
      const key = await window.keplr.getKey(OsmosisChainInfo.chainId);
      
      try {
        const signature = await window.keplr.signArbitrary(OsmosisChainInfo.chainId, key.bech32Address, message);
        setStdSignature(signature);
        setVerifyMessage(message);
        setVerifyStdSignature(signature);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  }

  const verifySignature = async () => {
    if (window.keplr) {
      const key = await window.keplr.getKey(OsmosisChainInfo.chainId);
      
      try {
        if (!verifyStdSignature) {
          return;
        }

        const result = await window.keplr.verifyArbitrary(OsmosisChainInfo.chainId, key.bech32Address, verifyMessage, verifyStdSignature);
        setVerificationResult(result);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
          setVerificationResult(false);
        }
      }
    }
  }


  return (
    <div className="root-container">
        <div style={{
            display: "flex",
            justifyContent: "center",
            padding: "16px"
        }}>
          <img src="/keplr-logo.png" style={{maxWidth: "200px"}} alt="keplr-logo" />
        </div>



      <div className="item-container">
        <div className="item">
          <div className="item-title">
            Get OSMO Address
          </div>

          <div className="item-content">
            <div>
              Address: {address}
            </div>

            <div>
              <button className="keplr-button" onClick={getKeyFromKeplr}>Get Address</button>
            </div>
          </div>
        </div>

        <div className="item">
          <div className="item-title">
            Get OSMO Balance
          </div>

          <div className="item-content">
            Balance: {balance}

            <button className="keplr-button" onClick={getBalance}>Get Balance</button>
          </div>
        </div>

        <div className="item">
          <div className="item-title">
            Send OSMO
          </div>

          <div className="item-content">
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              Recipient:
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              Amount:
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <button className="keplr-button" onClick={sendBalance}>Send</button>
          </div>

        </div>

        <div className="item">
          <div className="item-title">
            Sign Message
          </div>

          <div className="item-content">
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              Message:
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              Signature:
              <input type="text" readOnly value={stdSignature?.signature} />
            </div>

            <button className="keplr-button" onClick={signMessage}>Sign</button>
          </div>

        </div>

        <div className="item">
          <div className="item-title">
            Verify Signature
          </div>

          <div className="item-content">
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              Data:
              <input type="text" value={verifyMessage} onChange={(e) => setVerifyMessage(e.target.value)} />
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              Signature:
              <input type="text" value={verifyStdSignature?.signature} onChange={(e) => {
                if (verifyStdSignature?.pub_key) {
                  setVerifyStdSignature({ pub_key: verifyStdSignature.pub_key, signature: e.target.value })
                }
              }} />
            </div>

            <div>
              Result: {verificationResult ? 'VALID' : 'FAILED'}
            </div>

            <button className="keplr-button" onClick={verifySignature}>Verify</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
