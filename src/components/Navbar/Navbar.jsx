import React, { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { useNavigate, NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'

export function AppNav() {
  const { token, setToken, userData } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#94a3b8",
      background: "#ffffff",
      color: "#0f172a",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('Token')
        setToken(null)
        Swal.fire({
          title: "Logged Out!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
          background: "#ffffff",
          color: "#0f172a",
        }).then(() => {
          navigate('/login')
        })
      }
    })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

        .nav-root {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 50;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 1px 40px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04);
          font-family: 'Inter', sans-serif;
        }

        /* subtle top accent line */
        .nav-root::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        }

        /* BG orbs */
        .nav-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(40px);
        }
        .nav-orb-1 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%);
          top: -80px; right: 80px;
          animation: navOrb1 10s ease-in-out infinite;
        }
        .nav-orb-2 {
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%);
          top: -60px; left: 120px;
          animation: navOrb1 13s ease-in-out infinite reverse;
        }
        @keyframes navOrb1 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(20px, 10px); }
        }

        /* inner layout */
        .nav-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* LOGO */
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 38px; height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: transform .3s, box-shadow .3s;
        }
        .nav-logo:hover .nav-logo-icon {
          transform: rotate(-8deg) scale(1.08);
          box-shadow: 0 6px 20px rgba(99,102,241,0.45);
        }
        .nav-logo-icon svg { width: 20px; height: 20px; stroke: #fff; }
        .nav-logo-text {
          font-family: 'Sora', sans-serif;
          font-size: 18px; font-weight: 800;
          letter-spacing: -.4px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* CENTER LINKS */
        .nav-links {
          display: flex; align-items: center; gap: 4px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px;
          border-radius: 10px;
          font-size: 13px; font-weight: 600;
          color: #64748b;
          text-decoration: none;
          transition: all .2s;
          border: 1px solid transparent;
        }
        .nav-link svg { width: 15px; height: 15px; transition: stroke .2s; }
        .nav-link:hover {
          background: rgba(99,102,241,0.07);
          color: #6366f1;
          border-color: rgba(99,102,241,0.12);
        }
        .nav-link.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08));
          color: #6366f1;
          border-color: rgba(99,102,241,0.18);
          box-shadow: 0 2px 8px rgba(99,102,241,0.1);
        }
        .nav-link.active svg { stroke: #6366f1; }

        /* RIGHT SIDE */
        .nav-right {
          display: flex; align-items: center; gap: 10px;
        }

        /* NOTIFICATION */
        .nav-bell {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all .2s;
        }
        .nav-bell:hover {
          background: rgba(99,102,241,0.07);
          border-color: rgba(99,102,241,0.2);
        }
        .nav-bell svg { width: 17px; height: 17px; stroke: #64748b; transition: stroke .2s; }
        .nav-bell:hover svg { stroke: #6366f1; }
        .nav-bell-dot {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px;
          background: #ec4899;
          border-radius: 50%;
          border: 1.5px solid #fff;
          animation: navDotPulse 2s ease-in-out infinite;
        }
        @keyframes navDotPulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.3); }
        }

        /* AVATAR DROPDOWN */
        .nav-avatar-wrap {
          position: relative;
        }
        .nav-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: all .2s;
        }
        .nav-avatar-btn:hover {
          border-color: rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 2px 8px rgba(99,102,241,0.1);
        }
        .nav-avatar-img {
          width: 30px; height: 30px;
          border-radius: 8px;
          object-fit: cover;
          border: 1.5px solid rgba(99,102,241,0.2);
          background: linear-gradient(135deg,#6366f1,#a855f7);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .nav-avatar-img svg { width: 16px; height: 16px; stroke: #fff; }
        .nav-avatar-info { display: flex; flex-direction: column; text-align: left; }
        .nav-avatar-name {
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 700; color: #0f172a;
          line-height: 1.2;
          max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .nav-avatar-role { font-size: 10px; color: #94a3b8; }
        .nav-avatar-chevron {
          width: 14px; height: 14px; stroke: #94a3b8;
          transition: transform .25s;
        }
        .nav-avatar-wrap.open .nav-avatar-chevron { transform: rotate(180deg); }
        .nav-avatar-wrap.open .nav-avatar-btn {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.06);
        }

        /* DROPDOWN MENU */
        .nav-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 220px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(99,102,241,0.12);
          box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 16px 40px rgba(99,102,241,0.14);
          padding: 6px;
          animation: navDDIn .2s cubic-bezier(.16,1,.3,1);
          transform-origin: top right;
        }
        @keyframes navDDIn {
          from { opacity: 0; transform: scale(.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)  translateY(0); }
        }

        .nav-dd-header {
          padding: 10px 12px 10px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 4px;
        }
        .nav-dd-name { font-family:'Sora',sans-serif; font-size:13px; font-weight:700; color:#0f172a; }
        .nav-dd-email { font-size:11px; color:#94a3b8; margin-top:1px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .nav-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13px; font-weight: 500; color: #475569;
          cursor: pointer;
          text-decoration: none;
          transition: all .15s;
          border: none; background: none; width: 100%; text-align: left;
        }
        .nav-dd-item svg { width: 15px; height: 15px; flex-shrink: 0; }
        .nav-dd-item:hover { background: #f8fafc; color: #0f172a; }
        .nav-dd-item.danger { color: #ef4444; }
        .nav-dd-item.danger:hover { background: #fef2f2; color: #dc2626; }

        .nav-dd-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

        /* ONLINE DOT */
        .nav-online {
          width: 8px; height: 8px;
          background: #22c55e;
          border-radius: 50%;
          border: 1.5px solid #fff;
          flex-shrink: 0;
        }

        /* MOBILE TOGGLE */
        .nav-toggle {
          display: none;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          align-items: center; justify-content: center;
          cursor: pointer;
          transition: all .2s;
        }
        .nav-toggle:hover { border-color: rgba(99,102,241,0.2); background: rgba(99,102,241,0.06); }
        .nav-toggle svg { width: 18px; height: 18px; stroke: #64748b; }

        /* MOBILE MENU */
        .nav-mobile {
          position: absolute; top: 100%; left: 0; right: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 8px 32px rgba(99,102,241,0.1);
          padding: 12px 16px 16px;
          display: flex; flex-direction: column; gap: 4px;
          animation: navMobIn .2s ease;
        }
        @keyframes navMobIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-mobile .nav-link { justify-content: flex-start; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-toggle { display: flex; }
          .nav-avatar-info { display: none; }
          .nav-avatar-btn { padding: 4px; }
        }
      `}</style>

      <NavComponent
        token={token}
        userData={userData}
        handleLogout={handleLogout}
      />
    </>
  )
}

function NavComponent({ token, userData, handleLogout }) {
  const [open, setOpen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const dropdownRef = React.useRef(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const AvatarImg = () => (
    <div className="nav-avatar-img">
      {userData?.photo
        ? <img src={userData.photo} alt={userData?.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        : <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
      }
    </div>
  )

  return (
    <nav className="nav-root">
      <div className="nav-orb nav-orb-1"/>
      <div className="nav-orb nav-orb-2"/>

      <div className="nav-inner">

        {/* LOGO */}
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1"/>
              <path d="M5 4h9a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 4V6a2 2 0 012-2z"/>
            </svg>
          </div>
          <span className="nav-logo-text">Social App</span>
        </a>

        {/* CENTER NAV LINKS — only when logged in */}
        {token && (
          <div className="nav-links">
            <NavLink to="/" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/>
              </svg>
              Posts
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </NavLink>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="nav-right">
          {token ? (
            <>
              {/* Bell */}
              <button className="nav-bell" type="button">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span className="nav-bell-dot"/>
              </button>

              {/* Avatar + Dropdown */}
              <div className={`nav-avatar-wrap ${open ? 'open' : ''}`} ref={dropdownRef}>
                <button type="button" className="nav-avatar-btn" onClick={() => setOpen(!open)}>
                  <AvatarImg/>
                  <div className="nav-avatar-info">
                    <span className="nav-avatar-name">{userData?.name || 'User'}</span>
                    <span className="nav-avatar-role">Member</span>
                  </div>
                  <svg className="nav-avatar-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {open && (
                  <div className="nav-dropdown">
                    {/* Header */}
                    <div className="nav-dd-header">
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <AvatarImg/>
                        <div>
                          <div className="nav-dd-name">{userData?.name || 'User'}</div>
                          <div className="nav-dd-email">{userData?.email}</div>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:5}}>
                        <span className="nav-online"/>
                        <span style={{fontSize:11,color:'#22c55e',fontWeight:600}}>Online</span>
                      </div>
                    </div>

                    {/* Profile */}
                    <NavLink
                      to="/profile"
                      className="nav-dd-item"
                      onClick={() => setOpen(false)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      My Profile
                    </NavLink>

                    {/* Settings */}
                    <button type="button" className="nav-dd-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                      </svg>
                      Settings
                    </button>

                    <div className="nav-dd-divider"/>

                    {/* Logout */}
                    <button type="button" className="nav-dd-item danger" onClick={() => { setOpen(false); handleLogout(); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile toggle */}
              <button type="button" className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                }
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && token && (
        <div className="nav-mobile">
          <NavLink to="/" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/>
            </svg>
            Posts
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Profile
          </NavLink>
        </div>
      )}
    </nav>
  )
}
 
