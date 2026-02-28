import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PostGuard({children}) {
    if(localStorage.getItem('Token')==null){
    return <Navigate to={'/login'} />
  }else{
   return children
  }
   
} 
