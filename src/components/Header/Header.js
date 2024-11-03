import React from 'react'
// firebase 
import {signOut } from "firebase/auth";
import { auth } from 'config/firebase';
// context

import { useAuthContext } from 'context/AuthContext'
// navigate
import {Link} from "react-router-dom"

export default function Header() {
 const {isAuth ,role,dispatch}=useAuthContext()
 const handleSignOut= ()=>{
  signOut(auth).then(() => {
window.toastify("Sign out successfully" ,"success")
  dispatch("SET-LOGGED-OUT")
}).catch((error) => {
  console.log('error', error)
    window.toastify("Any problem ouccer during Sign out " ,"error")
  });
}
  return (
   
    <header>
    <nav className="navbar navbar-expand-lg ">
    <div className="container">
      <Link to ="/" className="navbar-brand bg-transparent border-0" >Logo</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav m-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="/" className="nav-link  bg-transparent border-0" aria-current="page" >Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link bg-transparent border-0" >About</Link>
          </li>
          <li className="nav-item">
            <Link to='/contact' className="nav-link bg-transparent border-0" >Contact</Link>
          </li>
               
          <li className="nav-item">
            <Link to='/cart' className="nav-link bg-transparent border-0" >Cart</Link>
          </li>
               
          <li className="nav-item">
            <Link to='/wishlist' className="nav-link bg-transparent border-0" >wishlist</Link>
          </li>
               
        </ul>
        <div>
            {
              isAuth?<>
            <div className="d-flex" >
              {role ==="admin"?
              <>
              <Link to="/dashboard/" className="btn btn-outline-success me-2" >Dashboard</Link>
              <button onClick={handleSignOut} className="btn btn-outline-danger" >Sign out</button>
              </>
            :<>
            <Link to="/profile" className="btn btn-outline-success me-2" >profile</Link>
            <button onClick={handleSignOut} className="btn btn-outline-danger" >Sign out</button>
            </>}          
            </div>
            </>:<>
            <div className="d-flex d-flex justify-content-center align-items-center" >
              <span className='text-danger me-2'>
                kindly Sign in:
              </span>
              <Link to="/auth/" className="btn btn-outline-success" >Sign in</Link>
            </div>
            </>
            }
        </div>
        

       </div>
    </div>
  </nav>
  </header>
  )
}
