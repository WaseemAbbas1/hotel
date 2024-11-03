import React from 'react'
import { useAuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({Component}) {
const {role} = useAuthContext()
   console.log('role', role)
if(role ==="admin"){
   return (
<Component/>
   )
}else{
   return(
<Navigate to="/"/>
   )
}
}
