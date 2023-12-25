import { useState } from "react";
import { Button, Card, Col, Form, Input, Modal, Row,Upload } from "antd";
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
import { UploadProps } from 'antd';

import { UploadOutlined } from "@ant-design/icons";
import MyDatePicker from '../../Components/MyDatePicker'





function RMConsumption() {
  const { locations: locationOptions } = useSelector((state) => state.login);
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
      component: "",
      location: locationOptions[0]?.value,
      qty: 0,
      uom: "--",
      remark: "",
    },
  ]);
  console.log("locationOptions", rows);
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
      location: locationOptions[0]?.value,
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
        showToast("", "Some error Occurred", "error");
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
      pick_location: rows.map(
        (row) => (row.location = locationOptions[0]?.value)
      ),
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
      return showToast("", message, "error");
    }
    const newhederData = {
      challan_date: headerData.challan_date,
      challan_no: headerData.challan_no
    }
    const fromdata = new FormData();
    for(let i=0; i < headerData.file.fileList.length; i++){
      fromdata.append("files", headerData.file.fileList[i].originFileObj);
    }  
    let finalObj = { ...newhederData, ...compData, jobwork_attach: headerData.file.fileList[0].originFileObj.name };
    setShowSubmitConfirm({
      finalObj: finalObj,
      fromdata: fromdata
    });
  };

  const props = {
    onRemove: (file) => {
        setFileList(
            fileList.filter((item) => item.uid !== file.uid)
        );
    },
    beforeUpload: (file) => {
        setFileList([...fileList, file]);
        return false;
    },
    fileList,
};




  const submitHandler = async () => {
    console.log(showSubmitConfirm)
    if (showSubmitConfirm) {
      let fileData;
      setSubmitLoading(true);
      const response = await axios.post(
        "/jwvendor/upload-invoice",
        showSubmitConfirm.fromdata
      );
      console.log(response)
      if(response.status != 200){
        setSubmitLoading(false);
        return toast.error('something went worng while uploading the file');
      }
      
      const uploadedFile = response.data;
      fileData = uploadedFile;
      if (fileData.code != 200) {
        return toast.error(
          "Some error occured while uploading invoices, Please try again"
        );
      }
      else{
      setFileList([])
      const { data } = await axios.post("/jwvendor/rmConsp", showSubmitConfirm.finalObj);
      setSubmitLoading(false);
      setShowSubmitConfirm(false);
      if (data.code === 200) {
        showToast("", data.message, "success");
        resetHandler();
      } else {
        showToast("", data.message.msg, "error");
      }
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
        location: locationOptions[0]?.value,
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
          <CommonIcons onClick={() => removeRows(row.id)} action="removeRow" />
        </div>
      ),
    },
    {
      headerName: "Component",
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
      renderCell: ({ row }) => (
        <MySelect
          // labelInValue
          value={locationOptions[0]?.text}
          // value={locationOptions[0]?.text}
          // options={locationOptions}
          onChange={(value) => {
            inputHandler("location", value, row.id);
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
                    message: "Please select Jobwork!",
                  },
                ]}
                name="challan_no"
                label="Challan Number"
              >
                <Input placeholder="Please enter challan number" />
              </Form.Item>
              <Form.Item
                label="Challan Date"
                name="challan_date"
                rules={[
                  {
                    required: true,
                    message: "Please select Jobwork!",
                  },
                ]}
              >
                <Input type="date" />
              </Form.Item>
              <Col span={8}>
                                <Form.Item
                                    name="file"
                                    label="Challan Document(s)"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Document!",
                                        },
                                    ]}>
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

export default RMConsumption;
