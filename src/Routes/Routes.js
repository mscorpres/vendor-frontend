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
  Completed,
} from "../Pages";
import Vr03 from "../Pages/Reports/Vr03";
import ViewSFG from "../Pages/SFG/ViewSFG";

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
    path: "/sfg/view",
    main: () => <ViewSFG />,
  },
  {
    path: "/vr01",
    main: () => <Vr01 />,
  },
  {
    path: "/vr02",
    main: () => <Vr02 />,
  },
  {
    path: "/vr03",
    main: () => <Vr03 />,
  },
  // should always be at the end
  {
    path: "*",
    main: () => <Page404 />,
  },
];

export default Routes;
