import React from "react";
import { Link } from "react-router-dom";
import { IData } from "../../types/ItemType";
import { fakeData } from "../../util/fakeData";

type AllDataProps = {};

const AllData: React.FC<AllDataProps> = () => {
  return (
    <div className="container mx-auto mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 ">
        {fakeData.map((item: IData) => (
          <div key={item.id}>
            <div className="relative bg-white py-6 px-6 rounded-3xl my-4 shadow-[0px_9px_52px_0px_rgba(0,0,0,.07)]">
              <div className="">
                <p className="text-xl font-semibold my-2">{item.name}</p>
                <div className="flex space-x-2 text-gray-400 text-sm">
                  <p>{item.description}</p>
                </div>
                <div className="flex space-y-2 text-gray-400 text-sm my-3 flex-col">
                  {/* <span>amount : {item.amount}</span> */}
                  <p>Price {item.price}</p>
                  <div className="card-actions justify-start">
                    <button className="btn btn bg-gradient-to-r from-[#65b9f4] to-[#a172f2] px-4 py-2 rounded text-white">
                      <Link to={`/details/${item.id}`}>details more</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllData;
