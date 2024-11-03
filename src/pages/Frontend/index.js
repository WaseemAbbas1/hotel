import React from "react";
import { Route, Routes } from "react-router-dom";
// pages
import Products from "./Products";
import UserProfile from "./UserProfile";
import NoPage from "../NoPage";
// components
import Header from "components/Header";
import Footer from "components/Footer";
import WishList from "./WishList";
import Cart from "./Cart";
export default function Frontend() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<Products />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/wishlist" element ={<WishList/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
