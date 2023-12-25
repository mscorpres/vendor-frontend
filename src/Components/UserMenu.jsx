import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { Avatar } from "antd";
import { Link } from "react-router-dom";

export default function UserMenu({ user, logoutHandler }) {
  const menu = (
    <Menu
      items={[
        {
          key: "2",
          label: (
            <span
              style={{ width: "100%", display: "block" }}
              onClick={logoutHandler}
            >
              Logout
            </span>
          ),
        },
      ]}
    />
  );
  return (
    <Dropdown
      overlay={menu}
      placement="bottom"
      style={{ height: "40%" }}
      trigger={["click"]}
    >
      {/* <a onClick={(e) => e.preventDefault()}> */}
      <Space
        style={{
          color: "white",
          cursor: "pointer",
        }}
        size="small"
        className="user-div"
      >
        {/* <div > */}
        <Avatar
          style={{ marginBottom: 5, backgroundColor: "#87d068" }}
          size={30}
        >
          {user?.userName && user?.userName[0]?.toUpperCase()}
        </Avatar>
        <span>{user.userName?.split(" ")[0]}</span>
        {/* </div> */}
        <DownOutlined />
      </Space>
      {/* </a> */}
    </Dropdown>
  );
}
