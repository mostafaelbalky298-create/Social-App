import React, { useContext, useState } from 'react'
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from "sweetalert2";

export default function PostCard({post, setIsOpen, setPostId}) {
  
    const {userData} = useContext(AuthContext)
    const result = formatDistanceToNow(new Date(post.createdAt))

    function handleClickComment(){
        setIsOpen(true)
        setPostId(post.id)
    }

    const queryClient = useQueryClient()
    
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-xl transition ml-2",
            cancelButton:  "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-xl transition"
        },
        buttonsStyling: false
    });

    const { mutate: deleteMutation } = useMutation({
        mutationFn: DeletePost,
        onSuccess: () => {
    queryClient.invalidateQueries(['allPosts'])
    queryClient.invalidateQueries(['UserPosts'])
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
        toast.style.boxShadow = "0 10px 25px rgba(239,68,68,0.15)"
        toast.style.border = "1px solid rgba(239,68,68,0.2)"
      }
    })

    Toast.fire({
      icon: "success",
      title: "Post deleted successfully 🗑️"
    })
  },
        onError: () => {
            swalWithBootstrapButtons.fire({
                title: "Error!",
                text: "Something went wrong.",
                icon: "error"
            })
        }
    })

    function handleDelete() {
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation()   
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your post is safe 🙂",
                    icon: "error"
                })
            }
        });
    }

    async function DeletePost() {
        const response = await axios.delete(
            `https://route-posts.routemisr.com/posts/${post.id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('Token')}` 
                }
            }
        )
        return response.data
    }

    const [localLikes, setLocalLikes] = useState(post.likes);
    const isLiked = localLikes.includes(userData?._id);

    const likeMutation = useMutation({
        mutationFn: async () => {
            return axios.put(
                `https://route-posts.routemisr.com/posts/${post.id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allPosts"]);
        },
    });

    const handleLike = () => {
        const userId = userData._id;
        if (isLiked) {
            setLocalLikes(localLikes.filter(id => id !== userId));
        } else {
            setLocalLikes([...localLikes, userId]);
        }
        likeMutation.mutate();
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

                .post-card {
                    font-family: 'Inter', sans-serif;
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid rgba(99, 102, 241, 0.08);
                    box-shadow: 0 2px 20px rgba(99, 102, 241, 0.07), 0 1px 4px rgba(0, 0, 0, 0.04);
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    animation: postCardFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                    position: relative;
                    backdrop-filter: blur(0);
                }

                .post-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 30px rgba(99, 102, 241, 0.15), 0 4px 8px rgba(0, 0, 0, 0.05);
                    border-color: rgba(99, 102, 241, 0.2);
                }

                @keyframes postCardFadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Card Header */
                .post-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(99, 102, 241, 0.08);
                }

                .post-card-user {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .post-card-avatar {
                    position: relative;
                }

                .post-card-avatar img {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid rgba(99, 102, 241, 0.2);
                    transition: all 0.3s ease;
                }

                .post-card:hover .post-card-avatar img {
                    border-color: rgba(236, 72, 153, 0.3);
                }

                .post-card-avatar::after {
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

                .post-card-user-info h4 {
                    font-family: 'Sora', sans-serif;
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 4px 0;
                }

                .post-card-time {
                    font-size: 12px;
                    font-weight: 500;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .post-card-time span {
                    background: rgba(99, 102, 241, 0.08);
                    padding: 2px 8px;
                    border-radius: 12px;
                    color: #6366f1;
                    font-size: 11px;
                    font-weight: 600;
                }

                /* Delete Button */
                .post-card-delete {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    border: none;
                    border-radius: 12px;
                    padding: 8px 16px;
                    color: white;
                    font-size: 13px;
                    font-weight: 600;
                    font-family: 'Sora', sans-serif;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
                }

                .post-card-delete:hover {
                    background: linear-gradient(135deg, #dc2626, #b91c1c);
                    transform: scale(1.05);
                    box-shadow: 0 8px 15px rgba(239, 68, 68, 0.3);
                }

                .post-card-delete svg {
                    width: 16px;
                    height: 16px;
                }

                /* Post Body */
                .post-card-body {
                    padding: 20px 24px;
                }

                .post-card-body p {
                    font-size: 18px;
                    line-height: 1.6;
                    color: #1e293b;
                    margin-bottom: 20px;
                    font-weight: 400;
                }

                .post-card-image {
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(99, 102, 241, 0.08);
                    background: #f8fafc;
                }

                .post-card-image img {
                    width: 100%;
                    max-height: 400px;
                    object-fit: contain;
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .post-card-image:hover img {
                    transform: scale(1.02);
                }

                /* Footer / Actions */
                .post-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 24px;
                    border-top: 1px solid rgba(99, 102, 241, 0.08);
                    background: rgba(248, 250, 252, 0.5);
                }

                .post-card-action {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 20px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #64748b;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                }

                .post-card-action.like-button {
                    color: #64748b;
                }

                .post-card-action.like-button.liked {
                    color: #6366f1;
                }

                .post-card-action.like-button.liked svg {
                    fill: #6366f1;
                    stroke: #6366f1;
                }

                .post-card-action:hover {
                    background: rgba(99, 102, 241, 0.08);
                    color: #6366f1;
                    transform: translateY(-2px);
                }

                .post-card-action svg {
                    width: 22px;
                    height: 22px;
                    transition: all 0.2s ease;
                }

                .post-card-action:hover svg {
                    stroke: #6366f1;
                }

                .post-card-action.comment:hover svg {
                    stroke: #10b981;
                }

                .post-card-action.comment:hover {
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.08);
                }

                .post-card-action.details:hover svg {
                    stroke: #ec4899;
                }

                .post-card-action.details:hover {
                    color: #ec4899;
                    background: rgba(236, 72, 153, 0.08);
                }

                .post-card-action span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .post-card-action .count {
                    font-weight: 700;
                    color: inherit;
                }

                /* Disabled state */
                .post-card-action:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Responsive */
                @media (max-width: 640px) {
                    .post-card-header {
                        padding: 16px;
                    }
                    
                    .post-card-body {
                        padding: 16px;
                    }
                    
                    .post-card-footer {
                        padding: 12px 16px;
                    }
                    
                    .post-card-action {
                        padding: 6px 12px;
                        font-size: 12px;
                    }
                    
                    .post-card-action svg {
                        width: 18px;
                        height: 18px;
                    }
                    
                    .post-card-delete {
                        padding: 6px 12px;
                        font-size: 12px;
                    }
                }
            `}</style>

            <div className='container my-3'>
                <div className="post-card">
                    {/* Header */}
                    <div className="post-card-header">
                        <div className="post-card-user">
                            <div className="post-card-avatar">
                                <img src={post.user.photo} alt={post.user.name} />
                            </div>
                            <div className="post-card-user-info">
                                <h4>{post.user.name}</h4>
                                <div className="post-card-time">
                                    <span>{result}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delete Button - فقط إذا كان المستخدم هو صاحب البوست */}
                        {post.user._id === userData?._id && (
                            <button onClick={handleDelete} className="post-card-delete">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Post Body */}
                    <div className="post-card-body">
                        <p>{post.body}</p>
                        
                        {post.image && (
                            <div className="post-card-image">
                                <img src={post.image} alt="post" />
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="post-card-footer">
                        <button
                            onClick={handleLike}
                            disabled={likeMutation.isPending}
                            className={`post-card-action like-button ${isLiked ? 'liked' : ''}`}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>
                                <span className="count">{localLikes.length}</span> Like
                            </span>
                        </button>

                        <button onClick={handleClickComment} className="post-card-action comment">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>
                                <span className="count">{post.commentsCount}</span> Comment
                            </span>
                        </button>

                        <Link to={`/details/${post.id}`} style={{ textDecoration: 'none' }}>
                            <button className="post-card-action details">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Details</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}