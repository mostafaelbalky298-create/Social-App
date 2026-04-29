import { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from '../../components/PostCard/PostCard'
import usePosts from '../../customHook/usePosts'
import AddPost from '../../components/AddPost/AddPost'
import CommentsCard from '../../components/CommentsCard/CommentsCard'
import { AppNav } from '../../components/Navbar/Navbar'
import { useNavigate } from 'react-router-dom'

const NAV_ICONS = {
  feed: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  myposts: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  community: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  saved: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
}

export default function Post() {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const [postId, setPostId] = useState()
  const navigate = useNavigate()

  const { data, isLoading, isFetched } = usePosts(['allPosts'], 'posts')

  const [suggestions, setSuggestions] = useState([])
  const [loadingSug, setLoadingSug] = useState(true)
  const [followed, setFollowed] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('feed')
  const [mobSugOpen, setMobSugOpen] = useState(false)

  const COLORS = [
    { bg: 'rgba(99,102,241,0.12)',  text: '#6366f1', border: 'rgba(99,102,241,0.2)' },
    { bg: 'rgba(236,72,153,0.12)',  text: '#ec4899', border: 'rgba(236,72,153,0.2)' },
    { bg: 'rgba(8,145,178,0.12)',   text: '#0891b2', border: 'rgba(8,145,178,0.2)'  },
    { bg: 'rgba(168,85,247,0.12)',  text: '#8b5cf6', border: 'rgba(168,85,247,0.2)' },
    { bg: 'rgba(34,197,94,0.12)',   text: '#16a34a', border: 'rgba(34,197,94,0.2)'  },
  ]

  function getInitials(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }
  function getColor(name = '') {
    let h = 0; for (let c of name) h += c.charCodeAt(0)
    return COLORS[h % COLORS.length]
  }
  function toggleFollow(userId) {
    setFollowed(prev => { const s = new Set(prev); s.has(userId) ? s.delete(userId) : s.add(userId); return s })
  }

  async function getSuggestions() {
    try {
      const { data } = await axios.get(
        "https://route-posts.routemisr.com/users/suggestions?limit=5",
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      )
      setSuggestions(data.data.suggestions)
    } catch (err) { console.log(err) }
    finally { setLoadingSug(false) }
  }

  useEffect(() => { getSuggestions() }, [])

  const filteredSugs = suggestions.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navItems = [
    { key: 'feed',      label: 'Feed' },
    { key: 'myposts',   label: 'My Posts' },
    { key: 'community', label: 'Community' },
    { key: 'saved',     label: 'Saved' },
  ]

  const SugList = () => (
    <>
      {loadingSug && [1,2,3,4,5].map(i => (
        <div key={i} className="sug-item">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div className="sk-pulse" style={{width:40,height:40,borderRadius:'50%'}}/>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                <div className="sk-pulse" style={{height:11,width:90}}/>
                <div className="sk-pulse" style={{height:9,width:60}}/>
              </div>
            </div>
            <div className="sk-pulse" style={{width:64,height:28,borderRadius:20}}/>
          </div>
        </div>
      ))}
      {!loadingSug && filteredSugs.map(user => {
        const c = getColor(user.name)
        const isFol = followed.has(user._id)
        return (
          <div key={user._id} className="sug-item">
            <div className="sug-item-top">
              <div className="sug-left">
                {user.photo
                  ? <img src={user.photo} alt="" className="sug-avfb" style={{objectFit:'cover'}}/>
                  : <div className="sug-avfb" style={{background:c.bg,color:c.text,border:`2px solid ${c.border}`}}>{getInitials(user.name)}</div>
                }
                <div>
                  <div className="sug-name">{user.name}</div>
                  <div className="sug-handle">@{user.username}</div>
                </div>
              </div>
              <button
                className={`sug-btn ${isFol ? 'followed' : 'not-followed'}`}
                onClick={() => toggleFollow(user._id)}
              >
                {isFol ? 'Following' : '+ Follow'}
              </button>
            </div>
            {user.followersCount !== undefined && (
              <div className="sug-fol">{user.followersCount} followers</div>
            )}
          </div>
        )
      })}
    </>
  )

  return (
    <>
      <title>Home</title>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        #root {
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          text-align: unset !important;
        }

        .post-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: clip;
        }

        .post-bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .post-orb { position:fixed; border-radius:50%; pointer-events:none; filter:blur(80px); z-index:0; }
        .post-orb-1 { width:500px; height:500px; top:-150px; right:20%; background:radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%); animation:postOrbFloat 14s ease-in-out infinite; }
        .post-orb-2 { width:350px; height:350px; bottom:0; left:10%; background:radial-gradient(circle,rgba(236,72,153,0.06),transparent 70%); animation:postOrbFloat 16s ease-in-out infinite reverse; }
        @keyframes postOrbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-15px)} }

        .post-main { position:relative; z-index:10; padding-top:72px; padding-bottom:48px; }

        .post-layout {
          display: grid;
          grid-template-columns: 230px 1fr 290px;
          gap: 20px;
          max-width: 1320px;
          margin: 0 auto;
          padding: 20px 20px 0;
          align-items: start;
        }

        /* ── STICKY SIDEBARS ── */
        .post-sidebar {
          position: sticky;
          top: 80px;
          align-self: start;
          max-height: calc(100vh - 96px);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .post-sidebar::-webkit-scrollbar { display: none; }

        .post-right {
          position: sticky;
          top: 80px;
          align-self: start;
          max-height: calc(100vh - 96px);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .post-right::-webkit-scrollbar { display: none; }

        /* ── RESPONSIVE ── */
        .pp-mobile-nav { display: none; }
        .pp-mobile-sug { display: none; }

        @media(max-width:1050px) {
          .post-layout { grid-template-columns: 220px 1fr; }
          .post-right { display: none; }
        }
        @media(max-width:780px) {
          .post-layout { grid-template-columns: 1fr !important; padding: 12px 12px 0; }
          .post-sidebar { display: none; }
          .post-right   { display: none; }
          .pp-mobile-nav { display: block; }
          .pp-mobile-sug { display: block; }
        }

        /* ── SIDEBAR NAV with icons ── */
        .sidebar-card {
          background: #fff;
          border: 0.5px solid #e5e7eb;
          border-radius: 16px;
          padding: 10px;
          animation: postFadeUp .4s cubic-bezier(.16,1,.3,1) both;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: background .2s, color .2s;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Inter', sans-serif;
        }
        .nav-item svg { flex-shrink: 0; transition: stroke .2s; }
        .nav-item:hover { background: #f9fafb; color: #0f172a; }
        .nav-item.active {
          background: linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.07));
          color: #6366f1;
          font-weight: 600;
        }
        .nav-item.active svg { stroke: #6366f1; }

        /* ── MOBILE NAV ── */
        .mob-nav-card { background:#fff; border:0.5px solid #e5e7eb; border-radius:16px; padding:10px; }
        .mob-nav-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .mob-nav-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          padding:12px; border-radius:12px; border:none;
          background:#f9fafb; color:#6b7280; font-size:13px; font-weight:500;
          cursor:pointer; transition:.2s; font-family:'Inter',sans-serif;
        }
        .mob-nav-btn svg { flex-shrink:0; }
        .mob-nav-btn.active {
          background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.07));
          color:#6366f1; border:1px solid rgba(99,102,241,0.15); font-weight:600;
        }
        .mob-nav-btn.active svg { stroke: #6366f1; }

        /* ── MOBILE SUGGESTED ── */
        .mob-sug-card { background:#fff; border:0.5px solid #e5e7eb; border-radius:16px; overflow:hidden; }
        .mob-sug-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; cursor:pointer; }
        .mob-sug-header-left { display:flex; align-items:center; gap:8px; }
        .mob-sug-header-left svg { width:16px; height:16px; stroke:#6366f1; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
        .mob-sug-title { font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:#0f172a; }
        .mob-sug-header-right { display:flex; align-items:center; gap:8px; }
        .mob-sug-count { background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08)); border:1px solid rgba(99,102,241,0.15); border-radius:20px; padding:3px 10px; font-size:11px; font-weight:600; color:#6366f1; }
        .mob-sug-toggle { font-size:12px; font-weight:600; color:#6366f1; background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif; }
        .mob-sug-body { border-top:0.5px solid #f3f4f6; padding:8px 16px 14px; }

        /* ── POSTS ── */
        .post-wrap { margin-bottom: 20px; animation: postFadeUp .4s cubic-bezier(.16,1,.3,1) both; }
        .post-empty { background:#fff; border:0.5px solid #e5e7eb; border-radius:20px; padding:72px 20px; text-align:center; }
        .post-empty p { font-size:15px; color:#94a3b8; }

        /* ── SKELETON ── */
        .sk-pulse {
          background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
          background-size: 200% 100%; animation: skShimmer 1.5s infinite; border-radius: 8px;
        }
        @keyframes skShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── RIGHT PANEL ── */
        .sug-card { background:#fff; border:0.5px solid #e5e7eb; border-radius:16px; padding:16px; animation:postFadeUp .4s cubic-bezier(.16,1,.3,1) both .08s; }
        .sug-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .sug-title { font-family:'Sora',sans-serif; font-size:15px; font-weight:800; color:#0f172a; }
        .sug-title span { background:linear-gradient(135deg,#6366f1,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .sug-badge { background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08)); border:1px solid rgba(99,102,241,0.15); border-radius:20px; padding:3px 10px; font-size:11px; font-weight:600; color:#6366f1; }
        .sug-search { display:flex; align-items:center; gap:8px; background:#f9fafb; border:0.5px solid #e5e7eb; border-radius:10px; padding:8px 12px; margin-bottom:10px; }
        .sug-search svg { width:14px; height:14px; stroke:#9ca3af; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; flex-shrink:0; }
        .sug-search-input { background:none; border:none; font-size:13px; color:#0f172a; font-family:'Inter',sans-serif; outline:none; width:100%; }
        .sug-item { display:flex; flex-direction:column; padding:10px 0; border-bottom:0.5px solid #f3f4f6; }
        .sug-item:last-child { border-bottom:none; }
        .sug-item-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:3px; }
        .sug-left { display:flex; align-items:center; gap:10px; }
        .sug-avfb { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; font-size:12px; font-weight:700; flex-shrink:0; }
        .sug-name { font-size:13px; font-weight:600; color:#0f172a; }
        .sug-handle { font-size:12px; color:#9ca3af; }
        .sug-fol { font-size:12px; color:#9ca3af; padding-left:50px; margin-top:2px; }
        .sug-btn { font-size:12px; font-weight:600; padding:6px 14px; border-radius:20px; border:none; cursor:pointer; transition:.2s; font-family:'Inter',sans-serif; }
        .sug-btn.not-followed { background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08)); color:#6366f1; border:1px solid rgba(99,102,241,0.2); }
        .sug-btn.not-followed:hover { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border-color:transparent; }
        .sug-btn.followed { background:#f3f4f6; color:#9ca3af; border:0.5px solid #e5e7eb; }
        .sug-btn.followed:hover { background:rgba(239,68,68,0.07); color:#ef4444; border-color:rgba(239,68,68,0.2); }
        .sug-more { width:100%; margin-top:10px; padding:9px; border-radius:10px; border:0.5px solid #e5e7eb; background:none; color:#9ca3af; font-size:13px; font-weight:500; cursor:pointer; transition:.2s; font-family:'Inter',sans-serif; }
        .sug-more:hover { border-color:rgba(99,102,241,0.2); color:#6366f1; }

        @keyframes postFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="post-page">
        <div className="post-bg-grid"/>
        <div className="post-orb post-orb-1"/>
        <div className="post-orb post-orb-2"/>
        <AppNav/>

        <div className="post-main">
          <div className="post-layout">

            {/* ── DESKTOP SIDEBAR ── */}
            <div className="post-sidebar">
              <div className="sidebar-card">
                {navItems.map(item => (
                  <button
                    key={item.key}
                    className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
                    onClick={() => setActiveNav(item.key)}
                  >
                    {NAV_ICONS[item.key]}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── CENTER ── */}
            <div style={{display:'flex',flexDirection:'column',gap:0}}>

              {/* MOBILE NAV */}
              <div className="pp-mobile-nav" style={{marginBottom:14}}>
                <div className="mob-nav-card">
                  <div className="mob-nav-grid">
                    {navItems.map(item => (
                      <button
                        key={item.key}
                        className={`mob-nav-btn ${activeNav === item.key ? 'active' : ''}`}
                        onClick={() => setActiveNav(item.key)}
                      >
                        {NAV_ICONS[item.key]}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* MOBILE SUGGESTED */}
              <div className="pp-mobile-sug" style={{marginBottom:14}}>
                <div className="mob-sug-card">
                  <div className="mob-sug-header" onClick={() => setMobSugOpen(p => !p)}>
                    <div className="mob-sug-header-left">
                      <svg viewBox="0 0 24 24">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span className="mob-sug-title">Suggested Friends</span>
                    </div>
                    <div className="mob-sug-header-right">
                      <span className="mob-sug-count">{suggestions.length || 5}</span>
                      <button className="mob-sug-toggle">{mobSugOpen ? 'Hide' : 'Show'}</button>
                    </div>
                  </div>
                  {mobSugOpen && (
                    <div className="mob-sug-body">
                      <SugList/>
                      <button className="sug-more" onClick={() => navigate('/followSuggestions')}>View more</button>
                    </div>
                  )}
                </div>
              </div>

              {/* ADD POST */}
              <div style={{marginBottom:20}}>
                <AddPost/>
              </div>

              {/* SKELETON */}
              {isLoading && [1, 2, 3].map(i => (
                <div key={i} style={{background:'#fff',border:'0.5px solid #e5e7eb',borderRadius:20,padding:24,display:'flex',flexDirection:'column',gap:14,marginBottom:20}}>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div className="sk-pulse" style={{width:52,height:52,borderRadius:'50%'}}/>
                    <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
                      <div className="sk-pulse" style={{height:14,width:'38%'}}/>
                      <div className="sk-pulse" style={{height:11,width:'24%'}}/>
                    </div>
                  </div>
                  <div className="sk-pulse" style={{height:16}}/>
                  <div className="sk-pulse" style={{height:16,width:'75%'}}/>
                  <div className="sk-pulse" style={{height:240,borderRadius:14}}/>
                </div>
              ))}

              {/* EMPTY */}
              {isFetched && data.data.posts.length === 0 && (
                <div className="post-empty">
                  <p>No posts yet. Be the first one to publish.</p>
                </div>
              )}

              {/* POSTS */}
              {isFetched && data.data.posts.map((post, i) => (
                <div key={post.id} className="post-wrap" style={{animationDelay:`${i * 0.07}s`}}>
                  <PostCard post={post} setPostId={setPostId} setIsOpen={setIsOpen}/>
                </div>
              ))}
            </div>

            {/* ── DESKTOP RIGHT ── */}
            <div className="post-right">
              <div className="sug-card">
                <div className="sug-top">
                  <h3 className="sug-title">Suggested <span>Friends</span></h3>
                  <span className="sug-badge">{suggestions.length}</span>
                </div>
                <div className="sug-search">
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    className="sug-search-input"
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <SugList/>
                <button className="sug-more" onClick={() => navigate('/followSuggestions')}>View more</button>
              </div>
            </div>

          </div>
        </div>

        <CommentsCard isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose} postId={postId}/>
      </div>
    </>
  )
}