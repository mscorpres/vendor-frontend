import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Drawer,
  Input,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import FormTable from "../../../Components/FormTable";
import TaxDetailCard from "../../../Components/TaxDetailCard";
import axios from "axios";
import showToast from "../../../Components/MyToast";
import MySelect from "../../../Components/MySelect";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import { useSelector } from "react-redux";

function ChallanInward({ challanInward, setChallanInward }) {
  const [rows, setRows] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const [resetData, setResetData] = useState([]);
  const { locations: locationOptions } = useSelector((state) => state.login);
  const columns = [
    {
      headerName: "",
      width: 50,
      renderCell: ({ row }) => (
        <CommonIcons action="removeRow" onClick={() => removeRows(row.id)} />
      ),
    },

    {
      headerName: "Part Code",
      width: 80,
      renderCell: ({ row }) => (
        <Typography.Text
          style={{ fontSize: window.innerWidth > 1600 ? "0.9rem" : "0.7rem" }}
        >
          {row.partNo}
        </Typography.Text>
      ),
    },
    {
      headerName: "Part Name",
      width: 200,
      renderCell: ({ row }) => (
        <Typography.Text
          style={{ fontSize: window.innerWidth > 1600 ? "0.9rem" : "0.7rem" }}
        >
          {row.partName}
        </Typography.Text>
      ),
    },
    {
      headerName: "Total Qty",
      width: 100,
      renderCell: ({ row }) => (
        <Input
          value={row.jwQty}
          suffix={"" + row.uom}
          onChange={(e) => inputHandler("jwQty", e.target.value, row.id)}
        />
      ),
    },
    {
      headerName: "Left Qty",
      width: 100,
      renderCell: ({ row }) => (
        <Input
          disabled
          value={row.maxQty}
          suffix={"" + row.uom}
          onChange={(e) => inputHandler("maxQty", e.target.value, row.id)}
        />
      ),
    },
    {
      headerName: "Rate",
      width: 100,
      renderCell: ({ row }) => (
        <Input
          value={row.jwRate}
          onChange={(e) => inputHandler("jwRate", e.target.value, row.id)}
        />
      ),
    },
    {
      headerName: "Value",
      width: 100,
      renderCell: ({ row }) => <Input value={row.jwValue} disabled={true} />,
    },
    {
      headerName: "Location",
      width: 100,
      renderCell: ({ row }) => (
        <MySelect
          labelInValue
          // options={locationOptions}
          value={locationOptions[0].text}
          onChange={(value) => inputHandler("location", value, row.id)}
        />
      ),
    },
    {
      headerName: "HSN",
      width: 100,
      renderCell: ({ row }) => (
        <Input
          value={row.hsn}
          onChange={(e) => inputHandler("hsn", e.target.value, row.id)}
        />
      ),
    },
    {
      headerName: "Remark",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.remark}
          onChange={(e) => inputHandler("remark", e.target.value, row.id)}
        />
      ),
    },
  ];
  const totalValues = [
    { label: "Sub-Total value before Taxes", values: [19900] },
    { label: "CGST", values: [19900] },
    { label: "SGST", values: [19900] },
    { label: "IGST", values: [19900] },
    { label: "Total Tax", values: [19900] },
    { label: "Net Amount", values: [19900] },
  ];
  const getDetails = async () => {
    if (challanInward) {
      setPageLoading(true);
      const { data } = await axios.post(
        "/jwvendor/fetchPendingJWChallanRM",
        challanInward
      );
      setPageLoading(false);
      if (data.code == 200) {
        let arr = data.response.data.map((row, index) => ({
          id: index,
          jwQty: row.jw_qty,
          maxQty: row.jw_leftqty,
          jwRate: row.jw_rate,
          partKey: row.part_key,
          jwValue: +Number(row.jw_qty) * +Number(row.jw_rate),
          partName: row.part_name,
          partNo: row.part_no,
          uom: row.uom,
          location: locationOptions[0].value,
          hsn: row.hsn,
          remark: "",
        }));
        setRows(arr);
        setResetData(arr);
      } else {
        showToast("", data.message.msg, "error");
      }
    }
  };

  const inputHandler = (name, value, id) => {
    let arr = rows;
    arr = arr.map((row) => {
      let obj = row;
      console.log(name, value, id);
      if (obj.id === id) {
        if (name === "jwQty") {
          obj = {
            ...obj,
            [name]: value,
            jwValue: +Number(value).toFixed(2) * +Number(row.jwRate).toFixed(2),
          };
        } else if (name === "jwRate") {
          obj = {
            ...obj,
            [name]: value,
            jwValue: +Number(value).toFixed(2) * +Number(row.jwQty).toFixed(2),
          };
        } else {
          obj = {
            ...obj,
            [name]: value,
          };
        }
        return obj;
      } else {
        return obj;
      }
    });
    setRows(arr);
  };
  const submitHandler = async () => {
    let validationError = "";
    rows.map((row) => {
      if (row.jwQty === "" || row.jwQty == 0) {
        validationError = "qty";
      } else if (row.jwRate === "" || row.jwRate == 0) {
      } else if (row.location === "") {
        validationError = "location";
      } else if (row.hsn === "") {
        validationError = "hsn";
      }
    });
    if (validationError === "qty") {
      return showToast(
        "",
        "All Components should have Quantity more than 0",
        "error"
      );
    } else if (validationError === "rate") {
      return showToast(
        "",
        "All Components should have rate more than 0",
        "error"
      );
    } else if (validationError === "location") {
      return showToast("", "All Components should have location", "error");
    } else if (validationError === "hsn") {
      return showToast("", "All Components should have HSN Code", "error");
    }
    if (validationError === "") {
      let finalObj = {
        component: rows.map((row) => row.partKey),
        qty: rows.map((row) => row.jwQty),
        location: rows.map((row) => row.location),
        challan_ref: challanInward.challan,
        jw_ref: challanInward.jw,
        remark: rows.map((row) => row.remark),
        hsncode: rows.map((row) => row.hsn),
      };
      // console.log("finalObj", finalObj);
      // return;
      setSubmitLoading(true);
      const { data } = await axios.post("/jwvendor/minVendorRM", finalObj);
      setSubmitLoading(false);
      if (data.code === 200) {
        showToast("", data.message, "success");
        setChallanInward(false);
      } else {
        showToast("", data.message.msg, "error");
      }
    }
  };
  const resetFunction = () => {
    setRows(resetData);
  };
  const removeRows = (id) => {
    let arr = rows;
    arr = arr.filter((row) => row.id != id);
    setRows(arr);
  };
  useEffect(() => {
    if (challanInward) {
      getDetails();
    }
  }, [challanInward]);
  console.log(locationOptions);
  return (
    <Drawer
      width="100vw"
      open={challanInward}
      onClose={() => setChallanInward(false)}
      extra={
        <Space>
          {/* <Button onClick={resetFunction}>Reset</Button> */}
          <Button
            type="primary"
            loading={submitLoading}
            onClick={submitHandler}
          >
            Submit
          </Button>
        </Space>
      }
    >
      <Row gutter={4} style={{ height: "100%" }}>
        {/* <Col span={6}>
          <Col span={24} style={{ height: "35%" }}>
            <TaxDetailCard totalValues={totalValues} loading={loading} />
          </Col>
        </Col> */}
        <Col span={24}>
          <Card
            size="small"
            style={{ height: "100%" }}
            bodyStyle={{ padding: 0, height: "100%" }}
          >
            <Skeleton active loading={pageLoading} />
            <Skeleton active loading={pageLoading} />
            <Skeleton active loading={pageLoading} />
            <Skeleton active loading={pageLoading} />
            <Skeleton active loading={pageLoading} />
            {!pageLoading && <FormTable columns={columns} data={rows} />}
          </Card>
        </Col>
      </Row>
    </Drawer>
  );
}

export default ChallanInward;
