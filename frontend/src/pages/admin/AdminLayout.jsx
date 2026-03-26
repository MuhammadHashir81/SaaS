import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


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
import { MdOutlineLogin } from "react-icons/md";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "dashboard" },
    { name: "Invoices", icon: <FiFileText />, path: "invoices" },
    { name: "New Invoice", icon: <FiPlusCircle />, path: "new-invoice" },
    { name: "Products", icon: <FiShoppingBag />, path: "products" },
    { name: "Customers", icon: <FiUsers />, path: "customers" },
    { name: "Outflows", icon: <FiDollarSign />, path: "outflows" },
  ];

  const handleToggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)

  }
  return (
    <div className=" flex min-h-screen bg-gray-100 ">

      {/* SIDEBAR */}
      <aside className={ ` overflow-hidden  ${ isCollapsed ? 'w-[80px]' : 'w-[300px]'  } h-screen sticky top-0  bg-white `}>
        <div className="flex items-center justify-center my-6 ">

          <h4 className="font-primary font-bold text-xl">
            {
              isCollapsed ? 'G' : 'Greenburg'
            }
            </h4>
        </div>
        <hr className="text-gray-100" />
        <div className="px-5 py-4 h-full flex flex-col space-y-3 font-secondary text-gray-500">
          {
            menuItems.map((item, index) => (
              <div className={` `}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ?
                      'flex items-center gap-2 h-fit bg-gradient-to-r from-blue-200 to-blue-100 border-r-4 border-blue-600 px-4 py-3 rounded-lg cursor-pointer text-blue-500'
                      :
                      'flex items-center gap-2 h-fit px-4  py-3 rounded-lg cursor-pointer hover:bg-gray-100 '
                  }
                >
                  <p>{item.icon}</p>
                  <p className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</p>
                </NavLink>

              </div>

            ))
          }
          {
            isCollapsed ? (
              <button 
              className="px-4 py-3 flex justify-center cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100"

              onClick={handleToggleCollapsed}
              >
              <FaChevronRight/>
              </button>

            ):(
              
              <button
              className="flex bg-gray-50 hover:bg-gray-100 cursor-pointer px-4 py-3 rounded-lg justify-center items-center gap-1"
              onClick={handleToggleCollapsed}
              >
                <span><FaChevronLeft/></span> collapse
                </button>
            )
          }


          <button className="flex items-center gap-2.5 self-start text-blue-500 cursor-pointer hover:bg-blue-50 w-full transition-all duration-100 ease-in  px-2 rounded-lg "> 
            <span>
              <MdOutlineLogin/>
            </span>  
            {
              isCollapsed ? <MdOutlineLogin/> : 'Login' 
            }
              </button>
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