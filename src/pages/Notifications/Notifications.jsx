import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppNav } from "../../components/Navbar/Navbar";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  async function getNotifications(type = "all") {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/notifications?unread=${type === "unread"}&page=1&limit=10`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      );
      setNotifications(data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    try {
      await axios.patch(
        `https://route-posts.routemisr.com/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      );
      getNotifications(activeTab);
    } catch (err) { console.log(err); }
  }

  useEffect(() => { getNotifications(activeTab); }, [activeTab]);

  const typeMap = {
    like:    { label: "Like",    cls: "badge-like" },
    comment: { label: "Comment", cls: "badge-comment" },
    follow:  { label: "Follow",  cls: "badge-follow" },
    share:   { label: "Share",   cls: "badge-share" },
  };

  function getInitials(name = "") {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  }

  return (
    <>
    <title>Notifications</title>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .notif-page { min-height:100vh; background:#f8fafc; font-family:'Inter',sans-serif; position:relative; overflow-x:hidden; }
        .notif-bg-grid { position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image: linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px);
          background-size:48px 48px; }

        .notif-orb { position:fixed; border-radius:50%; pointer-events:none; filter:blur(80px); z-index:0; }
        .notif-orb-1 { width:600px; height:600px; background:radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%); top:-200px; right:-200px; animation:notifOrbFloat 14s ease-in-out infinite; }
        .notif-orb-2 { width:500px; height:500px; background:radial-gradient(circle,rgba(236,72,153,0.08),transparent 70%); bottom:-150px; left:-150px; animation:notifOrbFloat 16s ease-in-out infinite reverse; }
        .notif-orb-3 { width:300px; height:300px; background:radial-gradient(circle,rgba(34,211,238,0.07),transparent 70%); top:40%; left:5%; animation:notifOrbFloat 11s ease-in-out infinite 2s; }
        @keyframes notifOrbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.96)} }

        .notif-main { position:relative; z-index:10; padding-top:88px; padding-bottom:48px; }
        .notif-container { max-width:680px; margin:0 auto; padding:0 16px; display:flex; flex-direction:column; gap:20px; }

        .notif-section-header { display:flex; align-items:center; justify-content:space-between; padding:0 2px; animation:notifFadeUp .6s cubic-bezier(.16,1,.3,1) both; }
        .notif-section-title { font-family:'Sora',sans-serif; font-size:20px; font-weight:800; color:#0f172a; letter-spacing:-.4px; }
        .notif-section-title span { background:linear-gradient(135deg,#6366f1,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .notif-count-badge { display:flex; align-items:center; gap:5px; background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.08)); border:1px solid rgba(99,102,241,0.15); border-radius:20px; padding:4px 12px; font-size:12px; font-weight:600; color:#6366f1; }

        .notif-tabs-row { display:flex; align-items:center; justify-content:space-between; animation:notifFadeUp .55s cubic-bezier(.16,1,.3,1) both .05s; }
        .notif-tabs { display:flex; gap:6px; }
        .notif-tab { border:none; padding:8px 18px; border-radius:20px; cursor:pointer; font-size:13px; font-weight:500; transition:.2s; background:#e5e7eb; color:#6b7280; }
        .notif-tab.active { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; }
        .notif-mark-btn { display:flex; align-items:center; gap:6px; background:#f3f4f6; border:0.5px solid #e5e7eb; padding:8px 14px; border-radius:10px; cursor:pointer; font-size:13px; font-weight:500; color:#6b7280; transition:.2s; }
        .notif-mark-btn:hover { background:#fff; }

        .notif-list { display:flex; flex-direction:column; gap:8px; animation:notifFadeUp .5s cubic-bezier(.16,1,.3,1) both .1s; }
        .notif-item { background:#fff; border-radius:14px; border:0.5px solid #e5e7eb; padding:16px; display:flex; gap:12px; align-items:flex-start; transition:.2s; cursor:pointer; position:relative; }
        .notif-item:hover { background:#f9fafb; border-color:#d1d5db; }
        .notif-item.unread { border-left:3px solid #6366f1; padding-left:14px; }
        .unread-dot { position:absolute; top:16px; right:16px; width:8px; height:8px; border-radius:50%; background:#6366f1; }

        .notif-avatar { width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; }
        .notif-avatar-fallback { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; font-size:14px; font-weight:700; flex-shrink:0; background:rgba(99,102,241,0.1); color:#6366f1; border:2px solid rgba(99,102,241,0.15); }

        .notif-body { flex:1; min-width:0; }
        .notif-type-badge { display:inline-flex; align-items:center; font-size:11px; font-weight:500; padding:3px 8px; border-radius:20px; margin-bottom:6px; }
        .badge-like    { background:rgba(236,72,153,0.1);  color:#ec4899; }
        .badge-comment { background:rgba(99,102,241,0.1);  color:#6366f1; }
        .badge-follow  { background:rgba(34,211,238,0.1);  color:#0891b2; }
        .badge-share   { background:rgba(168,85,247,0.1);  color:#8b5cf6; }

        .notif-text { font-size:14px; color:#111827; line-height:1.5; margin-bottom:4px; }
        .notif-text strong { font-weight:500; }
        .notif-time { font-size:12px; color:#9ca3af; }

        .notif-skeleton { background:#fff; border-radius:14px; border:0.5px solid #e5e7eb; padding:16px; display:flex; gap:12px; }
        .sk-pulse { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:notifSkShimmer 1.5s infinite; border-radius:8px; }
        @keyframes notifSkShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .notif-empty { background:#fff; border:0.5px solid #e5e7eb; border-radius:14px; padding:60px 20px; text-align:center; }
        .notif-empty-icon { width:56px; height:56px; border-radius:16px; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.12); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .notif-empty h3 { font-family:'Sora',sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:6px; }
        .notif-empty p { font-size:14px; color:#94a3b8; }

        @keyframes notifFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .notif-card-wrap { animation:notifFadeUp .4s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="notif-page">
        <div className="notif-bg-grid" />
        <div className="notif-orb notif-orb-1" />
        <div className="notif-orb notif-orb-2" />
        <div className="notif-orb notif-orb-3" />

        <AppNav />

        <div className="notif-main">
          <div className="notif-container">

            {/* Header */}
            <div className="notif-section-header">
              <h2 className="notif-section-title">My <span>Notifications</span></h2>
              {!loading && (
                <div className="notif-count-badge">
                  🔔 {notifications.length}
                </div>
              )}
            </div>

            {/* Tabs + Mark all */}
            <div className="notif-tabs-row">
              <div className="notif-tabs">
                <button className={`notif-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All</button>
                <button className={`notif-tab ${activeTab === "unread" ? "active" : ""}`} onClick={() => setActiveTab("unread")}>Unread</button>
              </div>
              <button className="notif-mark-btn" onClick={markAllRead}>✔ Mark all as read</button>
            </div>

            {/* Skeleton */}
            {loading && [1, 2, 3].map(i => (
              <div key={i} className="notif-skeleton">
                <div className="sk-pulse" style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="sk-pulse" style={{ height: 12, width: "35%" }} />
                  <div className="sk-pulse" style={{ height: 14, width: "75%" }} />
                  <div className="sk-pulse" style={{ height: 11, width: "20%" }} />
                </div>
              </div>
            ))}

            {/* Empty */}
            {!loading && notifications.length === 0 && (
              <div className="notif-empty">
                <div className="notif-empty-icon">🔔</div>
                <h3>You're all caught up</h3>
                <p>{activeTab === "unread" ? "No unread notifications." : "No notifications yet."}</p>
              </div>
            )}

            {/* List */}
            {!loading && (
              <div className="notif-list">
                {notifications.map((notif, i) => {
                  const badge = typeMap[notif.type] || { label: notif.type, cls: "badge-comment" };
                  return (
                    <div key={notif._id} className={`notif-card-wrap notif-item ${!notif.read ? "unread" : ""}`} style={{ animationDelay: `${i * 0.06}s` }}>
                      {!notif.read && <div className="unread-dot" />}
                      {notif.user?.photo
                        ? <img src={notif.user.photo} alt="" className="notif-avatar" />
                        : <div className="notif-avatar-fallback">{getInitials(notif.user?.name)}</div>
                      }
                      <div className="notif-body">
                        <div className={`notif-type-badge ${badge.cls}`}>{badge.label}</div>
                        <p className="notif-text"><strong>{notif.user?.name}</strong> {notif.body}</p>
                        <p className="notif-time">{notif.createdAt}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}