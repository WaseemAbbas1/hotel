import React from 'react'
import { Route, Routes } from 'react-router-dom'
// components
import AddProduct from './AddProduct'
import Users from './Users'
import DsProfile from './DsProfile'
import OrderHistory from './OrderHistory'
import NoPage from "../NoPage"
// components
import HeaderDs from 'components/HeaderDs/HeaderDs'
export default function Dashboard() {
  return (<>
    <HeaderDs/>
    <Routes>
      <Route index element={<AddProduct/>}/>
      <Route path='users' element={<Users/>} />
      <Route path='orders' element={<DsProfile/>}/>
      <Route path='order-history' element={<OrderHistory/>}/>
      <Route path='*' element={<NoPage/>}/>
    </Routes>
  </>
  )
}
