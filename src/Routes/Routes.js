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
import TransferRequest from "../Pages/Requests/TransferRequest/TransferRequest";
import RmRejection from "../Pages/RMRejection/RmRejection";
import RmConsumptionReport from "../Pages/Reports/RmConsumptionReport";
import RmRejectionReport from "../Pages/Reports/RmRejectionReport";
import PoReport from "../Pages/finance/vendor-payment/PoReport";

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
    path: "/requests/transfer",
    main: () => <TransferRequest />,
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
    path: "/reports/rmConsumption_report",
    main: () => <RmConsumptionReport />,
  },
  {
    path: "/vr04",
    main: () => <RmRejectionReport />,
  },
  {
    path: "/rm_rejection",
    main: () => <RmRejection />,
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
  {
    path: "/finance/payments",
    main: () => <PoReport />,
  },
  // should always be at the end
  {
    path: "*",
    main: () => <Page404 />,
  },
];

export default Routes;
