import React, { useEffect } from "react";
import { getKeplrFromWindow } from "../../util/getKeplrFromWindow";
import { OsmosisChainInfo } from "../../constants";
import { MsgSend } from "../../proto-types-gen/src/cosmos/bank/v1beta1/tx";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { simulateMsgs } from "../../util/simulateMsgs";
import { sendMsgs } from "../../util/sendMsgs";
import { IData } from "../../types/ItemType";
import { useParams } from "react-router-dom";
import { fakeData } from "../../util/fakeData";

type DetailsProps = {};

const Details: React.FC<DetailsProps> = () => {
  const { id } = useParams();
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

  const sendBalance = async (amount: string) => {
    if (window.keplr) {
      const key = await window.keplr.getKey(OsmosisChainInfo.chainId);
      const protoMsgs = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.encode({
          fromAddress: key.bech32Address,
          toAddress: "",
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
          [{ denom: "uosmo", amount }]
        );

        if (gasUsed) {
          await sendMsgs(
            window.keplr,
            OsmosisChainInfo,
            key.bech32Address,
            [protoMsgs],
            {
              amount: [{ denom: "uosmo", amount }],
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
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto ">
        <div className="w-full">
          {fakeData
            .filter((item: IData) => item.id === id)
            .map((item: IData) => (
              <div className="flex flex-wrap items-center" key={item.id}>
                <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
                  <img
                    alt="feature"
                    className="object-cover object-center  w-full"
                    src="https://dummyimage.com/460x200"
                  />
                </div>
                <div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
                  <div className="flex flex-col mb-10 lg:items-start items-center">
                    <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <p className="text-xl font-semibold my-2">{item.name}</p>
                      <div className="flex space-x-2 text-gray-400 text-sm">
                        <p>{item.description}</p>
                      </div>
                      <p>Price {item.price}</p>
                      <button
                        onClick={() => sendBalance(item.price.toString())}
                        className="mt-3 btn btn bg-gradient-to-r from-[#65b9f4] to-[#a172f2] px-4 py-2 rounded text-white w-28 flex items-center gap-5 uppercase"
                      >
                        send
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
export default Details;
