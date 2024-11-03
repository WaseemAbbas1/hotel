import React, { useState } from 'react'
import { Input } from 'antd'
import { Link } from 'react-router-dom'
import {  sendPasswordResetEmail } from 'firebase/auth'
import { auth, } from 'config/firebase'
export default function ForgetPassword() {
const [email,setEmail] =useState("")
const [isLoading,setIsLoading]= useState(false)
  const  handleChange=(e)=>{
    setEmail(e.target.value)
}
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    window.toastify("Please enter your email address.", "error");
    return;
  }

  setIsLoading(true);
  try {
      await sendPasswordResetEmail(auth, email);
      window.toastify("Password reset email sent successfully. Please check your inbox.", "success");
  } catch (error) {
    console.error("Error during password reset:", error);
    window.toastify("Something went wrong. Please try again.", "error");
  } finally {
    setEmail("");
    setIsLoading(false);
  }
};

  return (
    <main>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card" style={{ width: "100%", maxWidth: "450px" }}>
          <div className="card-body py-3">
            <div className="card-title text-center mb-3">
              <h2>Forget Password</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label htmlFor="inputField3">Email</label>
                <Input
                  type="email"
                  id="inputField3"
                  placeholder="Enter Your Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                ></Input>
              </div>
                           
              <div className="row">
                <div className="col-12 col-md-6 offset-md-3 mt-2">
                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-grow spinner-grow-sm"
                          aria-hidden="true"
                        ></span>
                        Wait...
                      </>
                    ) : (
                      "Get Password"
                    )}
                  </button>
                  <div className="text-center mt-3">
                  <span> Go to Sign in Page: </span>
                  <Link to="/auth/" >Sign in</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
