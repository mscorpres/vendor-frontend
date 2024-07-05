import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { Col, Row } from "antd";
import { getPhysicalStockWithStatus, updateStatus } from "./../../api/general";
import MyDataTable from "../../Components/MyDataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { toast } from "react-toastify";

const PendingPhysicalStock = () => {
  const [rows, setRows] = useState([]);
  const { executeFun, loading } = useApi();

  const handleGetRows = async () => {
    setRows([]);
    const response = await executeFun(
      () => getPhysicalStockWithStatus("pending"),
      "fetch"
    );
    let arr = [];
    if (response.success) {
      arr = response.data.map((row, index) => ({
        id: index + 1,
        component: row.part_name,
        partCode: row.part_code,
        auditQty: row.audit_qty,
        auditKey: row.audit_key,
        auditDate: row.audit_dt,
        remark: row.audit_remark,
        auditBy: row.by,
        componentKey: row.component_key,
        imsQty: row.ims_qty,
        status: row.status,
      }));
    }
    setRows(arr);
  };

  const handleUpdateStatus = async (payload) => {
    const response = await executeFun(
      () => updateStatus(payload),
      "updateStatus"
    );
    // console.log("response", response);
    if (response.success) {
      // toast.success(response.message);
      handleGetRows();
    } else {
      // toast.error(response.message);
    }
  };

  const actionColumn = {
    headerName: "",
    type: "actions",
    width: 30,
    getActions: ({ row }) => [
      // reject icon
      <GridActionsCellItem
        showInMenu
        // disabled={disabled}
        label={"Reject"}
        onClick={() =>
          handleUpdateStatus({
            auditKey: row.auditKey,
            componentKey: row.componentKey,
            status: "reject",
          })
        }
      />,
      // approve icon
      <GridActionsCellItem
        showInMenu
        // disabled={disabled}
        label={"Approve"}
        onClick={() =>
          handleUpdateStatus({
            auditKey: row.auditKey,
            componentKey: row.componentKey,
            status: "approved",
          })
        }
      />,
    ],
  };
  useEffect(() => {
    handleGetRows();
  }, []);
  return (
    <div style={{ height: "95%", padding: 10 }}>
      <Row style={{ height: "100%" }} justify="center">
        <Col span={20}>
          <MyDataTable
            loading={loading("fetch") || loading("updateStatus")}
            data={rows}
            columns={[actionColumn, ...columns]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PendingPhysicalStock;

const columns = [
  {
    headerName: "#",
    width: 30,
    field: "id",
  },
  {
    headerName: "Component",
    minWidth: 120,
    flex: 1,
    field: "component",
  },
  {
    headerName: "Part COde",
    width: 150,
    field: "partCode",
  },
  {
    headerName: "Audit Qty",
    width: 150,
    field: "auditQty",
  },
  {
    headerName: "IMS Qty",
    width: 150,
    field: "imsQty",
  },
  {
    headerName: "Audit Date",
    width: 150,
    field: "auditDate",
  },
  {
    headerName: "Audit By",
    width: 150,
    field: "auditBy",
  },
  {
    headerName: "Remark",
    minWidth: 120,
    flex: 1,
    field: "remark",
  },
];
