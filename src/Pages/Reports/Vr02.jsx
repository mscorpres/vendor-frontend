import { useState, useEffect } from "react";
import { Col, Input, Row, Space, Button } from "antd";
import MySelect from "../../Components/MySelect";
import MyDatePicker from "../../Components/MyDatePicker";
import MyDataTable from "../../Components/MyDataTable";
import axios from "axios";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { downloadCSV } from "../../Components/exportToCSV";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import { toast } from "react-toastify";
import printFunction, { downloadFunction } from "../../Components/printFunction";

const Vr02 = () => {
  document.title = "RM Stock";
  const actionColumn = {
    headerName: "",
    field: "actions",
    width: 10,
    type: "actions",
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        // disabled={loading}
        onClick={() => {
          setShowView({
            woId: row.transactionId,
            subjectId: row.bomid,
            sku: row.productId,
          });
        }}
        label="View"
      />,
      // <GridActionsCellItem
      //   showInMenu
      //   // disabled={loading}
      //   onClick={() => {
      //     downloadwocompleted(row);
      //   }}
      //   label="Re Open"
      // />,
      <GridActionsCellItem
        showInMenu
        // disabled={loading}
        onClick={() => printwocompleted(row)}
        label="Print"
      />,
      <GridActionsCellItem
        showInMenu
        // disabled={loading}
        onClick={() => {
          downloadwocompleted(row);
        }}
        label="Download"
      />,
    ],
  };
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [showView, setShowView] = useState(false);


  const printwocompleted = async(row)=>{
    try {
      setLoading("fetch");
      const response = await axios.post('/createwo/print_wo_completed_list',{
        "transaction": row.transactionId
      })
      const {data} = response
      printFunction(response.data.data.buffer.data)
     toast.success(data.message)
    } catch (error) {
      console.log("some error occured while fetching rows", error);
    } finally {
      setLoading(false);
    }
  }

  const downloadCol = () => {
    downloadCSV(rows, columns, "VR02 Report");
  };

  const downloadwocompleted = async(row)=>{
    try {
      setLoading("fetch");
      const response = await axios.post('/createwo/print_wo_completed_list',{
          "transaction": row.transactionId
      })
      const {data} = response
      downloadFunction(response.data.data.buffer.data)
      toast.success(data.message)
    } catch (error) {
      console.log("some error occured while fetching rows", error);
    } finally {
      setLoading(false);
    }
  }

  const getRows = async () => {
    try {
      setLoading("fetch");
      const response = await axios.post('/vr02',{
        date: searchInput,
      })
      const {data} = response
      console.log(data)
      if(data.code === 200){
      const arr = data.response.data.map((row, index) => ({
        id: index + 1,
        date: row.date,
        part: row.part_name,
        part_code: row.part_code,
        inward: row.inward,
        outward: row.outward,
        opening: row.opening,
        closing: row.closing,
      }));
      setRows(arr);
    } else {
      toast.error(data.message.msg)
      setRows([]);
    }
    } catch (error) {
      console.log("some error occured while fetching rows", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <><div style={{ height: "90%" }}>
      <Row style={{ padding: 5, paddingTop: 0 }} justify="space-between">
        <Col>
          <Space>
            <div style={{ paddingBottom: '10px' }}>
              <Space>
                <div style={{ width: 250 }}>
                <MyDatePicker setDateRange={setSearchInput} />
                </div>
                
                <Button
                  onClick={getRows}
                  loading={loading === "fetch"}
                  type="primary"
                >
                  Fetch
                </Button>
              </Space>
            </div>
          </Space>
        </Col>
        <CommonIcons
          action="downloadButton"
          onClick={downloadCol}
          type="primary" />
      </Row>
      <div style={{ height: "95%", paddingRight: 5, paddingLeft: 5 }}>
        <MyDataTable loading={loading === "fetch"} data={rows} columns={columns} />
      </div>
    </div></>
  );
};


// id: index + 1,
//         date: row.date,
//         requiredQty: row.ord_qty,
//         sku: row.sku_name,
//         product: row.sku_code,
//         transactionId:
const columns = [
  {
    headerName: "#",
    width: 30,
    field: "id",
  },
  {
    headerName: "Part Name",
    width: 400,
    field: "part",
  },
  {
    headerName: "Part Code",
    width: 200,
    field: "part_code",
  },
  {
    headerName: "Opening",
    width: 150,
    field: "opening",
  },
  {
    headerName: "Inward",
    width: 200,
    field: "inward",
  },
  {
    headerName: "Outward",
    width: 150,
    field: "outward",
  },

  {
    headerName: "Closing",
    width: 150,
    field: "closing",
  },
];


export default Vr02;
