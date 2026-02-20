import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
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
