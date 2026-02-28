import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import PostCard from '../../components/PostCard/PostCard'
import Skeleton from "react-loading-skeleton";
import usePosts from '../../customHook/usePosts'
import AddPost from '../../components/AddPost/AddPost'
import CommentsCard from '../../components/CommentsCard/CommentsCard'
import { AppNav } from '../../components/Navbar/Navbar'

export default function Post() {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const [postId, setPostId] = useState()

  const { data, isLoading, isFetched } = usePosts(['allPosts'], 'posts')

  return (
    <>
      <title>Post</title>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .post-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ── BACKGROUND ── */
        .post-bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .post-orb {
          position: fixed; border-radius: 50%; pointer-events: none;
          filter: blur(80px); z-index: 0;
        }
        .post-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%);
          top: -200px; right: -200px;
          animation: postOrbFloat 14s ease-in-out infinite;
        }
        .post-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(236,72,153,0.08), transparent 70%);
          bottom: -150px; left: -150px;
          animation: postOrbFloat 16s ease-in-out infinite reverse;
        }
        .post-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(34,211,238,0.07), transparent 70%);
          top: 40%; left: 5%;
          animation: postOrbFloat 11s ease-in-out infinite 2s;
        }
        @keyframes postOrbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-30px) scale(1.05); }
          66%      { transform: translate(-20px,20px) scale(0.96); }
        }

        /* floating geo */
        .post-geo {
          position: fixed; pointer-events: none; z-index: 0; opacity: 0;
          animation: postGeoIn 1.5s ease forwards, postGeoFloat ease-in-out infinite;
        }
        @keyframes postGeoIn   { to { opacity: 1; } }
        @keyframes postGeoFloat {
          0%,100% { transform: translateY(0)   rotate(var(--r0, 0deg)); }
          50%     { transform: translateY(-18px) rotate(var(--r1,20deg)); }
        }

        /* ── MAIN CONTENT ── */
        .post-main {
          position: relative; z-index: 10;
          padding-top: 88px; /* navbar height */
          padding-bottom: 48px;
        }
        .post-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex; flex-direction: column; gap: 20px;
        }

        /* ── SECTION HEADER ── */
        .post-section-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2px;
          animation: postFadeUp .6s cubic-bezier(.16,1,.3,1) both;
        }
        .post-section-title {
          font-family: 'Sora', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #0f172a; letter-spacing: -.4px;
        }
        .post-section-title span {
          background: linear-gradient(135deg,#6366f1,#ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .post-count-badge {
          display: flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08));
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px; font-weight: 600; color: #6366f1;
        }
        .post-count-badge svg { width: 13px; height: 13px; }

        /* ── SKELETON CARD ── */
        .post-skeleton-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.08);
          box-shadow: 0 2px 20px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04);
          padding: 24px;
          animation: postFadeUp .5s cubic-bezier(.16,1,.3,1) both;
        }
        .post-sk-row   { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .post-sk-user  { display: flex; gap: 12px; align-items: center; }
        .post-sk-info  { display: flex; flex-direction: column; gap: 6px; }
        .post-sk-body  { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .post-sk-img   { border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
        .post-sk-footer{ display: flex; gap: 16px; }
        .post-sk-pulse {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: postSkShimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes postSkShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── FADE UP ANIMATION ── */
        @keyframes postFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* staggered post cards */
        .post-card-wrap {
          animation: postFadeUp .5s cubic-bezier(.16,1,.3,1) both;
        }

        /* ── EMPTY STATE ── */
        .post-empty {
          text-align: center;
          padding: 60px 20px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.08);
          box-shadow: 0 2px 20px rgba(99,102,241,0.06);
          animation: postFadeUp .5s ease both;
        }
        .post-empty-icon {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08));
          border: 1px solid rgba(99,102,241,0.12);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }
        .post-empty-icon svg { width: 30px; height: 30px; stroke: #6366f1; }
        .post-empty h3 {
          font-family: 'Sora', sans-serif;
          font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px;
        }
        .post-empty p { font-size: 14px; color: #94a3b8; }
      `}</style>

      <div className="post-page">

        {/* ── BACKGROUND LAYER ── */}
        <div className="post-bg-grid"/>
        <div className="post-orb post-orb-1"/>
        <div className="post-orb post-orb-2"/>
        <div className="post-orb post-orb-3"/>

        {/* Floating geo shapes */}
        {[
          {type:'sq',s:16,top:'15%',left:'2%', c:'rgba(99,102,241,0.12)', dur:'7s', del:'0s',  r0:'15deg',r1:'35deg'},
          {type:'ci',s:12,top:'20%',left:'95%',c:'rgba(236,72,153,0.12)', dur:'9s', del:'1s',  r0:'0deg', r1:'0deg'},
          {type:'rg',s:24,top:'50%',left:'1%', c:'rgba(168,85,247,0.12)', dur:'10s',del:'1.5s',r0:'0deg', r1:'30deg'},
          {type:'rg',s:18,top:'60%',left:'96%',c:'rgba(99,102,241,0.1)',  dur:'12s',del:'0.8s',r0:'10deg',r1:'-10deg'},
          {type:'sq',s:14,top:'75%',left:'3%', c:'rgba(34,211,238,0.1)',  dur:'8s', del:'2s',  r0:'-5deg',r1:'15deg'},
        ].map((g,i)=>{
          const base={position:'fixed',pointerEvents:'none',zIndex:0,'--r0':g.r0,'--r1':g.r1,top:g.top,left:g.left,animationDuration:g.dur,animationDelay:g.del}
          if(g.type==='sq') return <div key={i} className="post-geo" style={{...base,width:g.s,height:g.s,background:g.c,borderRadius:3,animationName:'postGeoIn,postGeoFloat'}}/>
          if(g.type==='ci') return <div key={i} className="post-geo" style={{...base,width:g.s,height:g.s,background:g.c,borderRadius:'50%',animationName:'postGeoIn,postGeoFloat'}}/>
          if(g.type==='rg') return <div key={i} className="post-geo" style={{...base,width:g.s,height:g.s,border:`2px solid ${g.c}`,borderRadius:'50%',background:'transparent',animationName:'postGeoIn,postGeoFloat'}}/>
          return null
        })}

        {/* ── NAVBAR ── */}
        <AppNav/>

        {/* ── MAIN ── */}
        <div className="post-main">
          <div className="post-container">

            {/* Add Post */}
            <div style={{animation:'postFadeUp .5s cubic-bezier(.16,1,.3,1) both'}}>
              <AddPost/>
            </div>

            {/* Section header */}
            <div className="post-section-header">
              <h2 className="post-section-title">Latest <span>Posts</span></h2>
              {isFetched && (
                <div className="post-count-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/>
                  </svg>
                  {data?.data?.posts?.length || 0} posts
                </div>
              )}
            </div>

            {/* Skeleton */}
            {isLoading && (
              <div className="post-skeleton-card">
                <div className="post-sk-row">
                  <div className="post-sk-user">
                    <div className="post-sk-pulse" style={{width:48,height:48,borderRadius:'50%'}}/>
                    <div className="post-sk-info">
                      <div className="post-sk-pulse" style={{width:130,height:14}}/>
                      <div className="post-sk-pulse" style={{width:90,height:11}}/>
                    </div>
                  </div>
                  <div className="post-sk-pulse" style={{width:72,height:34,borderRadius:10}}/>
                </div>
                <div className="post-sk-body">
                  <div className="post-sk-pulse" style={{height:16}}/>
                  <div className="post-sk-pulse" style={{height:16,width:'75%'}}/>
                </div>
                <div className="post-sk-img">
                  <div className="post-sk-pulse" style={{height:260}}/>
                </div>
                <div className="post-sk-footer">
                  <div className="post-sk-pulse" style={{width:32,height:32,borderRadius:'50%'}}/>
                  <div className="post-sk-pulse" style={{width:32,height:32,borderRadius:'50%'}}/>
                  <div className="post-sk-pulse" style={{width:32,height:32,borderRadius:'50%'}}/>
                </div>
              </div>
            )}

            {/* Posts */}
            {isFetched && data.data.posts.length === 0 && (
              <div className="post-empty">
                <div className="post-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/>
                  </svg>
                </div>
                <h3>No posts yet</h3>
                <p>Be the first to share something!</p>
              </div>
            )}

            {isFetched && data.data.posts.map((post, i) => (
              <div
                key={post.id}
                className="post-card-wrap"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <PostCard
                  post={post}
                  setPostId={setPostId}
                  setIsOpen={setIsOpen}
                />
              </div>
            ))}

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











// const {data,isLoading,isFetching,isFetched,isError} = useQuery({
//     queryFn:getPosts,
//     queryKey:['AllPosts']
//   })

//   async function getPosts() {
//     try{
//       const {data} = await axios.get(`https://route-posts.routemisr.com/posts`,{
//         headers:{
//           AUTHORIZATION:`Bearer ${localStorage.getItem('Token')}`
//         }
//       })
//       console.log(data);
//       return data.data.posts
//     }catch(err){
//       console.log(err);
//       return err
//     } 
//     }