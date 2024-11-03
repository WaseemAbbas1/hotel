import React, { useState } from "react";
// database
import { auth, firestore } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore/lite";
// antd
import { Input } from "antd";
// context
import { useAuthContext } from "../../context/AuthContext";
// navigate
import { Link, useNavigate } from "react-router-dom";
const initialValue = { firstName: "", lastName: "", email: "", password: "" };
export default function Register() {
  const {dispatch}= useAuthContext()
  const [formData, setFormData] = useState(initialValue);
  const [role, setRole] = useState("admin")
  const [isLoading, setIsLoading] = useState(false);
  const { firstName, password, email, lastName } = formData;
  const navigate = useNavigate()
  const handleChangeRole= e=>{
    setRole(e.target.value)
    }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const storeUser = async (user) => {
    const userData = {
      firstName,
      lastName,
      email,
      role,
      uid: user.uid,
      dateCreated: serverTimestamp(),
      status: "active",
      wishlist: [], 
      cartItems: [], 
      orderHistory: []
    };
    try {
      await setDoc(doc(firestore, "users", user.uid), userData);
      window.toastify("User registered successfully in auth","success")
    } catch (e) {
      console.log("error", e);
      setFormData(initialValue)
      setIsLoading(false)
    } finally {
      dispatch({type:"SET-LOGGED-IN",payload :{user:userData,role}})
      setIsLoading(false)
      setFormData(initialValue);
      navigate("/")
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName.length < 3) { return window.toastify("Please enter your first name", "error") }
    if (!window.isEmail(email)) { return window.toastify("Please enter a valid email address", "error") }
    if (password.length < 6) { return window.toastify("Password must be atleast 6 chars.", "error") }
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email,  password);
      const user = userCredential.user;
      await storeUser(user);
    } catch (error) {
      switch (error.code) {
          case "auth/email-already-in-use":
              window.toastify("Email address already in use", "error"); break;
          default: window.toastify("Something went wrong while creating a new user", "error"); break;
      } 
      setIsLoading(false)
      setFormData(initialValue)
       
    }
 
    
  };

  return (
    <main>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card" style={{ width: "100%", maxWidth: "550px" }}>
          <div className="card-body py-3">
            <div className="card-title text-center mb-3">
              <h2>Register</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mb-2">
                <div className="col-12 col-md-6">
                  <label htmlFor="inputField1">First Name</label>
                  <Input
                    type="text"
                    id="inputField1"
                    placeholder="Enter your First Name"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                  ></Input>
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="inputField2">Last Name</label>
                  <Input
                    type="text"
                    id="inputField2"
                    placeholder="Enter your Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                  ></Input>
                </div>
              </div>
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
              <div className="form-group mb-2">
                <label htmlFor="inputField4">Password</label>
                <Input.Password
                  type="password"
                  placeholder="Enter Your Password"
                  id="inputField4"
                  name="password"
                  onChange={handleChange}
                  value={password}
                ></Input.Password>
              </div>
              <div className="row">
                <div className="col">
                <p className="d-inline-block fw-bold me-4">Role:</p>
                <div className="form-check form-check-inline">
                <label className="form-check-label" htmlFor="admin">Admin</label>
              <input
                className="form-check-input"
                type="radio"
                name="admin"
                id="admin"
                value="admin"
                onChange={handleChangeRole}
                checked= {role ==='admin'}
              />
              
            </div>
            <div className="form-check form-check-inline">
            <label className="form-check-label" htmlFor="customer">customer </label>
              <input
                className="form-check-input"
                type="radio"
                name="customer"
                id="customer"
                value="customer"
                onChange={handleChangeRole}
                checked={role==='customer'}
              />
                    </div>
                </div>
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
                      "Register"
                    )}
                  </button>
                  <div className="text-center mt-3">
                  <span>Already register : </span>
                  <Link to="/auth/" >Sign in</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
