import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Upload,
  message,
} from "antd";
import axios from "axios";
import SearchHeader from "../../Components/SearchHeader";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { useSelector } from "react-redux";
import MySelect from "../../Components/MySelect";
import FormTable from "../../Components/FormTable";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import showToast from "../../Components/MyToast";
import { useEffect } from "react";
import { UploadProps } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import MyDatePicker from "../../Components/MyDatePicker";

function RMConsumption() {
  document.title = "RM Consumption";
  const { locations: locationOptions } = useSelector((state) => state.login);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [challans, setChallans] = useState([]);

  const [availQty, setAvailQty] = useState("");
  const [headerOptions, setHeaderOptions] = useState({
    jobwork: "",
    challan: "",
  });
  const [rows, setRows] = useState([
    {
      id: v4(),
      component: "",
      location: "",
      qty: 0,
      uom: "--",
      remark: "",
      availableQty: "",
    },
  ]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

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
  const addRows = () => {
    const newRow = {
      id: v4(),
      component: "",
      location: "",
      qty: "",
      uom: "--",
      remark: "",
    };
    let arr = rows;
    arr = [newRow, ...arr];
    setRows(arr);
  };
  const removeRows = (id) => {
    let arr = rows;
    arr = arr.filter((row) => row.id !== id);
    setRows(arr);
  };
  const getComponentDetails = async (value, id) => {
    const { data } = await axios.post("/jwvendor/getComponentDetailsByCode", {
      component_code: value.value,
    });
    return data;
  };
  const inputHandler = async (name, value, id) => {
    let arr = rows;
    if (name === "component") {
      const data = await getComponentDetails(value);
      if (data.code === 200) {
        arr = arr.map((row) => {
          if (row.id === id) {
            row = {
              ...row,
              [name]: value,
              uom: data.data.unit,
            };

            return row;
          } else {
            return row;
          }
        });
      } else {
        toast.error("Some error Occurred");
      }
    }
    arr = arr.map((row) => {
      if (row.id === id) {
        row = {
          ...row,
          [name]: value,
        };

        return row;
      } else {
        return row;
      }
    });
    setRows(arr);
  };
  const validationHandler = (headerData) => {
    let validation = false;
    let message = "";
    let compData = {
      component: rows.map((row) =>
        row.component === "" ? (validation = "component") : row.component.value
      ),
      qty: rows.map((row) =>
        row.qty === "" || row.qty === 0 ? (validation = "qty") : row.qty
      ),
      pick_location: rows.map((row) => row.location),
      remark: rows.map((row) => row.remark),
    };
    if (validation === "component") {
      message = "Please select component for all rows";
    } else if (validation === "qty") {
      message = "Please enter a quanity more than 0";
    } else if (validation === "location") {
      message = "Please select a location for all the components";
    }
    if (validation) {
      return toast.error(message);
    }
    const newhederData = {
      challan_date: headerData.challan_date,
      challan_no: headerData.challan_no,
    };
    const fromdata = new FormData();
    for (let i = 0; i < headerData.file.fileList.length; i++) {
      fromdata.append("files", headerData.file.fileList[i].originFileObj);
    }
    let finalObj = {
      ...newhederData,
      ...compData,
    };
    setShowSubmitConfirm({
      finalObj: finalObj,
      fromdata: fromdata,
    });
  };

  const props = {
    onRemove: (file) => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 10;
      console.log("file in before uplaod", isLt2M);
      if (isLt2M) {
        setFileList([...fileList, file]);
        return false;
      } else {
        message.error("File should not exceed the limit of 10MB!");
      }
    },
    fileList,
  };
  const getDetails = async (c, l) => {
    console.log("c", c.value);
    console.log("l", l);
    // setPageLoading(true);
    const { data } = await axios.post("/jwvendor/getStock", {
      component: c.value,
      pick_location: l,
    });
    rows[0].availableQty = "";
    if (data.code === 200) {
      // console.log("data", data);
      rows[0].availableQty = data.data.calculated_qty;
      // availQty = data.data.location_qty;
      setAvailQty(data.data.calculated_qty);
      // console.log("data.data.location_qty- >>", data.data.location_qty);
    }
  };
  useEffect(() => {
    // console.log("availQty", availQty);
    if (availQty) {
      // console.log("availQty inside avail Qty", availQty);
      setAvailQty(availQty);
      // rows[0].availableQty = availQty;
    }
  }, [availQty]);

  useEffect(() => {
    // console.log("rows?.pick_location", rows);
    if (rows[0]?.component && rows[0]?.location) {
      console.log("rows[0]?.pick_location", rows[0]?.location);
      console.log("rows[0]?.component", rows[0]?.component);
      getDetails(rows[0].component, rows[0].location);
    }
  }, [rows[0]?.component, rows[0]?.location]);
  const confirmModal = () => {
    Modal.confirm({
      title: "Are you sure you want to submit this Tranfer Request?",
      content:
        "Please make sure that the values are correct, This process is irreversible",
      onOk() {
        validateFields();
      },
      onCancel() {},
    });
  };
  const validateFields = async () => {
    const values = await form.validateFields();
    console.log("valuesss", values);
    submitData(values);
  };
  const submitData = async (values) => {
    console.log("rows=>", rows);

    let payload = {
      challan_no: values.challan_no,
      challan_date: values.challan_date,
      jobwork_attach: values.file,
      component: rows.map((r) => r.component.value),
      qty: rows.map((r) => r.qty),
      pick_location: rows.map((r) => r.location),
      remark: rows.map((r) => r.remark),
    };
    console.log("payload", payload);
    const response = await axios.post("/jwvendor/rmConsp", payload);
    const { data } = response;
    console.log("data", data);
    if (data.code === 200) {
      toast.success(data.message);
      resetHandler();
    } else {
      toast.error(data.message.msg);
    }
  };
  const submitHandler = async () => {
    if (showSubmitConfirm && showSubmitConfirm.fromdata) {
    }
    {
      let fileData;
      setSubmitLoading(true);
      const response = await axios.post(
        "/jwvendor/upload-invoice",
        showSubmitConfirm.fromdata
      );
      if (response.status != 200) {
        setSubmitLoading(false);
        return toast.error("something went worng while uploading the file");
      }
      const uploadedFile = response.data;
      console.log("uploadedFile", uploadedFile);
      fileData = uploadedFile;
      showSubmitConfirm.finalObj.jobwork_attach = uploadedFile.data;
      if (fileData.code != 200) {
        console.log("fileDatafileData", fileData);
        // return toast.error(
        //   "Some error occured while uploading invoices, Please try again"
        // );
      } else {
        const { data } = await axios.post(
          "/jwvendor/rmConsp",
          showSubmitConfirm.finalObj
        );
        console.log("data", showSubmitConfirm.finalObj);

        setSubmitLoading(false);
        setShowSubmitConfirm(false);
        if (data.code === 200) {
          toast.success(data.message);
          resetHandler();
        } else {
          toast.error(data.message.msg);
        }
        setTimeout(() => {
          toast.error("Time Out!");
          resetHandler();
          setSubmitLoading(false);
        }, 30000);
        submitLoading(false);
      }
      setTimeout(() => {
        toast.error("Time Out!");
        setSubmitLoading(false);
      }, 60000);
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
      headerName: (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          <CommonIcons onClick={addRows} action="addRow" />
        </div>
      ),
      width: 80,
      renderCell: ({ row }) => (
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          {rows.length > 1 && (
            <CommonIcons
              onClick={() => removeRows(row.id)}
              action="removeRow"
            />
          )}
        </div>
      ),
    },
    {
      headerName: "Component",
      width: 200,
      renderCell: ({ row }) => (
        <MyAsyncSelect
          //   placeholder="Search Part Code"
          selectLoading={selectLoading}
          optionsState={asyncOptions}
          labelInValue
          onBlur={() => setAsyncOptions([])}
          value={row.component}
          loadOptions={(search) =>
            getAsyncOptions(search, "/backend/getComponentByNameAndNo")
          }
          onChange={(value) => {
            inputHandler("component", value, row.id);
          }}
        />
      ),
    },
    {
      headerName: "Pick Location",
      width: 100,
      renderCell: ({ row }) => (
        <MySelect
          // labelInValue
          // value={locationOptions[0]?.text}
          // value={locationOptions[0]?.text}
          options={locationOptions}
          onChange={(value) => {
            inputHandler("location", value, row.id);
          }}
        />
      ),
    },
    {
      headerName: "Available Qty",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.availableQty}
          options={locationOptions}
          suffix={row.uom}
          disabled
          onChange={(e) => {
            inputHandler("availableQty", e.target.value, row.id);
          }}
        />
      ),
    },
    {
      headerName: "Qty",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.qty}
          options={locationOptions}
          suffix={row.uom}
          onChange={(e) => {
            inputHandler("qty", e.target.value, row.id);
          }}
        />
      ),
    },
    {
      headerName: "Remark",
      renderCell: ({ row }) => (
        <Input
          value={row.remark}
          onChange={(e) => {
            inputHandler("remark", e.target.value, row.id);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    getChallans();
  }, [headerOptions.jobwork]);

  return (
    <div style={{ height: "90%" }}>
      <SearchHeader title="Create RM Consumption" />
      {/* submit confirm modal */}
      <Modal
        title="Submit Confirm"
        open={showSubmitConfirm}
        onOk={submitHandler}
        confirmLoading={submitLoading}
        onCancel={() => setShowSubmitConfirm(false)}
      >
        Are you sure to create this RM Consumption?
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
                    message: "Please select Challan Number!",
                  },
                ]}
                name="challan_no"
                label="Document Number"
              >
                <Input placeholder="Please enter challan number" />
              </Form.Item>
              <Form.Item
                label="Document Date"
                name="challan_date"
                rules={[
                  {
                    required: true,
                    message: "Please select Challan Date!",
                  },
                ]}
              >
                <Input type="date" />
              </Form.Item>
              <Col span={8}>
                <Form.Item
                  name="file"
                  label="Any Attachment (optional)"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please Select Document!",
                  //   },
                  // ]}
                >
                  <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => confirmModal()}
                    >
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

export default RMConsumption;
