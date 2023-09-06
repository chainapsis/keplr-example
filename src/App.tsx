import React, {useEffect} from 'react';
import {getKeplrFromWindow} from "./util/getKeplrFromWindow";
import {OsmosisChainInfo} from "./constants";
import {Balances} from "./types/balance";
import {Dec} from "@keplr-wallet/unit";
import { sendMsgs} from "./util/sendMsgs";
import {api} from "./util/api";
import {simulateMsgs} from "./util/simulateMsgs";
import {MsgSend} from "./proto-types-gen/src/cosmos/bank/v1beta1/tx";

function App() {
  const [address, setAddress] = React.useState<string>('');
  const [balance, setBalance] = React.useState<string>('');

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
          toAddress: key.bech32Address,
          amount: [
            {
              denom: "uosmo",
              amount: "10000",
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
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }

    }
  }


  return (
    <div className="App">
      <div>
        <button onClick={getKeyFromKeplr}>Get Address</button>
        Address: {address}
      </div>

      <div>
        <button onClick={getBalance}>Get Balance</button>
        Balance: {balance}
      </div>

      <div>
        <button onClick={sendBalance}>Send</button>
      </div>

    </div>
  );
}

export default App;
