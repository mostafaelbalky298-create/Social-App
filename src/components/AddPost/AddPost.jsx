import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

export default function AddPost() {
  const { userData } = useContext(AuthContext)
  const queryClient = useQueryClient()
  
  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2 rounded-xl shadow-md transition-all duration-300 font-semibold",
    },
    buttonsStyling: false
  })

  const { mutate, isPending } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
  queryClient.invalidateQueries(['allPosts'])

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#ffffff",
    color: "#0f172a",
    didOpen: (toast) => {
      toast.style.borderRadius = "12px"
      toast.style.boxShadow = "0 10px 25px rgba(99,102,241,0.15)"
      toast.style.border = "1px solid rgba(99,102,241,0.15)"
    }
    
  })

  Toast.fire({
    icon: "success",
    title: "Post added successfully 🚀"
  })
  reset()
},
    onError: () => {
      swalWithTailwindButtons.fire({
        title: "Error!",
        text: "Failed to add post.",
        icon: "error"
      })
    }
  })

  const { handleSubmit, register, reset, watch,setValue  } = useForm({
    defaultValues: {
      body: '',
      image: null
    }
  })

  // Watch body length for character counter
  const bodyValue = watch('body', '')
  const imageFile = watch('image')

  async function addPost(values) {
    const formData = new FormData()
    if (values.body) {
      formData.append('body', values.body)
    }
    if (values.image && values.image.length > 0) {
      formData.append('image', values.image[0])
    }
    const response = await axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('Token')}`
      }
    })
    return response
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

        .addpost-form {
          font-family: 'Inter', sans-serif;
          animation: postFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes postFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .addpost-container {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.08);
          box-shadow: 0 2px 20px rgba(99, 102, 241, 0.07), 0 1px 4px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .addpost-container:hover {
          box-shadow: 0 20px 30px rgba(99, 102, 241, 0.15), 0 4px 8px rgba(0, 0, 0, 0.05);
          border-color: rgba(99, 102, 241, 0.2);
        }

        /* Header Section */
        .addpost-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 20px 24px 12px;
        }

        .addpost-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .addpost-avatar img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(99, 102, 241, 0.2);
        }

        .addpost-avatar::after {
          content: '';
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid white;
        }

        .addpost-user-info {
          flex: 1;
        }

        .addpost-user-name {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        /* Privacy Selector */
        .addpost-privacy {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 20px;
          padding: 4px 10px;
        }

        .addpost-privacy svg {
          width: 14px;
          height: 14px;
          color: #6366f1;
        }

        .addpost-privacy select {
          background: transparent;
          border: none;
          outline: none;
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          cursor: pointer;
          padding: 0 4px;
        }

        .addpost-privacy select option {
          color: #0f172a;
          background: white;
        }

        /* Textarea */
        .addpost-textarea-wrapper {
          position: relative;
          padding: 0 24px;
        }

        .addpost-textarea {
          width: 100%;
          border: 1px solid rgba(99, 102, 241, 0.08);
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          font-size: 16px;
          line-height: 1.6;
          color: #1e293b;
          resize: none;
          transition: all 0.2s ease;
        }

        .addpost-textarea:focus {
          outline: none;
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .addpost-textarea::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .addpost-char-counter {
          position: absolute;
          bottom: 12px;
          right: 40px;
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          background: white;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid rgba(99, 102, 241, 0.08);
        }

        /* Toolbar */
        .addpost-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px 20px;
          border-top: 1px solid rgba(99, 102, 241, 0.08);
          margin-top: 12px;
        }

        .addpost-actions-left {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .addpost-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          background: transparent;
        }

        .addpost-action-btn:hover {
          background: rgba(99, 102, 241, 0.08);
          color: #6366f1;
        }

        .addpost-action-btn.image-btn:hover {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
        }

        .addpost-action-btn.image-btn:hover svg {
          stroke: #10b981;
        }

        .addpost-action-btn.feeling-btn:hover {
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
        }

        .addpost-action-btn.feeling-btn:hover svg {
          stroke: #f59e0b;
        }

        .addpost-action-btn svg {
          width: 18px;
          height: 18px;
          transition: stroke 0.2s ease;
        }

        .addpost-action-btn.image-btn svg {
          stroke: #10b981;
        }

        .addpost-action-btn.feeling-btn svg {
          stroke: #f59e0b;
        }

        .addpost-action-btn span {
          display: none;
        }

        @media (min-width: 640px) {
          .addpost-action-btn span {
            display: inline;
          }
        }

        /* Submit Button */
        .addpost-submit {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border: none;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          color: white;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }

        .addpost-submit:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 8px 15px rgba(99, 102, 241, 0.4);
        }

        .addpost-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .addpost-submit svg {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }

        .addpost-submit:hover:not(:disabled) svg:not(.spinner) {
          transform: translateX(4px);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Image Preview */
        .addpost-preview {
          padding: 0 24px 20px;
        }

        .addpost-preview-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(99, 102, 241, 0.08);
          background: #f8fafc;
        }

        .addpost-preview-container img {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
        }

        .addpost-preview-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 1px solid rgba(99, 102, 241, 0.15);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .addpost-preview-remove:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
        }

        .addpost-preview-remove svg {
          width: 16px;
          height: 16px;
        }

        /* File input hidden */
        .hidden {
          display: none;
        }
      `}</style>

      <form onSubmit={handleSubmit(mutate)} className="addpost-form container pt-4 mt-5">
        <div className="addpost-container">
          
          {/* Header with user info */}
          <div className="addpost-header">
            <div className="addpost-avatar">
              <img src={userData?.photo} alt={userData?.name} />
            </div>
            
            <div className="addpost-user-info">
              <h4 className="addpost-user-name">{userData?.name}</h4>
              
              {/* Privacy selector */}
              <div className="addpost-privacy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                  <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
                  <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
                  <circle cx={12} cy={12} r={10} />
                </svg>
                
                <select className="bg-transparent outline-none">
                  <option value="public">Public</option>
                  <option value="following">Followers</option>
                  <option value="only_me">Only me</option>
                </select>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="addpost-textarea-wrapper">
            <textarea
              {...register('body')}
              rows={4}
              placeholder="What's on your mind?"
              className="addpost-textarea"
            />
            <div className="addpost-char-counter">
              {bodyValue?.length || 0}/500
            </div>
          </div>

          {/* Image Preview */}
          {imageFile && imageFile.length > 0 && (
            <div className="addpost-preview">
              <div className="addpost-preview-container">
                <img 
                  src={URL.createObjectURL(imageFile[0])} 
                  alt="Preview" 
                />
                <button 
                  type="button"
                  onClick={() => setValue('image', null)}
                  className="addpost-preview-remove"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="addpost-toolbar">
            <div className="addpost-actions-left">
              {/* Image upload button */}
              <label className="addpost-action-btn image-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
                  <circle cx={9} cy={9} r={2} />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span>Photo/video</span>
                <input 
                  {...register('image')} 
                  accept="image/*" 
                  type="file" 
                  className="hidden"
                />
              </label>

              {/* Feeling button */}
              <button type="button" className="addpost-action-btn feeling-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx={12} cy={12} r={10} />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1={9} x2="9.01" y1={9} y2={9} />
                  <line x1={15} x2="15.01" y1={9} y2={9} />
                </svg>
                <span>Feeling/activity</span>
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              className="addpost-submit"
            >
              {isPending ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                      <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <span>Post</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                    <path d="m21.854 2.147-10.94 10.939" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}