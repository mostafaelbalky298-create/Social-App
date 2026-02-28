import React, { useEffect } from 'react'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import CommentsView from '../CommentsView/CommentsView';
import AddComment from '../AddComment/AddComment';

export default function CommentsCard({isOpen,setIsOpen,handleClose,postId}) {
  
const {data,isLoading,isFetching,isFetched,isError} = useQuery({
    queryFn:getPostComments,
    queryKey:['postComments',postId],
    enabled:Boolean(postId)
  })

async function getPostComments(){
    try{
        const {data} = await axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('Token')}` 
      }
    })
    console.log(data);
    
    return data.data.comments
    }catch(err){
        console.log(err);
    }  
}

if (!isOpen) return null;

return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

      /* Modal Overlay */
      .comments-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 16px;
        animation: overlayFadeIn 0.3s ease;
      }

      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Modal Container - نفس تصميم الكارد */
      .comments-modal {
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid rgba(99, 102, 241, 0.08);
        box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        animation: modalFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }

      @keyframes modalFadeUp {
        from { 
          opacity: 0; 
          transform: translateY(20px) scale(0.98); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }

      /* Header - نفس تصميم صفحة البوستات */
      .comments-header {
        padding: 20px 24px;
        border-bottom: 1px solid rgba(99, 102, 241, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
      }

      .comments-title {
        font-family: 'Sora', sans-serif;
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .comments-title span {
        background: linear-gradient(135deg, #6366f1, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .comments-count {
        background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08));
        border: 1px solid rgba(99,102,241,0.15);
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 600;
        color: #6366f1;
      }

      .comments-close-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid rgba(99, 102, 241, 0.08);
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #64748b;
      }

      .comments-close-btn:hover {
        background: #f1f5f9;
        color: #6366f1;
        transform: rotate(90deg);
        border-color: rgba(99, 102, 241, 0.2);
      }

      /* Content Area */
      .comments-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px 24px;
        background: #f8fafc;
        min-height: 300px;
        max-height: calc(80vh - 140px);
      }

      /* Custom scrollbar */
      .comments-content::-webkit-scrollbar {
        width: 6px;
      }
      .comments-content::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
      }
      .comments-content::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }
      .comments-content::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      /* Skeleton Comment - نفس تصميم صفحة البوستات */
      .comments-skeleton {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid rgba(99, 102, 241, 0.08);
        padding: 16px;
        margin-bottom: 12px;
        animation: skeletonFade 0.5s ease both;
      }

      .comments-skeleton-pulse {
        background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
      }

      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      @keyframes skeletonFade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Comment Item Wrapper */
      .comments-item-wrapper {
        animation: commentFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        margin-bottom: 12px;
      }

      @keyframes commentFadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Divider بين الكومنتات */
      .comments-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.08), transparent);
        margin: 12px 0;
      }

      /* Empty State - نفس تصميم صفحة البوستات */
      .comments-empty {
        text-align: center;
        padding: 48px 20px;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid rgba(99, 102, 241, 0.08);
        box-shadow: 0 2px 20px rgba(99, 102, 241, 0.04);
      }

      .comments-empty-icon {
        width: 64px;
        height: 64px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08));
        border: 1px solid rgba(99,102,241,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        font-size: 28px;
        color: #6366f1;
      }

      .comments-empty h3 {
        font-family: 'Sora', sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 6px;
      }

      .comments-empty p {
        font-size: 14px;
        color: #94a3b8;
      }

      /* Add Comment Section */
      .comments-add-section {
        background: #ffffff;
        border-top: 1px solid rgba(99, 102, 241, 0.08);
        padding: 16px 24px 20px;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.02);
      }
    `}</style>

    <div className='comments-modal-overlay' onClick={handleClose}>
      <div className='comments-modal' onClick={(e) => e.stopPropagation()}>
        
        {/* Header - نفس تصميم صفحة البوستات */}
        <div className='comments-header'>
          <div className='comments-title'>
            <span>Comments</span>
            <span className='comments-count'>{data?.length || 0}</span>
          </div>
          
          <button 
            onClick={handleClose}
            className='comments-close-btn'
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comments Area */}
        <div className='comments-content'>
          
          {/* Skeleton loading - نفس شكل الكومنت بالظبط */}
          {!isFetched && (
            <div>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className='comments-skeleton'>
                  <div className='flex gap-3'>
                    {/* صورة البروفايل skeleton */}
                    <div className='comments-skeleton-pulse' style={{ width: 48, height: 48, borderRadius: '50%' }}></div>
                    
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 flex-wrap mb-2'>
                        {/* اسم المستخدم skeleton */}
                        <div className='comments-skeleton-pulse' style={{ width: 120, height: 16, borderRadius: '20px' }}></div>
                        {/* badge النتيجة skeleton */}
                        <div className='comments-skeleton-pulse' style={{ width: 70, height: 14, borderRadius: '20px' }}></div>
                      </div>
                      
                      {/* محتوى الكومنت skeleton - سطرين */}
                      <div className='space-y-2'>
                        <div className='comments-skeleton-pulse' style={{ width: '100%', height: 14 }}></div>
                        <div className='comments-skeleton-pulse' style={{ width: '75%', height: 14 }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comments list - بعد ما تجيب البيانات */}
          {isFetched && (
            <div>
              {data?.length > 0 ? (
                <div>
                  {data.map((comment, index) => (
                    <div 
                      key={comment.id} 
                      className='comments-item-wrapper'
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <CommentsView comment={comment} postId={postId}/>
                      {index < data.length - 1 && <div className='comments-divider' />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='comments-empty'>
                  <div className='comments-empty-icon'>
                    💬
                  </div>
                  <h3>No comments yet</h3>
                  <p>Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Comment form - ثابت في الأسفل */}
        <div className='comments-add-section'>
          <AddComment postId={postId}/>
        </div>
      </div>
    </div>
  </>
}