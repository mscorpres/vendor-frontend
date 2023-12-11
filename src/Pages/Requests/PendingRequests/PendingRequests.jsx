import { useState } from "react";
import { Space } from "antd";
import MySelect from "../../../Components/MySelect";
import MyDatePicker from "../../../Components/MyDatePicker";
import TableActions, {
  CommonIcons,
} from "../../../Components/TableActions.jsx/TableActions";
import MyDataTable from "../../../Components/MyDataTable";
import axios from "axios";
import showToast from "../../../Components/MyToast";
import SearchHeader from "../../../Components/SearchHeader";
import ChallanInward from "./ChallanInward";

function PendingRequests() {
  document.title = "Pending Requests";
  const [wise, setWise] = useState("datewise");
  const [searchInput, setSearchInput] = useState("");
  const [rows, setRows] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [challanInward, setChallanInward] = useState(false);

  const wiseOptions = [{ text: "Date Wise", value: "datewise" }];
  const getRows = async () => {
    // showToast(
    //   "new Notification",
    //   "this is a new notification nigga",
    //   "success"
    // );
    setSearchLoading(true);
    const { data } = await axios.post("/jwvendor/fetchPendingJWChallan", {
      searchBy: wise,
      searchValue: searchInput,
    });
    if (data.code == 200) {
      let arr = data.response.data.map((row, index) => ({
        ...row,
        index: index + 1,
        id: index,
      }));

      setRows(arr);
    } else {
      showToast("", data.message.msg, "error");
    }
    setSearchLoading(false);
  };
  const columns = [
    { headerName: "Sr. No.", field: "index", width: 70 },
    { headerName: "Jobwork ID", field: "jobwork", flex: 1 },
    { headerName: "Challan Id", field: "challan", flex: 1 },
    { headerName: "Insert Date", field: "insert_dt", flex: 1 },
    { headerName: "Insert By", field: "insert_by", flex: 1 },
    {
      headerName: "Action",
      field: "action",
      type: "actions",
      flex: 1,
      getActions: ({ row }) => [
        <TableActions
          action="add"
          onClick={() =>
            setChallanInward({ challan: row.challan, jw: row.jobwork })
          }
        />,
      ],
    },
  ];
  const searchBar = () => (
    <Space>
      <div style={{ width: 200 }}>
        <MySelect
          value={wise}
          onChange={(value) => setWise(value)}
          options={wiseOptions}
        />
      </div>
      <div style={{ width: 300 }}>
        {wise === "datewise" && <MyDatePicker setDateRange={setSearchInput} />}
      </div>
      <CommonIcons
        action="searchButton"
        loading={searchLoading}
        onClick={getRows}
      />
    </Space>
  );
  return (
    <div style={{ height: "90%" }}>
      <SearchHeader title="Pending Requests" searchBar={searchBar} />
      <ChallanInward
        challanInward={challanInward}
        setChallanInward={setChallanInward}
      />
      <div style={{ height: "100%", padding: "0px 5px" }}>
        <MyDataTable loading={searchLoading} columns={columns} rows={rows} />
      </div>
    </div>
  );
}

export default PendingRequests;
