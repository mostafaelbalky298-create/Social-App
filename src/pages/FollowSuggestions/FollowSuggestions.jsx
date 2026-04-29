import { useEffect, useState } from "react"
import axios from "axios"
import { AppNav } from "../../components/Navbar/Navbar"

export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [following,   setFollowing]   = useState([])
  const [followers,   setFollowers]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page,        setPage]        = useState(1)
  const [followed,    setFollowed]    = useState(new Set())
  const [activeTab,   setActiveTab]   = useState("suggestions")
  const [search,      setSearch]      = useState("")

  const COLORS = [
    { bg: "rgba(99,102,241,0.12)",  text: "#6366f1",  border: "rgba(99,102,241,0.2)"  },
    { bg: "rgba(236,72,153,0.12)",  text: "#ec4899",  border: "rgba(236,72,153,0.2)"  },
    { bg: "rgba(8,145,178,0.12)",   text: "#0891b2",  border: "rgba(8,145,178,0.2)"   },
    { bg: "rgba(168,85,247,0.12)",  text: "#8b5cf6",  border: "rgba(168,85,247,0.2)"  },
    { bg: "rgba(34,197,94,0.12)",   text: "#16a34a",  border: "rgba(34,197,94,0.2)"   },
  ]

  function getInitials(name = "") {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  }
  function getColor(name = "") {
    let h = 0
    for (let c of name) h += c.charCodeAt(0)
    return COLORS[h % COLORS.length]
  }

  // ─── localStorage ─────────────────────────────────────────────────────────────
  function saveToStorage(key, list) {
    localStorage.setItem(key, JSON.stringify(list))
  }
  function loadFromStorage(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]") } catch { return [] }
  }

  // ─── Fetch Suggestions ───────────────────────────────────────────────────────
  async function getSuggestions(pageNum = 1) {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/suggestions?limit=20&page=${pageNum}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      )
      const newUsers = data.data?.suggestions || data.data || []
      if (pageNum === 1) setSuggestions(newUsers)
      else setSuggestions(prev => [...prev, ...newUsers])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // ─── جيب بيانات يوزر واحد by ID ──────────────────────────────────────────────
  async function getUserById(id) {
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/${id}/profile`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      )
      return data.data?.user || data.data || null
    } catch {
      return null
    }
  }

  // ─── Fetch Following + Followers ─────────────────────────────────────────────
  async function getProfileData() {
    // حمّل من localStorage فوراً عشان الصفحة متبقاش فاضية
    const cachedFollowing = loadFromStorage("fs_following")
    if (cachedFollowing.length > 0) {
      setFollowing(cachedFollowing)
      setFollowed(new Set(cachedFollowing.map(u => u._id)))
    }

    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/users/profile-data`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      )

      const followingIds = data.data?.user?.following || []  // array of IDs
      const followerIds  = data.data?.user?.followers || []  // array of IDs

      // جيب بيانات كل الـ following بالتوازي
      if (followingIds.length > 0) {
        const followingUsers = await Promise.all(
          followingIds.map(id => {
            // لو الـ id object خد الـ _id منه، لو string استخدمه مباشرة
            const userId = typeof id === "object" ? id._id : id
            return getUserById(userId)
          })
        )
        const cleanFollowing = followingUsers.filter(Boolean)
        setFollowing(cleanFollowing)
        setFollowed(new Set(cleanFollowing.map(u => u._id)))
        saveToStorage("fs_following", cleanFollowing)
      } else {
        setFollowing([])
        setFollowed(new Set())
        saveToStorage("fs_following", [])
      }

      // جيب بيانات كل الـ followers بالتوازي
      if (followerIds.length > 0) {
        const followerUsers = await Promise.all(
          followerIds.map(id => {
            const userId = typeof id === "object" ? id._id : id
            return getUserById(userId)
          })
        )
        setFollowers(followerUsers.filter(Boolean))
      } else {
        setFollowers([])
      }

    } catch (err) {
      console.log("Profile data error — using cached following", err)
    }
  }

  // ─── Toggle Follow ────────────────────────────────────────────────────────────
  async function toggleFollow(userId) {
    const isCurrentlyFollowed = followed.has(userId)
    const userObj =
      suggestions.find(u => u._id === userId) ||
      following.find(u => u._id === userId)   ||
      followers.find(u => u._id === userId)

    // Optimistic UI
    setFollowed(prev => {
      const next = new Set(prev)
      if (isCurrentlyFollowed) next.delete(userId)
      else next.add(userId)
      return next
    })

    setFollowing(prev => {
      const updated = isCurrentlyFollowed
        ? prev.filter(u => u._id !== userId)
        : prev.some(u => u._id === userId) ? prev : userObj ? [...prev, userObj] : prev
      saveToStorage("fs_following", updated)
      return updated
    })

    // API call
    try {
      await axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      )
    } catch (err) {
      console.log("ERROR 👉", err.response?.data || err)
      // Rollback
      setFollowed(prev => {
        const next = new Set(prev)
        if (isCurrentlyFollowed) next.add(userId)
        else next.delete(userId)
        return next
      })
      setFollowing(prev => {
        const rolled = isCurrentlyFollowed
          ? userObj ? [...prev, userObj] : prev
          : prev.filter(u => u._id !== userId)
        saveToStorage("fs_following", rolled)
        return rolled
      })
    }
  }

  useEffect(() => { getSuggestions(page) }, [page])
  useEffect(() => { getProfileData() }, [])

  // ─── Filtered lists ───────────────────────────────────────────────────────────
  const q = search.toLowerCase()
  const filteredSuggestions = suggestions.filter(u =>
    u.name?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)
  )
  const filteredFollowing = following.filter(u =>
    u.name?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)
  )
  const filteredFollowers = followers.filter(u =>
    u.name?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)
  )

  const displayList =
    activeTab === "suggestions" ? filteredSuggestions :
    activeTab === "following"   ? filteredFollowing   :
                                  filteredFollowers

  return (
    <>
      <title>Follow Suggestions</title>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .fs-page { min-height:100vh; background:#f8fafc; font-family:'Inter',sans-serif; position:relative; overflow-x:hidden; }

        .fs-bg-grid { position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px);
          background-size:48px 48px; }

        .fs-orb { position:fixed; border-radius:50%; pointer-events:none; filter:blur(70px); z-index:0; }
        .fs-orb-1 { width:500px; height:500px; top:-150px; right:-150px;
          background:radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%);
          animation:fsOrbFloat 14s ease-in-out infinite; }
        .fs-orb-2 { width:400px; height:400px; bottom:-100px; left:-100px;
          background:radial-gradient(circle,rgba(236,72,153,0.06),transparent 70%);
          animation:fsOrbFloat 16s ease-in-out infinite reverse; }
        @keyframes fsOrbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }

        .fs-main { position:relative; z-index:10; padding-top:88px; padding-bottom:48px; }
        .fs-container { max-width:700px; margin:0 auto; padding:0 16px; display:flex; flex-direction:column; gap:20px; }

        .fs-top { display:flex; align-items:center; justify-content:space-between;
          animation:fsFadeUp .5s cubic-bezier(.16,1,.3,1) both; }
        .fs-title { font-family:'Sora',sans-serif; font-size:22px; font-weight:800;
          color:#0f172a; letter-spacing:-.4px; }
        .fs-title span { background:linear-gradient(135deg,#6366f1,#ec4899);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .fs-count-badge { display:flex; align-items:center; gap:5px;
          background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08));
          border:1px solid rgba(99,102,241,0.15); border-radius:20px;
          padding:4px 12px; font-size:12px; font-weight:600; color:#6366f1; }

        .fs-search-wrap { position:relative; animation:fsFadeUp .5s cubic-bezier(.16,1,.3,1) both .05s; }
        .fs-search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%);
          color:#9ca3af; pointer-events:none; }
        .fs-search-input { width:100%; padding:12px 16px 12px 42px; border-radius:14px;
          border:0.5px solid #e5e7eb; background:#fff; font-size:14px; color:#0f172a;
          outline:none; transition:.2s; font-family:'Inter',sans-serif; }
        .fs-search-input::placeholder { color:#9ca3af; }
        .fs-search-input:focus { border-color:rgba(99,102,241,0.4); box-shadow:0 0 0 3px rgba(99,102,241,0.07); }

        .fs-tabs-row { display:flex; align-items:center; gap:8px;
          animation:fsFadeUp .5s cubic-bezier(.16,1,.3,1) both .1s; }
        .fs-tab-btn { padding:7px 18px; border-radius:20px; border:0.5px solid #e5e7eb;
          background:#fff; font-size:13px; font-weight:500; color:#64748b;
          cursor:pointer; transition:.2s; font-family:'Inter',sans-serif; white-space:nowrap; }
        .fs-tab-btn.active { background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#fff; border-color:transparent; font-weight:600; }

        .fs-list { display:flex; flex-direction:column; gap:10px;
          animation:fsFadeUp .5s cubic-bezier(.16,1,.3,1) both .15s; }

        .fs-card { background:#fff; border:0.5px solid #e5e7eb; border-radius:16px;
          padding:14px 16px; display:flex; align-items:center; gap:14px; transition:.2s; }
        .fs-card:hover { border-color:rgba(99,102,241,0.25); background:#f9fafb; }

        .fs-avatar { width:46px; height:46px; border-radius:50%; object-fit:cover;
          border:2px solid #e5e7eb; flex-shrink:0; }
        .fs-avatar-fallback { width:46px; height:46px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-family:'Sora',sans-serif; font-size:15px; font-weight:800;
          border:2px solid transparent; flex-shrink:0; }

        .fs-user-info { flex:1; min-width:0; }
        .fs-name { font-size:14px; font-weight:600; color:#0f172a;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .fs-username { font-size:12px; color:#9ca3af; margin-top:2px; }

        .follow-btn { padding:8px 20px; border-radius:20px; border:none;
          font-size:13px; font-weight:600; cursor:pointer; transition:.2s;
          white-space:nowrap; flex-shrink:0; font-family:'Inter',sans-serif; }
        .follow-btn.not-followed { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; }
        .follow-btn.not-followed:hover { opacity:.9; }
        .follow-btn.followed { background:#f3f4f6; color:#9ca3af; border:0.5px solid #e5e7eb; }
        .follow-btn.followed:hover { background:rgba(239,68,68,0.06); color:#ef4444;
          border-color:rgba(239,68,68,0.2); }

        .fs-skeleton-list { display:flex; flex-direction:column; gap:10px; }
        .fs-sk-card { background:#fff; border:0.5px solid #e5e7eb; border-radius:16px;
          padding:14px 16px; display:flex; align-items:center; gap:14px; }
        .sk-pulse { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
          background-size:200% 100%; animation:fsShimmer 1.5s infinite; border-radius:8px; }
        @keyframes fsShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .fs-empty { background:#fff; border:0.5px solid #e5e7eb; border-radius:16px;
          padding:60px 20px; text-align:center; }
        .fs-empty-icon { width:56px; height:56px; border-radius:16px;
          background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.12);
          display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .fs-empty h3 { font-family:'Sora',sans-serif; font-size:17px; font-weight:700;
          color:#0f172a; margin-bottom:6px; }
        .fs-empty p { font-size:14px; color:#94a3b8; }

        .fs-load-more { width:100%; padding:12px; border-radius:12px;
          border:0.5px solid #e5e7eb; background:#fff; color:#9ca3af;
          font-size:14px; font-weight:500; cursor:pointer; transition:.2s;
          display:flex; align-items:center; justify-content:center; gap:8px;
          font-family:'Inter',sans-serif; }
        .fs-load-more:hover { background:#f9fafb; border-color:rgba(99,102,241,0.2); color:#6366f1; }
        .fs-load-more:disabled { opacity:.5; cursor:not-allowed; }

        .fs-loading-following { background:#fff; border:0.5px solid #e5e7eb; border-radius:16px;
          padding:24px 16px; display:flex; align-items:center; justify-content:center;
          gap:10px; color:#9ca3af; font-size:14px; }
        .fs-spinner { width:18px; height:18px; border:2px solid #e5e7eb;
          border-top-color:#6366f1; border-radius:50%; animation:fsSpin .7s linear infinite; }
        @keyframes fsSpin { to { transform: rotate(360deg); } }

        @keyframes fsFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="fs-page">
        <div className="fs-bg-grid" />
        <div className="fs-orb fs-orb-1" />
        <div className="fs-orb fs-orb-2" />

        <AppNav />

        <div className="fs-main">
          <div className="fs-container">

            {/* ── Header ── */}
            <div className="fs-top">
              <h2 className="fs-title">
                {activeTab === "suggestions" && <>Suggested <span>Friends</span></>}
                {activeTab === "following"   && <>People You <span>Follow</span></>}
                {activeTab === "followers"   && <>Your <span>Followers</span></>}
              </h2>
              <div className="fs-count-badge">
                👥 {
                  activeTab === "suggestions" ? suggestions.length :
                  activeTab === "following"   ? following.length   :
                                               followers.length
                }
              </div>
            </div>

            {/* ── Search ── */}
            <div className="fs-search-wrap">
              <svg className="fs-search-icon" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="fs-search-input"
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* ── Tabs ── */}
            <div className="fs-tabs-row">
              <button
                className={`fs-tab-btn ${activeTab === "suggestions" ? "active" : ""}`}
                onClick={() => { setActiveTab("suggestions"); setSearch("") }}
              >
                Suggestions
              </button>
              <button
                className={`fs-tab-btn ${activeTab === "following" ? "active" : ""}`}
                onClick={() => { setActiveTab("following"); setSearch("") }}
              >
                Following
              </button>
              <button
                className={`fs-tab-btn ${activeTab === "followers" ? "active" : ""}`}
                onClick={() => { setActiveTab("followers"); setSearch("") }}
              >
                Followers
              </button>
            </div>

            {/* ── Skeleton (suggestions loading) ── */}
            {loading && activeTab === "suggestions" && (
              <div className="fs-skeleton-list">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="fs-sk-card">
                    <div className="sk-pulse" style={{ width:46, height:46, borderRadius:"50%", flexShrink:0 }} />
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
                      <div className="sk-pulse" style={{ width:"40%", height:13 }} />
                      <div className="sk-pulse" style={{ width:"25%", height:11 }} />
                    </div>
                    <div className="sk-pulse" style={{ width:80, height:34, borderRadius:20, flexShrink:0 }} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Empty ── */}
            {!loading && displayList.length === 0 && (
              <div className="fs-empty">
                <div className="fs-empty-icon">
                  {activeTab === "suggestions" && (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                      stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  )}
                  {activeTab === "following" && (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                      stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  )}
                  {activeTab === "followers" && (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                      stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  )}
                </div>
                <h3>
                  {activeTab === "suggestions" && "No suggestions found"}
                  {activeTab === "following"   && "Not following anyone yet"}
                  {activeTab === "followers"   && "No followers yet"}
                </h3>
                <p>
                  {activeTab === "suggestions" && "Try a different search or check back later."}
                  {activeTab === "following"   && "Go follow some people from Suggestions!"}
                  {activeTab === "followers"   && "Share your profile to get followers!"}
                </p>
              </div>
            )}

            {/* ── List ── */}
            {!loading && displayList.length > 0 && (
              <div className="fs-list">
                {displayList.map(user => {
                  const c     = getColor(user.name)
                  const isFol = followed.has(user._id)
                  return (
                    <div key={user._id} className="fs-card">
                      {user.photo
                        ? <img className="fs-avatar" src={user.photo} alt="" />
                        : (
                          <div className="fs-avatar-fallback"
                            style={{ background: c.bg, color: c.text, borderColor: c.border }}>
                            {getInitials(user.name)}
                          </div>
                        )
                      }
                      <div className="fs-user-info">
                        <div className="fs-name">{user.name}</div>
                        <div className="fs-username">@{user.username}</div>
                      </div>
                      <button
                        className={`follow-btn ${isFol ? "followed" : "not-followed"}`}
                        onClick={() => toggleFollow(user._id)}
                      >
                        {isFol ? "Following" : "Follow"}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Load More (Suggestions only) ── */}
            {!loading && activeTab === "suggestions" && suggestions.length > 0 && (
              <button
                className="fs-load-more"
                disabled={loadingMore}
                onClick={() => setPage(prev => prev + 1)}
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            )}

          </div>
        </div>
      </div>
    </>
  )
}