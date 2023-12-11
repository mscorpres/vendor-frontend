import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";

export default function FormTable({ columns, data, loading }) {
  const [headers, setHeaders] = useState([]);
  const [cells, setCells] = useState([]);
  useEffect(() => {
    let arr = columns.map((row) => {
      return row.headerName;
    });
    let arr1 = columns.map((row) => {
      return row.renderCell({ row });
    });
    setHeaders(arr);
    setCells(arr1);
  }, [columns]);

  return (
    // <TableContainer
    //   sx={{ height: "100%", width: "100vw", overflowX: "scroll" }}
    // >
    <TableContainer style={{ height: "100%", border: "1px solid white" }}>
      <Table
        stickyHeader
        sx={{ width: "100%", overflowX: "auto" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            {columns.map((row) => (
              <TableCell
                sx={{
                  width: `${row.width && row.width}px !important`,
                  maxWidth: `${row.width && row.width}px !important`,
                  minWidth: `${row.width && row.width}px !important`,
                  background: "rgb(240, 240, 240)",
                  textAlign: "center",
                }}
                key={row.headerName}
                component="th"
              >
                <strong>{row.headerName}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row?.name}>
              {columns.map((col) => (
                <TableCell
                  size="small"
                  sx={{
                    width: `${row.width && row.width}px !important`,
                    maxWidth: `${row.width && row.width}px !important`,
                    minWidth: `${row.width && row.width}px !important`,
                    justifyContent: "center",
                    // textAlign: "center",
                    padding: "2px 5px",
                    border: "none",
                  }}
                >
                  {col.renderCell({ row })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // {/* </TableContainer> */}
  );
}
