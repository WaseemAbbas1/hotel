import React, { useState } from 'react'
// 
import { firestore } from 'config/firebase'
import { setDoc,doc , serverTimestamp } from 'firebase/firestore/lite'
// 
import {Typography} from "antd"
import { Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
const {Title} = Typography
const initialValue = {imageURL:"", title : "", price :"" ,description:"" }
export default function AddProduct() {
const [formData,setFormData] = useState(initialValue)
const [isLoading,setIsLoading] = useState(false)
const handleChange=(e)=>{
  setFormData({...formData,[e.target.name]:e.target.value})
}
const {title,price,description,imageURL}= formData
const handleSubmit= async(e)=>{
  e.preventDefault();
  if (!title || !price || !description) {
    window.toastify("All fields are required." ,"error")
    return
  }

  setIsLoading(true)
  try {
const data ={
  imageURL,
  title,
  price,
  description,
  id : window.getRendom(),
  dateCreate : serverTimestamp()
}
await setDoc(doc(firestore, "products", data.id), data);
    window.toastify("Product added successfully!", "success")
    setFormData(initialValue) // Reset form fields after successful submission
  } catch (error) {
    console.error("Error adding product:", error)
    window.toastify("Failed to add product. Please try again.","error")
  } finally {
    setIsLoading(false)
  }
}
  return (
    <main>
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: "100%", maxWidth: "550px" }}>
        <div className="card-body py-3">
          <div className="card-title text-center mb-3">
            <Title level={2}>Add Product</Title>
          </div>
          <form onSubmit={handleSubmit}>
          <div className="row mb-2">
              <div className="col">
                <label htmlFor="inputField2">Image URL</label>
                <Input
                  type="text"
                  value={imageURL}
                  id="inputField2"
                  placeholder="Enter You Title "
                  name="imageURL"
                  onChange={handleChange}
                ></Input>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">
                <label htmlFor="inputField2">Title</label>
                <Input
                  type="text"
                  value={title}
                  id="inputField2"
                  placeholder="Enter You Title "
                  name="title"
                  onChange={handleChange}
                ></Input>
              </div>
            </div>
            <div className="form-group mb-2">
              <label htmlFor="inputField3">Price</label>
              <Input
                type="number"
                value={price}
                id="inputField3"
                placeholder="Enter product price"
                name="price"
                onChange={handleChange}
              ></Input>
            </div>
            <div className="form-group mb-2">
              <label htmlFor="inputField4">Description</label>
              <TextArea
                style={{ resize: "none" }}
                rows={8}
                placeholder="Enter product Description"
                id="inputField4"
                value={description}
                name="description"
                onChange={handleChange}
                variant="filled"
                status="warning"
              ></TextArea>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 offset-md-3 mt-2">
                {isLoading ? (
                  <button
                    className="btn btn-dark  w-100"
                    disabled ={isLoading}
                  >
                    <span
                      className="spinner-grow spinner-grow-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-dark btn-outline-light w-100"
                  >
                    Add product
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
  )
}
