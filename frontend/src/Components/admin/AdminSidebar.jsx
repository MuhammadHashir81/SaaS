import { Menu } from "react-admin";


import React from 'react'

const AdminSidebar = () => {
  return (
    <div>
      <Menu>
    <Menu.DashboardItem  />
    
    <Menu.Item
      to="users"
      primaryText="Users"
    />

    <Menu.Item
      to="products"
      primaryText="Products"
    />

    <Menu.Item
      to="orders"
      primaryText="Orders"
    />
  </Menu>
    </div>
  )
}

export default AdminSidebar
