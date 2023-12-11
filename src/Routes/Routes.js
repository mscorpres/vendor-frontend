import React from "react";
import {
  Login,
  ManufacturingSFG,
  Page404,
  PendingRequests,
  RMConsumption,
  RMStockReport,
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
  // should always be at the end
  {
    path: "*",
    main: () => <Page404 />,
  },
];

export default Routes;
