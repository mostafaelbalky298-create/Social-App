import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Button, Card, Textarea } from 'flowbite-react'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { AuthContext } from '../../Context/AuthContext'

export default function AddComment({postId}) {
    const {userData} = useContext(AuthContext)
    

   const {register,handleSubmit,reset,watch} = useForm({
    defaultValues:{
        content:''
    }
   })
   const swalWithTailwindButtons = Swal.mixin({
     customClass: {
       confirmButton:
         "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2 rounded-xl shadow-md transition-all duration-300",
     },
     buttonsStyling: false
   });
   const queryClient = useQueryClient()
   const { mutate, isPending } = useMutation({
  mutationFn: addComment,
  onSuccess: () => {
    queryClient.invalidateQueries(['postComments',postId])

    const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#ffffff",
    color: "#0f172a",
    didOpen: (toast) => {
      toast.style.borderRadius = "12px"
      toast.style.boxShadow = "0 10px 25px rgba(34,197,94,0.15)"
      toast.style.border = "1px solid rgba(34,197,94,0.2)"
    }
  })

  Toast.fire({
    icon: "success",
    title: "Comment added successfully 💬"
  })
    reset()
  },
  onError: () => {
    swalWithTailwindButtons.fire({
      title: "Error!",
      text: "Failed to add post.",
      icon: "error",
    })
  }
})

   async function addComment(values){
    console.log(values);
    try{
        const objSend ={
            content:values.content,
        }
        const {data} = await axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`,objSend,{
        headers:{
          AUTHORIZATION:`Bearer ${localStorage.getItem('Token')}`
        }
      })
        console.log(data,'adddddddddddddd');   
    }catch(err){
        console.log(err);
    }
   }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

        .addcomment-form {
          font-family: 'Inter', sans-serif;
          width: 100%;
          animation: commentFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes commentFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .addcomment-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Avatar Section */
        .addcomment-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .addcomment-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(99, 102, 241, 0.2);
          transition: all 0.2s ease;
        }

        .addcomment-avatar-badge {
          position: absolute;
          bottom: 0px;
          right: 0px;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* Input Section */
        .addcomment-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .addcomment-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid rgba(99, 102, 241, 0.08);
          border-radius: 40px;
          padding: 10px 16px;
          font-size: 14px;
          color: #1e293b;
          resize: none;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .addcomment-input:focus {
          outline: none;
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .addcomment-input::placeholder {
          color: #94a3b8;
        }

        /* Submit Button */
        .addcomment-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 20px;
          border: none;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          color: white;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
          min-width: 80px;
          height: 40px;
        }

        .addcomment-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
        }

        .addcomment-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: linear-gradient(135deg, #cbd5e1, #94a3b8);
        }

        .addcomment-submit svg {
          width: 16px;
          height: 16px;
        }

        .addcomment-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Enter key hint (optional) */
        .addcomment-enter-hint {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: #94a3b8;
          background: white;
          padding: 2px 6px;
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.1);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .addcomment-input-wrapper:hover .addcomment-enter-hint,
        .addcomment-input:focus ~ .addcomment-enter-hint {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .addcomment-submit {
            padding: 8px 16px;
            min-width: 70px;
            font-size: 12px;
          }
          
          .addcomment-avatar img {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit(mutate)} className='addcomment-form'>
        <div className='addcomment-container'>
          
          {/* User Avatar */}
          <div className='addcomment-avatar'>
            <img 
              src={userData?.photo} 
              alt={userData?.name}
            />
            <div className='addcomment-avatar-badge'></div>
          </div>
          
          {/* Input Field */}
          <div className='addcomment-input-wrapper'>
            <textarea
              {...register('content')} 
              placeholder="Write a comment..." 
              rows={1}
              className='addcomment-input'
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (watch('content') && !isPending) {
                    handleSubmit(mutate)();
                  }
                }
              }}
            />
            <span className='addcomment-enter-hint'>⏎ Enter</span>
          </div>
          
          {/* Submit Button */}
          <button
            type='submit'
            disabled={!watch('content') || isPending}
            className='addcomment-submit'
          >
            {isPending ? (
              <>
                <svg className='addcomment-spinner' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                    <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <span>...</span>
              </>
            ) : (
              <span>Post</span>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
