import React,{useState} from 'react'
// firebase
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, firestore } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore/lite'
// antd
import { Input } from 'antd'
// context
import { useAuthContext } from '../../context/AuthContext'
// navigate
import { Link, useNavigate } from 'react-router-dom'
const initialValue = {email : "", password :""}

export default function Login() {
  const {dispatch} = useAuthContext()
  const [isLoading,setIsLoading] = useState(false)
  const [state ,setState ] = useState(initialValue)
  const {email,password} = state
  const handleChange = (e)=>{
setState((s)=>{return{...s, [e.target.name]: e.target.value}}) 
}
const navigate = useNavigate()
const getUserData = async(user)=>{
try{
  const docSnap = await getDoc(doc(firestore, "users", user.uid));
  if (docSnap.exists()) {
    let userData = docSnap.data()
    dispatch({type:"SET-LOGGED-IN",payload :{user:userData,role: userData.role}})
    navigate("/")
    window.toastify("Sign in successfully", "success");
  } else{
    window.toastify("User data not found. Please try again.","error")
  }
}
    catch (error) {
      window.toastify("Error fetching user data:", "error");
    } finally {
      setIsLoading(false);
       setState(initialValue)
}
}
const handleSubmit = async(e) => {
  e.preventDefault()
  if (!email || !password) {
    window.toastify("Please fill in all fields.","error");
    return;
  }  
try {
setIsLoading(true)
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;
getUserData(user)
} catch (error) {
  console.log('error.message', error.code)
  switch (error.code) {
    case "auth/invalid-credential": window.toastify("Something went wrong check you email and password", "error"); break;
    default: window.toastify("Something went wrong while sign in please try again", "error"); break;
  }
  setIsLoading(false)
  setState(initialValue)
}
};
  
  return (
     <main >
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card" style={{ width: "100%", maxWidth: "450px" }}>
          <div className="card-body py-3">
            <div className="card-title text-center mb-3">
              <h2>Login</h2>
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
              <div className="form-group mb-2">
                <label htmlFor="inputField4">Password</label>
                <Input.Password 
                type='password'
                  placeholder="Enter Your Password"
                 id="inputField4"
                 name="password"
                 value={password}                       
                 onChange={handleChange}
                ></Input.Password>
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
                  "Login"
                )}
              </button>
              <div className="text-center mt-3">
                  <span>I have No Account : </span>
                  <Link to="/auth/register" >Sign up</Link>
                  </div>
                  
                </div>
                <div className="text-center mt-2">
                  <span>Get password : </span>
                  <Link to="/auth/forget-password" >Forget Password</Link>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  
  )
}
