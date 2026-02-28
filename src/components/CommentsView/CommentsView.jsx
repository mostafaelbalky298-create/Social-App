import React, { useContext } from 'react'
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from '../../Context/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function CommentsView({ comment, postId }) {

  const { userData } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const result = formatDistanceToNow(
    new Date(comment.createdAt)
  )

  async function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`
        }
      }
    )
  }

  const { mutate: deleteMutate, isPending } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {

    queryClient.invalidateQueries(['allPosts'])

    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })

    Toast.fire({
      icon: "success",
      title: "Comment deleted successfully"
    })
  }
  })

  function handleDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutate()
      }
    })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

        .comment-card {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(99, 102, 241, 0.08);
          padding: 16px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          animation: commentFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .comment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.12), 0 4px 8px rgba(0, 0, 0, 0.02);
          border-color: rgba(99, 102, 241, 0.2);
        }

        @keyframes commentFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .comment-container {
          display: flex;
          gap: 12px;
        }

        .comment-avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .comment-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(99, 102, 241, 0.2);
        }

        .comment-avatar-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid white;
        }

        .comment-content {
          flex: 1;
        }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .comment-author {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .comment-time {
          font-size: 11px;
          font-weight: 600;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 30px;
          padding: 3px 10px;
          color: #6366f1;
        }

        .comment-text {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }

        .comment-delete-btn {
          margin-left: auto;
          background: transparent;
          border: none;
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .comment-delete-btn:hover {
          color: #dc2626;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-top: 2px solid #ef4444;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className='comment-card'>
        <div className='comment-container'>

          <div className='comment-avatar-container'>
            <img 
              src={comment.commentCreator.photo} 
              className='comment-avatar' 
              alt={comment.commentCreator.name}
            />
            <div className='comment-avatar-badge'></div>
          </div>

          <div className='comment-content'>
            <div className='comment-header'>
              <p className='comment-author'>
                {comment.commentCreator.name}
              </p>

              <span className='comment-time'>
                {result}
              </span>

              {comment.commentCreator._id === userData?._id && (
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className='comment-delete-btn'
                >
                  {isPending && <span className='spinner'></span>}
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>

            <p className='comment-text'>
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}