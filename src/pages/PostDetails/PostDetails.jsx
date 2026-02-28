import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import PostCard from '../../components/PostCard/PostCard';
import Skeleton from "react-loading-skeleton";
import axios from 'axios'
import usePosts from '../../customHook/usePosts';
import CommentsCard from '../../components/CommentsCard/CommentsCard';
import { AppNav } from '../../components/Navbar/Navbar';

export default function PostDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [postId, setPostId] = useState()

  const { id } = useParams()
  const { data, isFetched, isLoading } = usePosts(['Detials'], `posts/${id}`)

  return (
    <>
      <title>Post Details</title>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .details-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Background Layer - نفس تصميم الصفحات الأخرى */
        .details-bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .details-orb {
          position: fixed; border-radius: 50%; pointer-events: none;
          filter: blur(80px); z-index: 0;
        }

        .details-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%);
          top: -200px; right: -200px;
          animation: detailsOrbFloat 14s ease-in-out infinite;
        }

        .details-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(236,72,153,0.08), transparent 70%);
          bottom: -150px; left: -150px;
          animation: detailsOrbFloat 16s ease-in-out infinite reverse;
        }

        .details-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(34,211,238,0.07), transparent 70%);
          top: 40%; left: 5%;
          animation: detailsOrbFloat 11s ease-in-out infinite 2s;
        }

        @keyframes detailsOrbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-30px) scale(1.05); }
          66%      { transform: translate(-20px,20px) scale(0.96); }
        }

        /* Floating Shapes */
        .details-geo {
          position: fixed; pointer-events: none; z-index: 0; opacity: 0;
          animation: detailsGeoIn 1.5s ease forwards, detailsGeoFloat ease-in-out infinite;
        }

        @keyframes detailsGeoIn { 
          to { opacity: 1; } 
        }

        @keyframes detailsGeoFloat {
          0%,100% { transform: translateY(0) rotate(var(--r0, 0deg)); }
          50%     { transform: translateY(-18px) rotate(var(--r1,20deg)); }
        }

        /* Main Content */
        .details-main {
          position: relative; z-index: 10;
          padding-top: 88px;
          padding-bottom: 48px;
        }

        .details-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* Header */
        .details-header {
          margin-bottom: 24px;
          animation: detailsFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .details-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.4px;
        }

        .details-title span {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .details-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
        }

        .details-breadcrumb a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .details-breadcrumb a:hover {
          color: #ec4899;
        }

        .details-breadcrumb svg {
          width: 14px;
          height: 14px;
          stroke: #94a3b8;
        }

        /* Post Container */
        .details-post-container {
          animation: detailsFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.1s;
        }

        @keyframes detailsFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Skeleton Card - نفس تصميم الصفحات الأخرى */
        .details-skeleton-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.08);
          box-shadow: 0 2px 20px rgba(99, 102, 241, 0.07), 0 1px 4px rgba(0, 0, 0, 0.04);
          padding: 24px;
          animation: detailsFadeUp 0.5s cubic-bezier(.16,1,.3,1) both;
        }

        .details-sk-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 16px; 
        }

        .details-sk-user { 
          display: flex; 
          gap: 12px; 
          align-items: center; 
        }

        .details-sk-info { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
        }

        .details-sk-body { 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
          margin-bottom: 16px; 
        }

        .details-sk-img { 
          border-radius: 14px; 
          overflow: hidden; 
          margin-bottom: 16px; 
        }

        .details-sk-footer { 
          display: flex; 
          gap: 16px; 
        }

        .details-sk-pulse {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: detailsSkShimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes detailsSkShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Navigation Buttons */
        .details-nav-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          gap: 16px;
        }

        .details-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #ffffff;
          border: 1px solid rgba(99, 102, 241, 0.08);
          border-radius: 30px;
          color: #475569;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.05);
        }

        .details-nav-btn:hover {
          border-color: #6366f1;
          color: #6366f1;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
        }

        .details-nav-btn svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
        }

        .details-nav-btn.prev svg {
          transform: rotate(180deg);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .details-title {
            font-size: 24px;
          }
          
          .details-nav-buttons {
            flex-direction: column;
          }
          
          .details-nav-btn {
            justify-content: center;
          }
        }
      `}</style>

      <div className="details-page">
        {/* Background Layer */}
        <div className="details-bg-grid"/>
        <div className="details-orb details-orb-1"/>
        <div className="details-orb details-orb-2"/>
        <div className="details-orb details-orb-3"/>

        {/* Floating geo shapes - نفس تصميم الصفحات الأخرى */}
        {[
          { type: 'sq', s: 16, top: '15%', left: '2%', c: 'rgba(99,102,241,0.12)', dur: '7s', del: '0s', r0: '15deg', r1: '35deg' },
          { type: 'ci', s: 12, top: '20%', left: '95%', c: 'rgba(236,72,153,0.12)', dur: '9s', del: '1s', r0: '0deg', r1: '0deg' },
          { type: 'rg', s: 24, top: '50%', left: '1%', c: 'rgba(168,85,247,0.12)', dur: '10s', del: '1.5s', r0: '0deg', r1: '30deg' },
          { type: 'rg', s: 18, top: '60%', left: '96%', c: 'rgba(99,102,241,0.1)', dur: '12s', del: '0.8s', r0: '10deg', r1: '-10deg' },
          { type: 'sq', s: 14, top: '75%', left: '3%', c: 'rgba(34,211,238,0.1)', dur: '8s', del: '2s', r0: '-5deg', r1: '15deg' },
        ].map((g, i) => {
          const base = {
            position: 'fixed', 
            pointerEvents: 'none', 
            zIndex: 0,
            '--r0': g.r0, 
            '--r1': g.r1,
            top: g.top, 
            left: g.left,
            animationDuration: g.dur, 
            animationDelay: g.del
          }
          if (g.type === 'sq') return <div key={i} className="details-geo" style={{ ...base, width: g.s, height: g.s, background: g.c, borderRadius: 3, animationName: 'detailsGeoIn,detailsGeoFloat' }} />
          if (g.type === 'ci') return <div key={i} className="details-geo" style={{ ...base, width: g.s, height: g.s, background: g.c, borderRadius: '50%', animationName: 'detailsGeoIn,detailsGeoFloat' }} />
          if (g.type === 'rg') return <div key={i} className="details-geo" style={{ ...base, width: g.s, height: g.s, border: `2px solid ${g.c}`, borderRadius: '50%', background: 'transparent', animationName: 'detailsGeoIn,detailsGeoFloat' }} />
          return null
        })}

        {/* Navbar */}
        <AppNav />

        {/* Main Content */}
        <div className="details-main">
          <div className="details-container">
            
            {/* Page Header */}
            <div className="details-header">
              <h1 className="details-title">
                Post <span>Details</span>
              </h1>
              <div className="details-breadcrumb">
                <a href="/">Home</a>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <a href="/">Posts</a>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span>Details</span>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="details-skeleton-card">
                <div className="details-sk-row">
                  <div className="details-sk-user">
                    <div className="details-sk-pulse" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                    <div className="details-sk-info">
                      <div className="details-sk-pulse" style={{ width: 130, height: 14 }} />
                      <div className="details-sk-pulse" style={{ width: 90, height: 11 }} />
                    </div>
                  </div>
                  <div className="details-sk-pulse" style={{ width: 72, height: 34, borderRadius: 10 }} />
                </div>
                <div className="details-sk-body">
                  <div className="details-sk-pulse" style={{ height: 16 }} />
                  <div className="details-sk-pulse" style={{ height: 16, width: '75%' }} />
                  <div className="details-sk-pulse" style={{ height: 16, width: '60%' }} />
                </div>
                <div className="details-sk-img">
                  <div className="details-sk-pulse" style={{ height: 260 }} />
                </div>
                <div className="details-sk-footer">
                  <div className="details-sk-pulse" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <div className="details-sk-pulse" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <div className="details-sk-pulse" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                </div>
              </div>
            )}
            
            {/* Post Details */}
            {isFetched && data?.data?.post && (
              <div className="details-post-container">
                <PostCard 
                  post={data.data.post} 
                  setPostId={setPostId} 
                  setIsOpen={setIsOpen} 
                />
                
                {/* Navigation Buttons */}
                <div className="details-nav-buttons">
                  <a href="/" className="details-nav-btn prev">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Posts
                  </a>
                  
                  <a href="/profile" className="details-nav-btn">
                    Go to Profile
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Error State - if no post found */}
            {isFetched && !data?.data?.post && (
              <div className="profile-empty" style={{ marginTop: '24px' }}>
                <div className="profile-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3>Post not found</h3>
                <p>The post you're looking for doesn't exist or has been removed.</p>
                <a 
                  href="/posts" 
                  style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    color: 'white',
                    borderRadius: '30px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Go back to Posts
                </a>
              </div>
            )}
            
            {/* Comments Modal */}
            <CommentsCard 
              isOpen={isOpen} 
              setIsOpen={setIsOpen} 
              handleClose={handleClose} 
              postId={postId}
            />
          </div>
        </div>
      </div>
    </>
  )
}
