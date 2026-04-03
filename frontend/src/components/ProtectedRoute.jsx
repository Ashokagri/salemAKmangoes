import React from 'react'
import {useSelector} from 'react-redux'
import Loader from '../components/Loader'
import {Navigate} from 'react-router-dom'
function ProtectedRoute({element,adminOnly=false}) {
    const {isAuthenticated,loading,user}=useSelector(state=>state.user);
    if(loading){
        return <Loader/>
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    // Wait for user data to be ready before checking roles
    if (!user) {
        return <Loader />
    }

    if(adminOnly && user?.role !== 'admin'){
        return <Navigate to="/" replace />
    }
  return element
}

export default ProtectedRoute
