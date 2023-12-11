import { Card, Col, Form, Row, Space, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { downloadCSV } from "../../Components/exportToCSV";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import MyDataTable from "../../Components/MyDataTable";
import MySelect from "../../Components/MySelect";
import showToast from "../../Components/MyToast";
import SearchHeader from "../../Components/SearchHeader";
import SummaryCard from "../../Components/SummaryCard";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";

function RMStockReport() {
  const [searchLoading, setSearchLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [summaryData, setSummaryData] = useState([
    { title: "Component" },
    { title: "ClosingQty" },
  ]);
  const [pageLoading, setPageLoading] = useState(false);
  const [searchObj, setSearchObj] = useState({
    part_code: "",
    location: "",
  });
  const { locations: locationOptions } = useSelector((state) => state.login);
  const getRows = async () => {
    setFetchLoading(true);
    const { data } = await axios.post("/jwreport/rmLocStock", searchObj);
    setFetchLoading(false);
    if (data.responseCode === "200") {
      let arr = data.response.data2.map((row, index) => ({
        ...row,
        id: index,
      }));
      setRows(arr);
      let summaryArr = [
        { title: "Component", description: data.response.data1.component },
        {
          title: "Closing Quantity",
          description: `${data.response.data1.closingqty} ${data.response.data1.uom}`,
        },
      ];
      setSummaryData(summaryArr);
    } else {
      showToast("", data.message.msg, "error");
      setRows([]);
    }
  };
  const getPartCodes = async (search) => {
    setSelectLoading(true);
    const { data } = await axios.post("/backend/getComponentByNameAndNo", {
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

  const columns = [
    { headerName: "Sr. No", field: "serial_no", width: 80 },
    { headerName: "Date", field: "date", flex: 1 },
    {
      headerName: "Trans Type",
      field: "transaction_type",
      width: 80,
      renderCell: ({ row }) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div
            style={{
              justifyItems: "center",
              alignItems: "center",
              height: 12,
              width: 12,
              borderRadius: 500,
              background: row.transaction_type === "INWARD" ? "#39B689" : "red",
            }}
          ></div>
        </div>
      ),
    },
    { headerName: "Qty In", field: "qty_in", flex: 1 },
    { headerName: "Qty Out", field: "qty_out", flex: 1 },
    { headerName: "Location Inward", field: "location_in", flex: 1 },
    { headerName: "Location Outward", field: "location_out", flex: 1 },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rows, columns, "RM Stock Report");
  };

  const searchBar = () => (
    <Space>
      <div style={{ width: 200 }}>
        <MyAsyncSelect
          placeholder="Search Part Code"
          selectLoading={selectLoading}
          optionsState={asyncOptions}
          onBlur={() => setAsyncOptions([])}
          value={searchObj.part_code}
          loadOptions={getPartCodes}
          onChange={(value) => {
            setSearchObj((obj) => ({
              ...obj,
              part_code: value,
            }));
          }}
        />
      </div>
      <div style={{ width: 300 }}>
        <MySelect
          placeholder="Select Location"
          value={searchObj.location}
          options={locationOptions}
          onChange={(value) => {
            setSearchObj((obj) => ({
              ...obj,
              location: value,
            }));
          }}
        />
      </div>
      <CommonIcons
        action="searchButton"
        loading={searchLoading}
        onClick={getRows}
      />
      <CommonIcons action="downloadButton" onClick={handleDownloadExcel} />
    </Space>
  );
  return (
    <div style={{ height: "90%" }}>
      <SearchHeader title="RM Stock" searchBar={searchBar} />
      <Row gutter={4} style={{ height: "100%", padding: "0px 5px" }}>
        <Col span={6}>
          <SummaryCard summary={summaryData} loading={fetchLoading} />
        </Col>
        <Col span={18}>
          <div style={{ height: "97%" }}>
            <MyDataTable loading={fetchLoading} data={rows} columns={columns} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default RMStockReport;
