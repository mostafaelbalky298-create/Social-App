import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'



export const AuthContext =createContext()

export default function AuthContextProvider({children}) {
  const [token,setToken] = useState(localStorage.getItem('Token'))
  const [userData,setUserData] = useState(null)
  async function getUserData() {
    try{
          const {data} = await axios.get(`https://route-posts.routemisr.com/users/profile-data`,{
            headers:{
              AUTHORIZATION:`Bearer ${localStorage.getItem('Token')}`
            }
          })
          setUserData(data.data.user)
        }catch(err){
          console.log(err);
        }
  }
  useEffect(()=>{
    getUserData();
  },[])

  return <>
  <AuthContext.Provider value={{token,setToken,userData,setUserData}}>
    {children}
  </AuthContext.Provider>
  </>
}
