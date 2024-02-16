import React from "react";
import {
  CloudUploadOutlined,
  EditFilled,
  PlusOutlined,
  EyeFilled,
  PrinterFilled,
  CloseOutlined,
  DownloadOutlined,
  CloudDownloadOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  DeleteFilled,
  SyncOutlined,
  CheckOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Button, Tooltip } from "antd";

export default function TableActions({ disabled, onClick, action, label }) {
  const Icon = () => {
    if (action === "add") {
      return <PlusOutlined className={`view-icon ${disabled && "disable"}`} />;
    } else if (action === "view") {
      return <EyeFilled className={`view-icon ${disabled && "disable"}`} />;
    } else if (action === "download") {
      return (
        <CloudDownloadOutlined
          className={`view-icon ${disabled && "disable"}`}
        />
      );
    } else if (action === "print") {
      return <PrinterFilled className={`view-icon ${disabled && "disable"}`} />;
    } else if (action === "cancel") {
      return <CloseOutlined className={`view-icon ${disabled && "disable"}`} />;
    } else if (action === "upload") {
      return (
        <CloudUploadOutlined className={`view-icon ${disabled && "disable"}`} />
      );
    } else if (action === "edit") {
      return <EditFilled className={`view-icon ${disabled && "disable"}`} />;
    } else if (action === "delete") {
      return (
        <DeleteFilled
          onClick={() => onClick}
          className={`view-icon ${disabled && "disable"}`}
        />
      );
    }
  };
  return (
    <GridActionsCellItem
      icon={
        <Tooltip title={label}>
          <Icon />
        </Tooltip>
      }
      disabled={disabled}
      onClick={onClick}
      // label="Add"
    />
  );
}
export function CommonIcons({
  action,
  onClick,
  disabled,
  loading,
  size,
  type,
  onMouseEnter,
  tooltip,
}) {
  const Icon = () => {
    if (action === "addRow") {
      return (
        <PlusSquareOutlined
          onClick={onClick}
          style={{
            cursor: "pointer",
            display: "block",

            fontSize: 20,
          }}
        />
      );
    } else if (action === "removeRow") {
      return (
        <MinusSquareOutlined
          onClick={onClick}
          style={{
            cursor: "pointer",
            display: "block",
            fontSize: 20,
          }}
        />
      );
    } else if (action === "downloadButton") {
      return (
        <Tooltip title={tooltip ?? ""}>
          <Button
            size={size ?? "default"}
            type={type ?? "primary"}
            onClick={onClick}
            shape="circle"
            icon={<DownloadOutlined />}
            disabled={disabled}
            loading={loading}
            onMouseEnter={onMouseEnter}
          />
        </Tooltip>
      );
    } else if (action === "printButton") {
      return (
        <Button
          size={size ?? "default"}
          type="primary"
          onClick={onClick}
          shape="circle"
          icon={<PrinterFilled />}
          disabled={disabled}
          loading={loading}
        />
      );
    } else if (action === "addButton") {
      return (
        <Button
          size={size ?? "default"}
          type="primary"
          onClick={onClick}
          shape="circle"
          icon={<PlusOutlined />}
          disabled={disabled}
          loading={loading}
        />
      );
    } else if (action === "refreshButton") {
      return (
        <Button
          size={size ?? "default"}
          type="primary"
          onClick={onClick}
          shape="circle"
          icon={<SyncOutlined />}
          disabled={disabled}
          loading={loading}
        />
      );
    } else if (action === "checkButton") {
      // console.log(size);
      return (
        <Button
          size={size}
          type="primary"
          onClick={onClick}
          shape="circle"
          icon={<CheckOutlined />}
          disabled={disabled}
          loading={loading}
        />
      );
    } else if (action === "closeButton") {
      // console.log(size);
      return (
        <Button
          size={size}
          type="primary"
          onClick={onClick}
          shape="circle"
          icon={<CloseOutlined />}
          disabled={disabled}
          loading={loading}
        />
      );
    } else if (action === "searchButton") {
      // console.log(size);
      return (
        <Button
          size={size}
          type="primary"
          onClick={onClick}
          shape="circle"
          icon={<SearchOutlined />}
          disabled={disabled}
          loading={loading}
        />
      );
    }
  };
  return <Icon />;
  // includes
  // addRow icon
  // removeRow icon
  // download csv button
}
