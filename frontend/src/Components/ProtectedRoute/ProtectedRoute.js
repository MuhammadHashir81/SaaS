import { useEffect } from "react";
import { Children } from "react";
import { useDispatch,useSelector } from "react-redux";

import {Navigate} from 'react-router-dom'
const ProtectedRoute = ({children,loginPath,allowedRoles}) => {
    const dispatch = useDispath()
    const {role, isAuthenticated, checkingAuth} = useSelector((state)=>state.auth)

    useEffect(()=>{
      dispatch(checkingAuth)
    },[])

    if (!isAuthenticated) {
        return <Navigate to={loginPath} replace/>
       
    }
    if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }


  return children;


     
}

export default ProtectedRoute
