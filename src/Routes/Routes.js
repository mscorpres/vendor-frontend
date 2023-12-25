import React from "react";
import {
  Login,
  ManufacturingSFG,
  Page404,
  PendingRequests,
  RMConsumption,
  RMStockReport,
  Vr01,
  Vr02,
  Completed
} from "../Pages";

const Routes = [
  {
    path: "/login",
    main: () => <Login />,
  },
  {
    path: "/requests/pending",
    main: () => <PendingRequests />,
  },
  {
    path: "/requests/completed",
    main: () => <Completed />,
  },
  {
    path: "/reports/rm_stock",
    main: () => <RMStockReport />,
  },
  {
    path: "/rm_consumption",
    main: () => <RMConsumption />,
  },
  {
    path: "/sfg/create",
    main: () => <ManufacturingSFG />,
  },
  {
    path: "/vr01",
    main: () => <Vr01 />,
  },
  {
    path: "/vr02",
    main: () => <Vr02 />,
  },
  // should always be at the end
  {
    path: "*",
    main: () => <Page404 />,
  },
];

export default Routes;
