import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout/Layout'
import Post from './pages/Post/Post'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Profile from './pages/Profile/Profile'
import AuthGuard from './components/Guards/AuthGuard'
import AuthContextProvider from './Context/AuthContext'
import PostGuard from './components/Guards/PostGuard'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import PostDetails from './pages/PostDetails/PostDetails'









const router = createBrowserRouter([
  {path:'/',element:<Layout/>,children:[
    {index:true,element:<PostGuard><Post/></PostGuard> },
    {path:'login',element:<AuthGuard><Login/></AuthGuard>},
    {path:'register',element:<AuthGuard><Register/></AuthGuard> },
    {path:'profile',element:<PostGuard><Profile/></PostGuard> },
    {path:'details/:id',element:<PostGuard><PostDetails/></PostGuard> },

  ]}
])


const queryClient = new QueryClient()


export default function App() {
  return(
  <>
  <QueryClientProvider client={queryClient}>
   <AuthContextProvider>
    <RouterProvider router={router}/>
   </AuthContextProvider>
  </QueryClientProvider>
  </>
  ) 
}

