import React, { useEffect } from "react";
import AllData from "./AllData";
import { OsmosisChainInfo } from "../../constants";
import { sendMsgs } from "../../util/sendMsgs";
import { simulateMsgs } from "../../util/simulateMsgs";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { MsgSend } from "../../proto-types-gen/src/cosmos/bank/v1beta1/tx";
import { api } from "../../util/api";
import { Balances } from "../../types/balance";
import { getKeplrFromWindow } from "../../util/getKeplrFromWindow";

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
  const [recipient, setRecipient] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const keplr = await getKeplrFromWindow();

    if (keplr) {
      try {
        await keplr.experimentalSuggestChain(OsmosisChainInfo);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

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
              amount: DecUtils.getTenExponentN(6)
                .mul(new Dec(amount))
                .truncate()
                .toString(),
            },
          ],
        }).finish(),
      };

      try {
        const gasUsed = await simulateMsgs(
          OsmosisChainInfo,
          key.bech32Address,
          [protoMsgs],
          [{ denom: "uosmo", amount: "236" }]
        );

        if (gasUsed) {
          await sendMsgs(
            window.keplr,
            OsmosisChainInfo,
            key.bech32Address,
            [protoMsgs],
            {
              amount: [{ denom: "uosmo", amount: "236" }],
              gas: Math.floor(gasUsed * 1.5).toString(),
            }
          );
        }
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };
  return (
    <section>
      <div className="container">
        <div className="p-4">
          <div className="text-center font-bold uppercase">Send OSMO</div>

          <div className="my-5">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full">
                <input
                  placeholder="Recipient"
                  type="text"
                  className="text-sm leading-none text-left text-gray-600 px-4 py-3 w-full border rounded border-gray-300 outline-none"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="w-full">
                <input
                  placeholder="Amount"
                  className="text-sm leading-none text-left text-gray-600 px-4 py-3 w-full border rounded border-gray-300 outline-none"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button
                className="btn bg-gradient-to-r from-[#65b9f4] to-[#a172f2] px-4 py-2 rounded text-white w-1/3"
                onClick={sendBalance}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <AllData />
    </section>
  );
};
export default Home;
