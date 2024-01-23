import React, { useEffect } from "react";
import { OsmosisChainInfo } from "../../constants";
import { Balances } from "../../types/balance";
import { sendMsgs } from "../../util/sendMsgs";
import { simulateMsgs } from "../../util/simulateMsgs";
import { Dec, DecUtils } from "@keplr-wallet/unit";
import { MsgSend } from "../../proto-types-gen/src/cosmos/bank/v1beta1/tx";
import { api } from "../../util/api";
import { getKeplrFromWindow } from "../../util/getKeplrFromWindow";
import { Link } from "react-router-dom";

type NavProps = {};

const Nav: React.FC<NavProps> = () => {
  const [address, setAddress] = React.useState<string>("");
  const [balance, setBalance] = React.useState<string>("");

  const [open, setOpen] = React.useState<boolean>(false);
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

  const getKeyFromKeplr = async () => {
    const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);
    if (key) {
      setAddress(key.bech32Address);
    }
  };

  const getBalance = async () => {
    const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);

    if (key) {
      const uri = `${OsmosisChainInfo.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;

      const data = await api<Balances>(uri);
      const balance = data.balances.find(
        (balance) => balance.denom === "uosmo"
      );
      const osmoDecimal = OsmosisChainInfo.currencies.find(
        (currency) => currency.coinMinimalDenom === "uosmo"
      )?.coinDecimals;

      if (balance) {
        const amount = new Dec(balance.amount, osmoDecimal);
        setBalance(`${amount.toString(osmoDecimal)} OSMO`);
      } else {
        setBalance(`0 OSMO`);
      }
    }
  };

  return (
    <div className="shadow-xl ">
      {/* header start */}
      <div className="container mx-auto relative">
        <div className="flex justify-between items-center gap-5 p-4 ">
          <Link to="/">
            <div className="">
              <img
                className="max-w-[200px] mr-auto "
                src="/keplr-logo.png"
                alt="keplr-logo"
              />
            </div>
          </Link>
          <div className="">
            <button
              onClick={() => setOpen(!open)}
              className="btn bg-gradient-to-r from-[#65b9f4] to-[#a172f2] px-4 py-2 rounded text-white uppercase"
            >
              {open ? "x" : "get balance"}
            </button>
          </div>
        </div>
        {open && (
          <div className="absolute top-[87%] w-1/2 z-10 right-[1%] bg-white shadow-[0px_9px_52px_0px_rgba(0,0,0,.09)] rounded-2xl ">
            <div className="">
              <div className="bg-slate-600 text-white p-4">
                Get OSMO Address
              </div>

              <div className="p-4">
                <p className="text-lg mb-3 flex justify-between ">
                  <span className="font-semibold">Address: </span>
                  <span>{address}</span>
                </p>

                <div>
                  <button
                    className="btn bg-gradient-to-r from-[#65b9f4] to-[#a172f2] px-4 py-2 rounded text-white"
                    onClick={getKeyFromKeplr}
                  >
                    Get Address
                  </button>
                </div>
              </div>
            </div>
            <div className="">
              <div className="bg-slate-600 text-white p-4">
                Get OSMO Balance
              </div>

              <div className="p-4 ">
                <p className="text-lg flex justify-between mb-3">
                  <span className="font-semibold ">Balance:</span>{" "}
                  <span>{balance}</span>
                </p>
                <button
                  className="btn bg-gradient-to-r from-[#65b9f4] to-[#a172f2] px-4 py-2 rounded text-white "
                  onClick={getBalance}
                >
                  Get Balance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* header end */}
      {/* transfer */}
    </div>
  );
};
export default Nav;
