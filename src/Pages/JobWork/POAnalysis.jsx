import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Col, Form, Input, Row,
  Card,
  Modal,
  Space,
  Checkbox, } from "antd";
import { imsAxios } from "../../axiosInterceptor";
import { v4 } from "uuid";
import socket from "../../Components/socket";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import MyDatePicker from "../../Components/MyDatePicker";
import { downloadCSV } from "../../Components/exportToCSV";
import ToolTipEllipses from "../../Components/ToolTipEllipses";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { downloadFunction } from "../../Components/printFunction";
import MySelect from "../../Components/MySelect";
import MyButton from "../../Components/MyButton";
import MyDataTable from "../../Components/MyDataTable";
import ViewModal from "./ViewModal";
import {printFunction} from '../../Components/printFunction';


const POAnalysis = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalInfo, setUpdateModalInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [advancedFilter, setAdvancedFilter] = useState(false);
  const [advancedDate, setAdvancedDate] = useState("");

  const [filterForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const wise = Form.useWatch("wise", filterForm);
const vendor = localStorage.getItem("vendor");
  const getRows = async () => {
    const values = await filterForm.validateFields();
    const payload = {
      // data: values.value,
      wise: "vendorwise",
      advanced: true,
      dateRange: advancedDate,
      data:vendor,
    };
    setLoading("fetch");
    const response = await imsAxios.post("/jobwork/jw_analysis", payload);
    setLoading(false);
    const { data } = response;
    let arr = [];
    if (data) {
      if (data.code === 200) {
        arr = data.data.map((row, index) => ({
          id: index + 1,
          date: row.date,
          jwId: row.po_sku_transaction,
          vendor: row.vendor,
          sku: row.skucode,
          product: row.skuname,
          reqQty: row.requiredqty,
          status: row.po_status,
          recipeStatus: row.bom_recipe,
          poStatus: row.po_status,
          skuKey: row.sku,
          project_description: row.project_description,
          project_name: row.project_name,
        }));
      } else {
        toast.error(data.message.msg);
      }
    } else {
    }
    setRows(arr);
  };

  const handleSocketDownload = async () => {
    const values = await filterForm.validateFields();
    const payload = {
      vendor: values.value,
      notificationId: v4(),
    };
    socket.emit("jw_analysis", payload);
  };
  const handlePrint = async (jwId, action) => {
    const payload = {
      transaction: jwId,
    };
    setLoading("print");
    const response = await imsAxios.post("/jobwork/print_jw_analysis", payload);
    setLoading(false);
    const { data } = response;
    if (data) {
      if (action === "print") {
        printFunction(data.data.buffer.data);
      } else {
        downloadFunction(data.data.buffer.data, jwId);
      }
    } else {
      toast.error(data.message.msg);
    }
  };
  const askPassword = () => {
    // <Modal
  };
  const vendorLogin = async () => {
    setConfirmLoading(true);
    const values = await passwordForm.validateFields();
    let vencode = selectedRow.vendor.split("( ")[1].split(" )")[0];
    const response = await imsAxios.post("/auth/redirectVendor", {
      currentPassword: values.password,
      vendorCode: vencode,
    });
    const { data } = response;
    setConfirmLoading(true);
    if (response.status === 200) {
      const link = `https://oakter.vendor.mscorpres.co.in/requests/pending?token=${data.redirectToken}`;
      window.open(link, "_blank");
      setConfirmLoading(false);
      setOpen(false);
      passwordForm.resetFields();
    } else {
      toast.error(response.data);
      setConfirmLoading(false);
    }
    // navigate("");
  };
  useEffect(() => {
    if (wise !== "datewise") {
      filterForm.setFieldValue("value", "");
    }
  }, [wise]);
  const actionColumn = {
    headerName: "",
    type: "actions",
    width: 30,
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        disabled={row.recipeStatus === "PENDING"}
        label="View"
        onClick={() => setViewModalOpen(row)}
      />,
      <GridActionsCellItem
        showInMenu
        label="Print"
        onClick={() => handlePrint(row.jwId, "print")}
      />,
      <GridActionsCellItem
        showInMenu
        label="Download"
        onClick={() => handlePrint(row.jwId, "download")}
      />,
    ],
  };
  const getRowinModal = (row) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const selectedWise = filterForm.getFieldValue("wise");

  return (
    <Row gutter={6} style={{ height: "90%", padding: 10 }}>
      <Col span={4}>
        <Row gutter={[0, 6]}>
          <Col span={24}>
            <Card size="small" title="Filters">
              <Form
                initialValues={initialValues}
                layout="vertical"
                form={filterForm}
              >
                {/* <Form.Item label="Select Wise" name="wise">
                  <MySelect options={wiseOptions} labelInValue />
                </Form.Item>
                {valueInput(wise, filterForm)} */}

                {/* <Form.Item
                  label="Advanced Filter"
                  name="advancedFilter"
                  className=""
                >
                  <Checkbox
                    onChange={(e) => setAdvancedFilter(e.target.checked)}
                  />
                </Form.Item> */}

                {/* {selectedWise?.value !== "datewise" && advancedFilter && ( */}
                  <Form.Item label="Select Date" name="wise">
                  <MyDatePicker
                    setDateRange={(value) => setAdvancedDate(value)}
                  />
                </Form.Item>
                {/* )} */}

              </Form>
              <Row justify="end">
                <Space>
                  <CommonIcons
                    action="downloadButton"
                    onClick={() =>
                      downloadCSV(rows, columns, "PO Analysis Report")
                    }
                    disabled={rows.length == 0}
                  />
                </Space>
                <Space>
                  {wise?.value === "vendorwise" && (
                    <CommonIcons
                      action="downloadButton"
                      onClick={handleSocketDownload}
                    />
                  )}{" "}
                  <MyButton variant="search" type="primary" onClick={getRows}>
                    Fetch
                  </MyButton>
                </Space>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={20}>
        <MyDataTable
          loading={loading === "fetch" || loading === "print"}
          columns={[actionColumn, ...columns]}
          data={rows}
          width="100%"
        />
      </Col>
      <ViewModal
        setViewModalOpen={setViewModalOpen}
        viewModalOpen={viewModalOpen}
      />
      <Modal
        title="Confirm Password"
        open={open}
        onOk={() => vendorLogin()}
        onCancel={() => setOpen(false)}
        okText="Okay"
        cancelText="Back"
        confirmLoading={confirmLoading}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item name="password" label="Current Password">
            <Input.Password placeholder="Enter you Current Password" />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default POAnalysis;
const wiseOptions = [
  {
    text: "Date",
    value: "datewise",
  },
  {
    text: "JobWork ID",
    value: "jw_transaction_wise",
  },
  {
    text: "SKU",
    value: "jw_sfg_wise",
  },
  {
    text: "Vendor",
    value: "vendorwise",
  },
];

const initialValues = {
  wise: {
    label: "JobWork ID",
    value: "jw_transaction_wise",
  },
};

const columns = [
  {
    headerName: "#",
    width: 30,
    field: "id",
  },
  {
    headerName: "Date",
    field: "date",
    width: 150,
    renderCell: ({ row }) => <ToolTipEllipses text={row.date} />,
  },
  {
    headerName: "Jobwork ID",
    field: "jwId",
    width: 200,
    renderCell: ({ row }) => <ToolTipEllipses text={row.jwId} copy={true} />,
  },
  {
    headerName: "Vendor",
    field: "vendor",
    minWidth: 150,
    flex: 1,
    renderCell: ({ row }) => <ToolTipEllipses text={row.vendor} />,
  },
  {
    headerName: "SKU",
    field: "sku",
    width: 150,
    renderCell: ({ row }) => <ToolTipEllipses text={row.sku} copy={true} />,
  },
  {
    headerName: "Product",
    field: "product",
    minWidth: 150,
    flex: 1,
    renderCell: ({ row }) => <ToolTipEllipses text={row.product} />,
  },
  {
    headerName: "Required Qty",
    field: "reqQty",
    width: 150,
  },
  {
    headerName: "Project ID",
    field: "project_name",
    width: 200,
    renderCell: ({ row }) => (
      <ToolTipEllipses text={row.project_name} copy={true} />
    ),
  },
  {
    headerName: "Project Description",
    field: "project_description",
    width: 200,
    renderCell: ({ row }) => (
      <ToolTipEllipses text={row.project_description} copy={true} />
    ),
  },
];

const valueInput = (wise, form) => {
  if (wise?.value === "datewise") {
    return <DateWise form={form} wise={wise} />;
  } else if (wise?.value === "jw_transaction_wise") {
    return <JWIDInput wise={wise} />;
  } else if (wise?.value === "jw_sfg_wise") {
    return <SKUSelect wise={wise} />;
  } 
};

const DateWise = ({ form, wise }) => (
  <Form.Item label={wise?.label} name="value">
    <MyDatePicker
      setDateRange={(value) => form.setFieldValue("value", value)}
    />
  </Form.Item>
);
const JWIDInput = ({ wise }) => (
  <Form.Item label={wise?.label} name="value">
    <Input />
  </Form.Item>
);
const SKUSelect = ({ wise }) => {
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSkuOptions = async (search) => {
    const payload = {
      search,
    };
    setLoading(true);
    const response = await imsAxios.post(
      "/backend/getProductByNameAndNo",
      payload
    );
    setLoading(false);
    let arr = [];
    const { data } = response;
    if (data && data.length > 0) {
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
    }
    setAsyncOptions(arr);
  };

  return (
    <Form.Item label={wise?.label} name="value">
      <MyAsyncSelect
        loadOptions={getSkuOptions}
        optionsState={asyncOptions}
        onBlur={() => setAsyncOptions([])}
        selectLoading={loading}
      />
    </Form.Item>
  );
};
