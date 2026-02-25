import React, { useState } from "react";
import { Layout, Menu, Typography, Button, Divider, ConfigProvider } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { FaUser } from "react-icons/fa6";

import {
  FiHome,
  FiFileText,
  FiGlobe,
  FiPlusCircle,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiLogIn,
  FiChevronLeft,
} from "react-icons/fi";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
   const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");


  const iconStyle = { fontSize: 18 };

  const menuItems = [
    { key: "1", icon: <FiHome style={iconStyle} />, label:<NavLink to='/admin'>Dashboard</NavLink>,  },
    { key: "2", icon: <FiFileText style={iconStyle} />, label: <NavLink to='invoices'>Invoices</NavLink> },
    { key: "3", icon: <FiGlobe style={iconStyle} />, label: "Geographic" },
    { key: "4", icon: <FiPlusCircle style={iconStyle} />, label: "New Invoice" },
    { key: "5", icon: <FiShoppingBag style={iconStyle} />, label: "Products" },
    { key: "6", icon: <FiUsers style={iconStyle} />, label: "Customers" },
    { key: "7", icon: <FiDollarSign style={iconStyle} />, label: "Outflows" },
    { key: "7", icon: <FiDollarSign style={iconStyle} />, label: "Outflows" },
    { key: "7", icon: <FiDollarSign style={iconStyle} />, label: "Outflows" },
    { key: "7", icon: <FiDollarSign style={iconStyle} />, label: "Outflows" },
    { key: "7", icon: <FiDollarSign style={iconStyle} />, label: "Outflows" },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 12,
          fontSize: 14,
        },
        components: {
          Layout: {
            siderBg: "#f5f7fb",
          },
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: "#e8f0fe",
            itemSelectedColor: "#2563eb",
            itemHoverBg: "#eef2ff",
            itemBorderRadius: 10,
            activeBarWidth: 4,
            activeBarBorderWidth: 0,
            activeBarPosition: "end",
            activeBarColor: "#2563eb",

          },
          Button: {
            borderRadius: 10,
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={260}
          collapsedWidth={80}
          collapsed={collapsed}
          style={{
            padding: "16px 12px",
            position: "relative",
          }}
        >
          {/* LOGO */}
          <div className="">
            <div>
              

              {!collapsed && (
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    Greenburg
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12, textAlign:"center" }}>
                    Invoicing System
                  </Text>
                </div>
              )}
            </div>
            <Divider/>
            <div className="flex justify-center gap-3 items-center mb-4">
              <div className="rounded-full bg-linear-to-b from-blue-500 to-blue-300  w-[40px] h-[40px] flex items-center justify-center">

              <FaUser size={15} color="white"/>
              </div>
              <div className="">

              <h4 className="font-primary">admin</h4>
              <h4 className="font-primary">admin@gmail.com</h4>
              </div>

            </div>
          </div>

          {/* MENU */}
          {/* <div style={{ height: "calc(100vh - 220px)", overflowY: "auto" }}> */}

            
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            items={menuItems}
            style={{ border: "none" }}
            />
            {/* </div> */}

          {/* FOOTER */}
          <div >
            <Divider />

            <Button
              type="text"
              icon={<FiChevronLeft size={18} />}
              block
              style={{ textAlign: "left", background: "#eef1f6", marginBottom: 8 }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {!collapsed && "Collapse"}
            </Button>

            <Button
              type="text"
              icon={<FiLogIn size={18} />}
              block
              style={{ textAlign: "left", fontWeight: 500 }}
            >
              {!collapsed && "Login"}
            </Button>

            {!collapsed && (
              <div style={{ marginTop: 16 }}>
                <Divider style={{ margin: "10px 0" }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Made by <span style={{ color: "#2563eb" }}>Keynou</span>
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  v1.0.0
                </Text>
              </div>
            )}
          </div>
        </Sider>

        {/* CONTENT */}
        <Layout>
          <Content style={{ padding: 40, background: "#ffffff" }}>
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;