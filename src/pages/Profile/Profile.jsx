import React, { useContext, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PostCard from '../../components/PostCard/PostCard';
import Skeleton from "react-loading-skeleton";
import CommentsCard from '../../components/CommentsCard/CommentsCard';
import Swal from "sweetalert2";
import { AppNav } from '../../components/Navbar/Navbar'

export default function Profile() {
  const { userData, setUserData } = useContext(AuthContext)

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const { data } = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      setUserData(prev => ({
        ...prev,
        photo: data.data.photo
      }));

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile photo has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while updating your photo.",
      });
    }
  };
  
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['UserPosts', userData?._id],
    queryFn: getUserPosts,
    enabled: Boolean(userData?._id)
  });

  async function getUserPosts() {
    try {
      if(userData) {
        const {data} = await axios.get(`https://route-posts.routemisr.com/users/${userData?._id}/posts`, {
          headers: {
            AUTHORIZATION: `Bearer ${localStorage.getItem('Token')}`
          }
        })
        return data.data.posts
      }
    } catch(err) {
      console.log(err);
      return err
    } 
  }

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [postId, setPostId] = useState()

  return (
    <>
      <title>Profile</title>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

        

        .profile-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Background Layer - نفس تصميم صفحة البوستات */
        .profile-bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .profile-orb {
          position: fixed; border-radius: 50%; pointer-events: none;
          filter: blur(80px); z-index: 0;
        }

        .profile-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%);
          top: -200px; right: -200px;
          animation: profileOrbFloat 14s ease-in-out infinite;
        }

        .profile-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(236,72,153,0.08), transparent 70%);
          bottom: -150px; left: -150px;
          animation: profileOrbFloat 16s ease-in-out infinite reverse;
        }

        .profile-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(34,211,238,0.07), transparent 70%);
          top: 40%; left: 5%;
          animation: profileOrbFloat 11s ease-in-out infinite 2s;
        }

        @keyframes profileOrbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-30px) scale(1.05); }
          66%      { transform: translate(-20px,20px) scale(0.96); }
        }

        /* Floating Shapes */
        .profile-geo {
          position: fixed; pointer-events: none; z-index: 0; opacity: 0;
          animation: profileGeoIn 1.5s ease forwards, profileGeoFloat ease-in-out infinite;
        }

        @keyframes profileGeoIn { 
          to { opacity: 1; } 
        }

        @keyframes profileGeoFloat {
          0%,100% { transform: translateY(0) rotate(var(--r0, 0deg)); }
          50%     { transform: translateY(-18px) rotate(var(--r1,20deg)); }
        }

        /* Main Content */
        .profile-main {
          position: relative; z-index: 10;
          padding-top: 88px;
          padding-bottom: 48px;
        }

        .profile-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* Profile Card - نفس تصميم الكاردز في صفحة البوستات */
        .profile-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.08);
          box-shadow: 0 2px 20px rgba(99, 102, 241, 0.07), 0 1px 4px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          animation: profileFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-bottom: 24px;
        }

        .profile-card:hover {
          box-shadow: 0 20px 30px rgba(99, 102, 241, 0.15), 0 4px 8px rgba(0, 0, 0, 0.05);
          border-color: rgba(99, 102, 241, 0.2);
        }

        @keyframes profileFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-card-content {
          padding: 24px;
        }

        /* Avatar Section */
        .profile-avatar-wrapper {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }

        .profile-avatar-container {
  position: relative;
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
}

/* الصورة */
.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

/* تغيير لون البوردر عند hover على الكارت */
.profile-card:hover .profile-avatar {
  border-color: rgba(236, 72, 153, 0.4);
}

/* النقطة الخضراء */
.profile-avatar-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 14px;
  height: 14px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 3;
}

/* Overlay */
.profile-avatar-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: 0.3s ease;
  border-radius: 50%;
  z-index: 1;
}

/* الأزرار */
.profile-avatar-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  opacity: 0;
  transform: scale(0.8);
  transition: 0.3s ease;
  z-index: 2;
}

/* إظهار عند hover */
.profile-avatar-container:hover::after {
  opacity: 1;
}

.profile-avatar-container:hover .profile-avatar-actions {
  opacity: 1;
  transform: scale(1);
}

/* شكل الزرار */
.profile-avatar-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.25s ease;
  color: #6366f1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* حجم الأيقونة */
.profile-avatar-btn svg {
  width: 18px;
  height: 18px;
}

/* Hover عادي */
.profile-avatar-btn:hover {
  background: #6366f1;
  color: white;
  transform: scale(1.1);
}

/* زرار الكاميرا */
.profile-avatar-btn.camera {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
}

.profile-avatar-btn.camera:hover {
  background: linear-gradient(135deg, #4f52e0, #d9467c);
}

        .profile-user-info {
          flex: 1;
        }

        .profile-user-name {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          letter-spacing: -0.4px;
        }

        .profile-user-handle {
          font-size: 16px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 12px;
        }

        .profile-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 30px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
        }

        .profile-user-badge svg {
          width: 14px;
          height: 14px;
        }

        /* Stats Grid */
        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .profile-stat-item {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.08);
          border-radius: 16px;
          padding: 16px 8px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .profile-stat-item:hover {
          background: #f1f5f9;
          border-color: rgba(99, 102, 241, 0.2);
        }

        .profile-stat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .profile-stat-value {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        /* About Section */
        .profile-about-section {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.08);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .profile-about-title {
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .profile-about-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          font-size: 14px;
          color: #475569;
        }

        .profile-about-item svg {
          width: 16px;
          height: 16px;
          color: #6366f1;
        }

        /* Mini Stats */
        .profile-mini-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .profile-mini-stat {
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.08);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .profile-mini-stat.posts:hover {
          background: rgba(99, 102, 241, 0.05);
          border-color: rgba(99, 102, 241, 0.2);
        }

        .profile-mini-stat.saved:hover {
          background: rgba(236, 72, 153, 0.05);
          border-color: rgba(236, 72, 153, 0.2);
        }

        .profile-mini-stat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .profile-mini-stat.posts .profile-mini-stat-label {
          color: #6366f1;
        }

        .profile-mini-stat.saved .profile-mini-stat-label {
          color: #ec4899;
        }

        .profile-mini-stat-value {
          font-family: 'Sora', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        /* Posts Section */
        .profile-posts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 0 2px;
          animation: profileFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .profile-posts-title {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        .profile-posts-title span {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .profile-posts-count {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08));
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
        }

        .profile-posts-count svg {
          width: 13px;
          height: 13px;
        }

        /* Skeleton Card - نفس تصميم صفحة البوستات */
        .profile-skeleton-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.08);
          box-shadow: 0 2px 20px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04);
          padding: 24px;
          animation: profileFadeUp 0.5s cubic-bezier(.16,1,.3,1) both;
          margin-bottom: 20px;
        }

        .profile-sk-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 16px; 
        }

        .profile-sk-user { 
          display: flex; 
          gap: 12px; 
          align-items: center; 
        }

        .profile-sk-info { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
        }

        .profile-sk-body { 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
          margin-bottom: 16px; 
        }

        .profile-sk-img { 
          border-radius: 14px; 
          overflow: hidden; 
          margin-bottom: 16px; 
        }

        .profile-sk-footer { 
          display: flex; 
          gap: 16px; 
        }

        .profile-sk-pulse {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: profileSkShimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes profileSkShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty State */
        .profile-empty {
          text-align: center;
          padding: 60px 20px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.08);
          box-shadow: 0 2px 20px rgba(99,102,241,0.06);
          animation: profileFadeUp 0.5s ease both;
        }

        .profile-empty-icon {
          width: 64px; 
          height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08));
          border: 1px solid rgba(99,102,241,0.12);
          display: flex; 
          align-items: center; 
          justify-content: center;
          margin: 0 auto 16px;
        }

        .profile-empty-icon svg { 
          width: 30px; 
          height: 30px; 
          stroke: #6366f1; 
        }

        .profile-empty h3 {
          font-family: 'Sora', sans-serif;
          font-size: 18px; 
          font-weight: 700; 
          color: #0f172a; 
          margin-bottom: 6px;
        }

        .profile-empty p { 
          font-size: 14px; 
          color: #94a3b8; 
        }

        /* Staggered posts */
        .profile-post-wrap {
          animation: profileFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="profile-page">
        {/* Background Layer */}
        <div className="profile-bg-grid"/>
        <div className="profile-orb profile-orb-1"/>
        <div className="profile-orb profile-orb-2"/>
        <div className="profile-orb profile-orb-3"/>

        {/* Floating geo shapes - نفس تصميم صفحة البوستات */}
        {[
          { type: 'sq', s: 16, top: '15%', left: '2%', c: 'rgba(99,102,241,0.12)', dur: '7s', del: '0s', r0: '15deg', r1: '35deg' },
          { type: 'ci', s: 12, top: '20%', left: '95%', c: 'rgba(236,72,153,0.12)', dur: '9s', del: '1s', r0: '0deg', r1: '0deg' },
          { type: 'rg', s: 24, top: '50%', left: '1%', c: 'rgba(168,85,247,0.12)', dur: '10s', del: '1.5s', r0: '0deg', r1: '30deg' },
          { type: 'rg', s: 18, top: '60%', left: '96%', c: 'rgba(99,102,241,0.1)', dur: '12s', del: '0.8s', r0: '10deg', r1: '-10deg' },
          { type: 'sq', s: 14, top: '75%', left: '3%', c: 'rgba(34,211,238,0.1)', dur: '8s', del: '2s', r0: '-5deg', r1: '15deg' },
        ].map((g, i) => {
          const base = {
            position: 'fixed', pointerEvents: 'none', zIndex: 0,
            '--r0': g.r0, '--r1': g.r1,
            top: g.top, left: g.left,
            animationDuration: g.dur, animationDelay: g.del
          }
          if (g.type === 'sq') return <div key={i} className="profile-geo" style={{ ...base, width: g.s, height: g.s, background: g.c, borderRadius: 3, animationName: 'profileGeoIn,profileGeoFloat' }} />
          if (g.type === 'ci') return <div key={i} className="profile-geo" style={{ ...base, width: g.s, height: g.s, background: g.c, borderRadius: '50%', animationName: 'profileGeoIn,profileGeoFloat' }} />
          if (g.type === 'rg') return <div key={i} className="profile-geo" style={{ ...base, width: g.s, height: g.s, border: `2px solid ${g.c}`, borderRadius: '50%', background: 'transparent', animationName: 'profileGeoIn,profileGeoFloat' }} />
          return null
        })}

        {/* Navbar */}
        <AppNav />

        {/* Main Content */}
        <div className="profile-main">
          <div className="profile-container">
            
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-card-content">
                
                {/* Avatar and User Info */}
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-container">
                    <img
                      src={userData?.photo}
                      alt={userData?.name}
                      className="profile-avatar"
                    />
                    <div className="profile-avatar-badge" />
                    <div className="profile-avatar-actions">
                      <button
                        type="button"
                        className="profile-avatar-btn"
                        title="View profile photo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m15 15 6 6" />
                          <path d="m15 9 6-6" />
                          <path d="M21 16v5h-5" />
                          <path d="M21 8V3h-5" />
                          <path d="M3 16v5h5" />
                          <path d="m3 21 6-6" />
                          <path d="M3 8V3h5" />
                          <path d="M9 9 3 3" />
                        </svg>
                      </button>
                      <label className="profile-avatar-btn camera">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                        <input onChange={handleImageChange} accept="image/*" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="profile-user-info">
                    <h2 className="profile-user-name">{userData?.name}</h2>
                    <p className="profile-user-handle">@{userData?.name}</p>
                    <div className="profile-user-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                      Social App member
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="profile-stats-grid">
                  <div className="profile-stat-item">
                    <div className="profile-stat-label">Followers</div>
                    <div className="profile-stat-value">{userData?.followersCount || 0}</div>
                  </div>
                  <div className="profile-stat-item">
                    <div className="profile-stat-label">Following</div>
                    <div className="profile-stat-value">{userData?.followingCount || 0}</div>
                  </div>
                  <div className="profile-stat-item">
                    <div className="profile-stat-label">Bookmarks</div>
                    <div className="profile-stat-value">{userData?.bookmarksCount || 0}</div>
                  </div>
                </div>

                {/* About Section */}
                <div className="profile-about-section">
                  <h3 className="profile-about-title">About</h3>
                  <div className="profile-about-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                    {userData?.email}
                  </div>
                  <div className="profile-about-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    Active on Social App
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="profile-mini-stats">
                  <div className="profile-mini-stat posts">
                    <div className="profile-mini-stat-label">My posts</div>
                    <div className="profile-mini-stat-value">{data?.length || 0}</div>
                  </div>
                  <div className="profile-mini-stat saved">
                    <div className="profile-mini-stat-label">Saved posts</div>
                    <div className="profile-mini-stat-value">0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Section Header */}
            <div className="profile-posts-header">
              <h2 className="profile-posts-title">
                My <span>Posts</span>
              </h2>
              {isFetched && (
                <div className="profile-posts-count">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                  {data?.length || 0} posts
                </div>
              )}
            </div>

            {/* Loading Skeletons */}
            {isLoading && (
              <>
                {[1, 2].map((n) => (
                  <div key={n} className="profile-skeleton-card">
                    <div className="profile-sk-row">
                      <div className="profile-sk-user">
                        <div className="profile-sk-pulse" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                        <div className="profile-sk-info">
                          <div className="profile-sk-pulse" style={{ width: 130, height: 14 }} />
                          <div className="profile-sk-pulse" style={{ width: 90, height: 11 }} />
                        </div>
                      </div>
                      <div className="profile-sk-pulse" style={{ width: 72, height: 34, borderRadius: 10 }} />
                    </div>
                    <div className="profile-sk-body">
                      <div className="profile-sk-pulse" style={{ height: 16 }} />
                      <div className="profile-sk-pulse" style={{ height: 16, width: '75%' }} />
                    </div>
                    <div className="profile-sk-img">
                      <div className="profile-sk-pulse" style={{ height: 260 }} />
                    </div>
                    <div className="profile-sk-footer">
                      <div className="profile-sk-pulse" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <div className="profile-sk-pulse" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <div className="profile-sk-pulse" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Empty State */}
            {isFetched && (!data || data.length === 0) && (
              <div className="profile-empty">
                <div className="profile-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                </div>
                <h3>No posts yet</h3>
                <p>Share your first post with the community!</p>
              </div>
            )}

            {/* User Posts */}
            {isFetched && Array.isArray(data) && data?.map((post, index) => (
              <div
                key={post._id}
                className="profile-post-wrap"
                style={{ animationDelay: `${index * 0.06}s` }}
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
