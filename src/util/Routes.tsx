import { ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home/Home";
import Main from "../components/Layout/Main";
import Details from "../components/Details/Details";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (<Main />) as ReactElement,
    children: [
      {
        path: "/",
        element: (<Home />) as ReactElement,
      },
      {
        path: "details/:id",
        element: (<Details />) as ReactElement,
      },
    ],
  },
]);
