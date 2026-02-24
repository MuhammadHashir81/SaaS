import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import Invoices from './pages/admin/Invoices';

const App = () => {
    return (
      <BrowserRouter>
      <Routes>

        {/* admin routes */}
        <Route path='/admin' element={<AdminLayout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='invoices' element={<Invoices/> }/>
        </Route>

        <Route path='/admin-login' element={<AdminLogin/>}/>
      </Routes>
      </BrowserRouter>
 )
}

export default App
