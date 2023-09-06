import React, {useEffect} from 'react';
import {getKeplrFromWindow} from "./util/getKeplrFromWindow";
import {OsmosisChainInfo} from "./constants";
import {Balances} from "./types/balance";
import {Dec, DecUtils} from "@keplr-wallet/unit";
import {Keplr} from "@keplr-wallet/types";
import {fetchAccountInfo, sendMsgs} from "./util/sendMsgs";
import {api} from "./util/api";
import {MsgSend} from "@keplr-wallet/proto-types/cosmos/bank/v1beta1/tx";

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

      const aminoMsgs = {
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: key.bech32Address,
          to_address: key.bech32Address,
          amount: [
            {
              denom: "uosmo",
              amount: "10000",
            },
          ],
        },
      };

      const protoMsgs = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.encode({
          fromAddress: aminoMsgs.value.from_address,
          toAddress: aminoMsgs.value.to_address,
          amount: aminoMsgs.value.amount,
        }).finish(),
      }

      await sendMsgs(
        window.keplr,
        OsmosisChainInfo,
        key.bech32Address,
        { amino: [aminoMsgs], proto: [protoMsgs]},
        {
          amount: [{denom: "uosmo",
            amount: "236",}],
          gas: "94250",
        })
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
