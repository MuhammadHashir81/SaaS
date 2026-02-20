import React from 'react'
import { FaLock } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { NavLink } from 'react-router-dom';

const Admin = () => {

  return (
    <div className='login flex items-center justify-center h-screen'>
        <div className='flex flex-col items-center justify-center gap-4 bg-white shadow-2xl w-[450px] h-[350px] rounded-2xl '>
            <div className='bg-gradient-to-b from-blue-500 to-blue-300   text-white w-[70px] flex items-center
             justify-center h-[70px] rounded-full'>

            <FaLock size={30}/>
            </div>
            <h2 className=' font-bold text-2xl'>Welcome to Greenburg</h2>
            <p className=''>Please log in to access the invoicing system.</p>
            <div className=''>
            <NavLink to='/admin-login' className=' bg-gradient-to-r from-blue-600 to-blue-400 font-semibold  text-white flex items-center justify-center gap-2 h-[50px] w-[400px] rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 cursor-pointer'> <span><FiLogIn className=''/></span> Login to Continue</NavLink>
            <p className='text-center mt-2'>Need access? Contact your administrator.</p>
            </div>
        </div>

      
    </div>
    
  )
}

export default Admin
