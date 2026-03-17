import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { FaUser } from "react-icons/fa6";
import {
  FiHome,
  FiFileText,
  FiPlusCircle,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiLogIn,
  FiChevronLeft,
} from "react-icons/fi";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin" },
    { name: "Invoices", icon: <FiFileText />, path: "invoices" },
    { name: "New Invoice", icon: <FiPlusCircle />, path: "new-invoice" },
    { name: "Products", icon: <FiShoppingBag />, path: "products" },
    { name: "Customers", icon: <FiUsers />, path: "customers" },
    { name: "Outflows", icon: <FiDollarSign />, path: "outflows" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside
        className={`bg-gray-50 border-r transition-all max-h-screen  duration-300 flex flex-col
        ${collapsed ? "w-[80px]" : "w-[260px]"}`}
      >
        {/* LOGO */}
        <div className="p-4">
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-lg">Greenburg</h2>
              <p className="text-xs text-gray-500">Invoicing System</p>
            </div>
          )}
        </div>

        <hr className="mb-4" />

        {/* USER */}
        <div className="flex items-center gap-3 px-4 mb-6">
          <div className="rounded-full bg-gradient-to-b from-blue-500 to-blue-300 w-[40px] h-[40px] flex items-center justify-center">
            <FaUser size={15} className="text-white" />
          </div>

          {!collapsed && (
            <div>
              <h4 className="text-sm font-semibold">admin</h4>
              <p className="text-xs text-gray-500">admin@gmail.com</p>
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-indigo-50"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>

              {!collapsed && <span className="text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-3">
          <hr className="mb-3" />

          {/* Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-left mb-2"
          >
            <FiChevronLeft size={18} />
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* Login */}
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 text-left font-medium">
            <FiLogIn size={18} />
            {!collapsed && <span>Login</span>}
          </button>

          {!collapsed && (
            <div className="mt-4 text-xs text-gray-500">
              <hr className="mb-2" />
              <p>
                Made by <span className="text-blue-600">Keynou</span>
              </p>
              <p>v1.0.0</p>
            </div>
          )}
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-5">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;