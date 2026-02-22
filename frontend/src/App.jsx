import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import { Admin, Resource } from "react-admin";

import AdminApp from './pages/admin/AdminApp';

const App = () => {
    return (
      <BrowserRouter>
      <Routes>
        {/* admin routes */}
        <Route path='/admin/*' element={<AdminApp/>}/>
        <Route path='/admin-login' element={<AdminLogin/>}/>
      </Routes>
      </BrowserRouter>
 )
}

export default App
