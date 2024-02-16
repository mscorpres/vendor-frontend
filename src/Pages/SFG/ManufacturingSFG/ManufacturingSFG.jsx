import { useState } from "react";
import { Button, Card, Col, Drawer, Form, Input, Modal, Row } from "antd";
import axios from "axios";
import SearchHeader from "../../../Components/SearchHeader";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import { useSelector } from "react-redux";
import MySelect from "../../../Components/MySelect";
import FormTable from "../../../Components/FormTable";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import showToast from "../../../Components/MyToast";
import { useEffect } from "react";
import NavFooter from "../../../Components/NavFooter";
function ManufacturingSFG() {
  document.title = "Create SFG";
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challans, setChallans] = useState([]);
  const [bomList, setBomList] = useState(false);
  const [bomListRows, setBomListRows] = useState([]);
  const [headerOptions, setHeaderOptions] = useState({
    jobwork: "",
    challan: "",
  });
  const [rows, setRows] = useState([
    {
      id: v4(),
      sku: "",
      skuid: "",
      location: "",
      finishedqty: 0,
      pendingqty: 0,
      orderqty: 0,
      skuCode: "",
      rate: "",
      remark: "",
      mfgQty: "",
    },
  ]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { locations: locationOptions } = useSelector((state) => state.login);
  let [form] = Form.useForm();

  const getChallans = async () => {
    setSelectLoading(true);
    const { data } = await axios.post("/jwvendor/getJWChallan", {
      jobwork: headerOptions.jobwork,
    });
    setSelectLoading(false);
    if (data.code === 200) {
      let arr = data.data.map((row) => ({
        value: row.id,
        text: row.text,
      }));
      setChallans(arr);
    } else {
      setChallans([]);
    }
  };
  const getAsyncOptions = async (search, url) => {
    setSelectLoading(true);
    const { data } = await axios.post(url, {
      search: search,
    });
    setSelectLoading(false);
    if (data[0]) {
      let arr = data.map((row) => ({
        value: row.id,
        text: row.text,
      }));
      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };
  const backFunction = () => {
    setShowSubmitConfirm(false);
    setSelectLoading(false);
  };
  const getBomFromJW = async () => {
    setLoading(true);
    console.log("rows[0].mfgQty", rows[0].mfgQty);
    let sfg = rows[0].mfgQty;
    const { data } = await axios.post("/jwvendor/getBomItem", {
      jwID: headerOptions.jobwork,
      sfgCreateQty: sfg,
    });
    setBomList(true);
    console.log("data->", data);
    if (data.code === 200) {
      let arr = data.data.map((r) => {
        return {
          ...r,
          bom_qty: r.bom_qty * Number(rows[0].mfgQty),
        };
      });
      setBomListRows(arr);
      setLoading(false);
    } else {
      toast.error(data.message.msg);
      setLoading(false);
    }
    setLoading(false);
  };
  const getProductDetails = async () => {
    // setSelectLoading(true);
    const { data } = await axios.post("/jwvendor/getJwSkuDetails", {
      jw_id: headerOptions.jobwork,
    });
    if (data.code === 200) {
      rows[0].sku = data.data.skuname;
      rows[0].skuid = data.data.sku;
      rows[0].pendingqty = data.data.pending_qty;
      rows[0].orderqty = data.data.ord_qty;
      rows[0].rate = data.data.rate;
      rows[0].skuCode = data.data.skucode;
    }
    setSelectLoading(false);
    console.log(data);
  };

  const getComponentDetails = async (value, id) => {
    const { data } = await axios.post("/jwvendor/getComponentDetailsByCode", {
      component_code: value.value,
    });
    return data;
  };
  const inputHandler = async (name, value, id) => {
    console.log(name, value, id);
    let arr = rows;
    if (name === "rate") {
      rows[0].rate = value;
    } else if (name === "qty") {
      rows[0].finishedqty = value;
    } else if (name === "mfgQty") {
      rows[0].mfgQty = value;
    }
  };
  const validationHandler = (headerData) => {
    let validation = false;
    let message = "";
    if (validation === "qty") {
      message = "Please enter a quanity more than 0";
    }
    if (validation) {
      return toast.error(message);
    }
    let finalObj = {};
    setShowSubmitConfirm(finalObj);
  };
  const submitHandler = async () => {
    if (showSubmitConfirm) {
      setSubmitLoading(true);
      let pao = {
        header: {
          jw_id: headerOptions.jobwork,
          jw_challan: headerOptions.challan,
          sku: rows[0].skuCode,
          qty: rows[0].finishedqty,
          rate: rows[0].rate,
        },
        material: {
          partName: bomListRows.map((r) => r.part_name),
          partCode: bomListRows.map((r) => r.part_no),
          bomQty: bomListRows.map((r) => r.bom_qty),
          locQty: bomListRows.map((r) => r.loc_qty),
        },
      };
      console.log("pao", pao);
      const { data } = await axios.post("/jwvendor/sfgInward", pao);
      setSubmitLoading(false);
      setShowSubmitConfirm(false);
      if (data.code === 200) {
        toast.success(data.message);
        resetHandler();
      } else {
        toast.error(data.message.msg);
        setSubmitLoading(false);
      }
      setSubmitLoading(false);
    }
  };
  const resetHandler = () => {
    form.resetFields();
    setHeaderOptions({
      jobwork: "",
      challan: "",
    });
    // form.setFieldsValue({
    //   jobwork: "",
    //   challan: "",
    // });
    setRows([
      {
        id: v4(),
        component: "",
        location: "",
        qty: 0,
        uom: "--",
        remark: "",
        mfgQty: 0,
      },
    ]);
    setShowResetConfirm(false);
  };
  const columns = [
    {
      headerName: "SKU Name",
      renderCell: ({ row }) => <Input disabled value={row.sku} />,
    },
    {
      headerName: "SKU Code",
      renderCell: ({ row }) => <Input disabled value={row.skuCode} />,
    },
    {
      headerName: "Qty",
      renderCell: ({ row }) => (
        <Input
          defaultValue={row.finishedqty}
          onChange={(e) => {
            inputHandler("qty", e.target.value);
          }}
        />
      ),
    },
    {
      headerName: "Pending Qty",
      width: 150,
      renderCell: ({ row }) => <Input value={row.pendingqty} disabled />,
    },
    {
      headerName: "Order Qty",
      width: 150,
      renderCell: ({ row }) => <Input value={row.orderqty} disabled />,
    },
    {
      headerName: "Rate",
      renderCell: ({ row }) => (
        <Input
          disabled
          value={row.rate}
          onChange={(e) => {
            inputHandler("rate", e.target.value);
          }}
        />
      ),
    },
    {
      headerName: "SFG QTY",
      renderCell: ({ row }) => (
        <Input
          // value={row.mfgQty}
          onChange={(e) => {
            inputHandler("mfgQty", e.target.value);
          }}
        />
      ),
    },
  ];
  const removeRows = (id) => {
    let arr = rows;
    arr = arr.filter((row) => row.id !== id);
    setRows(arr);
  };
  const addRows = () => {
    const newRow = {
      id: v4(),
      remark: "",
      // hsn: "",
      unit: "",
      component: "",
      pick_location: locationOptions[0]?.value,
      drop_location: locationOptions[0]?.value,
      availableQty: "",
    };
    setRows((rows) => [...rows, newRow]);
  };
  const columnsBOM = [
    {
      // headerName: (
      //   <CommonIcons
      //     disabled
      //     action="addRow"
      //        onClick={addRows}
      //   />
      // ),
      width: 40,
      field: "add",
      sortable: false,
      renderCell: ({ row }) => (
        <CommonIcons
          action="removeRow"
          disabled
          onClick={() => removeRows(rows?.id)}
        />
      ),
      // sortable: false,
    },
    {
      headerName: "Part Name",
      width: 150,
      renderCell: ({ row }) => <Input value={row.part_name} disabled />,
    },
    {
      headerName: "Part No.",
      width: 150,
      renderCell: ({ row }) => <Input value={row.part_no} disabled />,
    },
    {
      headerName: "BOM Qty",
      width: 150,
      renderCell: ({ row }) => <Input value={row.bom_qty} disabled />,
    },
    {
      headerName: "Location Qty ",
      width: 150,
      renderCell: ({ row }) => <Input value={row.loc_qty} disabled />,
    },
  ];
  const backTable = () => {
    setBomList(false);
  };
  useEffect(() => {
    getChallans();
    getProductDetails();
  }, [headerOptions.jobwork]);

  return (
    <div style={{ height: "90%" }}>
      <Drawer
        open={bomList}
        onClose={() => setBomList(false)}
        placement="right"
        title="Bom List"
        closable={true}
        width="100vw"
      >
        <FormTable columns={columnsBOM} data={bomListRows} />
        <NavFooter
          selectLoading={selectLoading}
          submitFunction={() => setShowSubmitConfirm(true)}
          backFunction={() => setBomList(false)}
          nextLabel="Submit"
          // setSelectLoading={setSelectLoading}
        />
        {/*     <Form.Item>
                    <Button
                      htmlType="button"
                      onClick={() => setShowResetConfirm(true)}
                    >
                      Reset
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item> */}
      </Drawer>
      <SearchHeader title="Create SFG" />
      {/* submit confirm modal */}
      <Modal
        title="Submit Confirm"
        open={showSubmitConfirm}
        onOk={submitHandler}
        confirmLoading={submitLoading}
        onCancel={() => backFunction()}
      >
        Are you sure to create this SFG?
      </Modal>
      {/* reset confirm modal */}
      <Modal
        title="Reset Confirm"
        open={showResetConfirm}
        onOk={resetHandler}
        onCancel={() => setShowResetConfirm(false)}
      >
        Are you sure you want to reset the form and components?
      </Modal>
      <Row gutter={10} style={{ height: "100%", padding: "0px 5px" }}>
        <Col span={6}>
          <Card size="small">
            <Form
              name="headerFOrm"
              layout="vertical"
              form={form}
              onFinish={validationHandler}
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select Jobwork!",
                  },
                ]}
                name="jobwork"
                label="Jobwork"
              >
                <MyAsyncSelect
                  //   placeholder="Search Part Code"
                  selectLoading={selectLoading}
                  optionsState={asyncOptions}
                  onBlur={() => setAsyncOptions([])}
                  value={headerOptions.jobwork}
                  loadOptions={(search) =>
                    getAsyncOptions(search, "/jwvendor/getAllJW")
                  }
                  onChange={(value) => {
                    setHeaderOptions((obj) => ({
                      ...obj,
                      jobwork: value,
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Challan"
                name="challan"
                rules={[
                  {
                    required: true,
                    message: "Please select Jobwork!",
                  },
                ]}
              >
                <MySelect
                  disabled={headerOptions.jobwork === ""}
                  //   placeholder="Search Part Code"
                  options={challans}
                  value={headerOptions.challan}
                  onChange={(value) => {
                    setHeaderOptions((obj) => ({
                      ...obj,
                      challan: value,
                    }));
                  }}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col
          span={18}
          style={{
            height: "95%",
            border: "1px solid #F0F0F0",
            padding: 0,
          }}
        >
          {/* {bomList ? (
            <FormTable columns={columnsBOM} data={bomListRows} />
          ) : ( */}
          <FormTable columns={columns} data={rows} />
          {/* )} */}

          <NavFooter
            loading={loading}
            submitFunction={getBomFromJW}
            backFunction={backTable}
            nextLabel="Next"
            // setSelectLoading={setSelectLoading}
          />
        </Col>
      </Row>
    </div>
  );
}

export default ManufacturingSFG;
