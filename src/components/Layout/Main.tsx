import React from "react";
import Nav from "../shared/Nav";
import { Outlet } from "react-router-dom";

type MainProps = {};

const Main: React.FC<MainProps> = () => {
  return (
    <main className="container mx-auto">
      <Nav />
      <Outlet />
    </main>
  );
};
export default Main;
