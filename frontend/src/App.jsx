import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import Invoices from './pages/admin/Invoices';
import NewInvoice from './pages/admin/NewInvoice';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Outflows from './pages/admin/Outflows';
import EditCustomer from './pages/admin/EditCustomer';
import EditProduct from './pages/admin/EditProduct';

const App = () => {
    return (
      <BrowserRouter>
      <Routes>

        {/* admin routes */}
        <Route path='/admin' element={<AdminLayout/>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='invoices' element={<Invoices/> }/>
        <Route path='new-invoice' element={<NewInvoice/> }/>
        <Route path='products' element={<Products/> }/>
        <Route path='customers' element={<Customers/> }/>
        <Route path='outflows' element={<Outflows/> }/>
        <Route path='edit/:id' element={<EditCustomer/> }/>
        <Route path='edit-product/:id' element={<EditProduct/> }/>
        </Route>

        <Route path='/admin-login' element={<AdminLogin/>}/>
      </Routes>
      </BrowserRouter>
 )
}

export default App
