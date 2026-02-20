import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminLogin from './pages/admin/AdminLogin'
import Admin from './pages/admin/Admin'
const App = () => {
    return (
      <BrowserRouter>
      <Routes>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/admin-login' element={<AdminLogin/>}/>
      </Routes>
      </BrowserRouter>
 )
}

export default App
