import React from 'react'
import { Route, Routes } from 'react-router-dom'
// components
import Login from "./Login"
import Register from "./Register"
import ForgetPassword from "./ForgetPassword"
import NoPage from "../NoPage"
export default function Auth() {
  return (
    <Routes>
      <Route index element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='forget-password' element={<ForgetPassword/>}/>
      <Route path='*' element={<NoPage/>}/>
    </Routes>
  )
}
