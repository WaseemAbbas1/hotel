import React, { createContext, useContext,  useEffect,  useReducer,  useState } from 'react'
// firebase
import{getDoc,doc} from "firebase/firestore/lite"
import {onAuthStateChanged} from "firebase/auth"
import { auth, firestore } from 'config/firebase';
// context
const AuthContext = createContext()
const initialState = { isAuth: false, user: {}, role :"customer" }
const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET-LOGGED-IN":
            return { ...state, isAuth: true, user: payload.user, role :payload.role };
        case "SET-LOGGED-OUT":
            return initialState;
        default:
            return state; 
    }
};

export default function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isAppLoading, setIsAppLoading] = useState(false)
    const readUserProfile = async (user) => {
        try {
          const docSnap = await getDoc(doc(firestore, 'users', user.uid));
          if (docSnap.exists()) {
            const userData = docSnap.data();
            dispatch({ type: 'SET-LOGGED-IN', payload: { user: userData, role: userData.role } });
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error reading user profile:', error);
        } finally {
          setIsAppLoading(false);         }
      };
    
  useEffect(() => {
      setIsAppLoading(true);  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User found:', user);
        readUserProfile(user);
      } else {
        setIsAppLoading(false);
        dispatch({ type: 'SET-LOGGED-OUT' });
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
    return (
        <AuthContext.Provider value={{ ...state, dispatch, isAppLoading,setIsAppLoading,}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuthContext = () => useContext(AuthContext)