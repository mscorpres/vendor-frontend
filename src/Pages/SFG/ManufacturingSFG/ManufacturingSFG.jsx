import { useState } from "react";
import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
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

function ManufacturingSFG() {
  document.title = "Create SFG";
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [challans, setChallans] = useState([]);
  const [headerOptions, setHeaderOptions] = useState({
    jobwork: "",
    challan: "",
  });
  const [rows, setRows] = useState([
    {
      id: v4(),
      sku: "",
      skuid:'',
      location: "",
      finishedqty: 0,
      pendingqty: 0,
      orderqty: 0,
      skuCode: "",
      rate:"",
      remark: "",
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

const getProductDetails = async () => {
  setSelectLoading(true);
    const { data } = await axios.post("/jwvendor/getJwSkuDetails", {
      jw_id: headerOptions.jobwork,
    });
    if (data.code === 200) {
    rows[0].sku = data.data.skuname
    rows[0].skuid = data.data.sku
    rows[0].pendingqty = data.data.pending_qty
    rows[0].orderqty = data.data.ord_qty
    rows[0].rate = data.data.rate
    rows[0].skuCode = data.data.skucode
    }
    setSelectLoading(false);
    console.log(data)
}


  const getComponentDetails = async (value, id) => {
    const { data } = await axios.post("/jwvendor/getComponentDetailsByCode", {
      component_code: value.value,
    });
    return data;
  };
  const inputHandler = async (name, value, id) => {
    console.log(name,value,id)
    let arr = rows;
    if (name === "rate") {
       rows[0].rate = value
    }else if(name === 'qty'){
      rows[0].finishedqty = value
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
    let finalObj = { }
    setShowSubmitConfirm(finalObj);
  };
  const submitHandler = async () => {
    if (showSubmitConfirm) {
      setSubmitLoading(true);
      const { data } = await axios.post(
        '/jwvendor/sfgInward',
        {
          "jw_id": headerOptions.jobwork,
          "jw_challan": headerOptions.challan,
          "sku": rows[0].skuCode,
          "qty": rows[0].finishedqty,
          "rate": rows[0].rate,
        }
      );
      setSubmitLoading(false);
      setShowSubmitConfirm(false);
      if (data.code === 200) {
        toast.success(data.message);
        resetHandler();
      } else {
        toast.error(data.message.msg);
      }
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
      },
    ]);
    setShowResetConfirm(false);
  };
  const columns = [
    {
      headerName: "SKU Name",
      renderCell: ({ row }) => (
        <Input disabled value={row.sku} />
      ),
    },
    {
      headerName: "SKU Code",
      renderCell: ({ row }) => (
        <Input disabled value={row.skuCode} />
      ),
    },
    {
      headerName: "Qty",
      renderCell: ({ row }) => (
        <Input
          defaultValue={row.finishedqty}
          onChange={(e) => {
            inputHandler("qty", e.target.value)
          }}
        />
      ),
    },
    {
      headerName: "Pending Qty",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.pendingqty}
          disabled
        />
      ),
    },
    {
      headerName: "Order Qty",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.orderqty}
          disabled
        />
      ),
    },
    {
      headerName: "Rate",
      renderCell: ({ row }) => (
        <Input
          disabled
          value={row.rate}
          onChange={(e) => {
            inputHandler("rate", e.target.value)
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    getChallans();
    getProductDetails();
  }, [headerOptions.jobwork]);

  return (
    <div style={{ height: "90%" }}>
      <SearchHeader title="Create SFG" />
      {/* submit confirm modal */}
      <Modal
        title="Submit Confirm"
        open={showSubmitConfirm}
        onOk={submitHandler}
        confirmLoading={submitLoading}
        onCancel={() => setShowSubmitConfirm(false)}
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
              <Row justify="end" gutter={8}>
                <Col>
                  <Form.Item>
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
                  </Form.Item>
                </Col>
              </Row>
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
          <FormTable columns={columns} data={rows} />
        </Col>
      </Row>
    </div>
  );
}

export default ManufacturingSFG;
