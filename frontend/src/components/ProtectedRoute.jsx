import React from 'react'
import {useSelector} from 'react-redux'
import Loader from '../components/Loader'
import {Navigate} from 'react-router-dom'
function ProtectedRoute({element,adminOnly=false}) {
    const {isAuthenticated,loading,user}=useSelector(state=>state.user);

    // If we are currently loading user data, show loader
    if(loading){
        return <Loader/>
    }

    // If not authenticated and not loading, redirect to login
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    // If admin access is required, wait for user data to be ready 
    // and check the role. If user exists but is not an admin, redirect home.
    if(adminOnly && user?.role !== 'admin'){
        return <Navigate to="/" replace />
    }

    return element
}

export default ProtectedRoute
