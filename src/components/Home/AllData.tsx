import React from "react";
import { Link } from "react-router-dom";

type AllDataProps = {};

type IData = {
  id: string;
  name: string;
  description: string;
  amount: number;
  price: number;
};

const AllData: React.FC<AllDataProps> = () => {
  const fakeData: IData[] = [
    {
      id: "1",
      name: "Widget A",
      description: "A high-quality widget with advanced features.",
      amount: 15,
      price: 29.99,
    },
    {
      id: "2",
      name: "Gizmo B",
      description: "An innovative gizmo for everyday use.",
      amount: 8,
      price: 49.99,
    },
    {
      id: "3",
      name: "Doohickey C",
      description: "The latest doohickey with cutting-edge technology.",
      amount: 20,
      price: 39.99,
    },
  ];
  return (
    <div className="container">
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
                      <Link to={`/details/${item.id}`}>explore more</Link>
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
