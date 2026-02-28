import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import React from 'react'

export default function usePosts(queryKey,endPoint) {

  const {data,isLoading,isFetching,isFetched,isError} = useQuery({
    queryFn:getPosts,
    queryKey:[...queryKey]
  })

  async function getPosts() {
    try{
      const {data} = await axios.get(`https://route-posts.routemisr.com/${endPoint}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('Token')}`
        }
      })
      return data
    }catch(err){
      console.log(err);
      return err
    } 
    }

    return {data,isLoading,isFetching,isFetched,isError}

}
