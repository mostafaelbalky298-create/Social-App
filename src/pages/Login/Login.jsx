import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { RotatingLines } from 'react-loader-spinner'
import { AuthContext } from '../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [massg, setmassg] = useState()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const LoginSchema = z.object({
    email: z.string().min(1, 'Email Is Required').email('Email Is Not Valid'),
    password: z.string().min(1, 'Password Is Required').regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'Password is not valid'
    ),
  })

  const { register, handleSubmit, formState } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" }
  })

  async function SendRegisterData(values) {
    setLoading(true)
    try {
      const { data } = await axios.post('https://route-posts.routemisr.com/users/signin', values)
      if (data.success) {
        setmassg(data.message)
        localStorage.setItem('Token', data.data.token)
        setToken(data.data.token)
        navigate('/')
      }
    } catch (err) {
      setmassg(err.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  const BG = {
    particles: [
      {s:6,c:'#6366f1',l:'12%',t:'85%',dur:'9s', del:'0s'},
      {s:4,c:'#a855f7',l:'25%',t:'90%',dur:'12s',del:'2s'},
      {s:8,c:'#ec4899',l:'40%',t:'80%',dur:'10s',del:'1s'},
      {s:5,c:'#22d3ee',l:'60%',t:'95%',dur:'14s',del:'3s'},
      {s:3,c:'#fb923c',l:'75%',t:'88%',dur:'8s', del:'0.5s'},
      {s:7,c:'#6366f1',l:'88%',t:'92%',dur:'11s',del:'4s'},
      {s:4,c:'#a855f7',l:'5%', t:'70%',dur:'13s',del:'1.5s'},
      {s:6,c:'#ec4899',l:'50%',t:'75%',dur:'9s', del:'2.5s'},
      {s:5,c:'#22d3ee',l:'33%',t:'98%',dur:'15s',del:'0s'},
      {s:3,c:'#fb923c',l:'67%',t:'82%',dur:'10s',del:'3.5s'},
    ],
    geos: [
      {type:'sq',s:18,top:'12%',left:'8%', c:'rgba(99,102,241,0.15)', dur:'7s', del:'0s',  r0:'15deg', r1:'35deg'},
      {type:'ci',s:14,top:'18%',left:'85%',c:'rgba(236,72,153,0.15)', dur:'9s', del:'1s',  r0:'0deg',  r1:'0deg'},
      {type:'sq',s:22,top:'72%',left:'5%', c:'rgba(34,211,238,0.12)', dur:'8s', del:'0.5s',r0:'-10deg',r1:'10deg'},
      {type:'rg',s:28,top:'45%',left:'3%', c:'rgba(168,85,247,0.15)', dur:'10s',del:'1.5s',r0:'0deg',  r1:'30deg'},
      {type:'rg',s:20,top:'55%',left:'93%',c:'rgba(99,102,241,0.12)', dur:'12s',del:'0.8s',r0:'10deg', r1:'-10deg'},
      {type:'sq',s:12,top:'30%',left:'92%',c:'rgba(34,211,238,0.14)', dur:'6s', del:'3s',  r0:'45deg', r1:'65deg'},
      {type:'ci',s:10,top:'65%',left:'15%',c:'rgba(251,146,60,0.12)', dur:'8s', del:'2.5s',r0:'0deg',  r1:'0deg'},
    ]
  }

  return (
    <>
      <title>Login</title>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .lr{min-height:100vh;background:#fff;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;position:relative;overflow:hidden;padding:24px 16px;}

        /* BG */
        .lr-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px);background-size:48px 48px;}
        .lr-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(70px);opacity:0;animation:lrOrbIn 1.2s ease forwards;}
        .lr-o1{width:560px;height:560px;background:radial-gradient(circle at 40% 40%,rgba(99,102,241,0.2),rgba(168,85,247,0.09) 60%,transparent 80%);top:-180px;right:-140px;animation:lrOrbIn 1s .1s ease forwards,lrD1 12s 1.2s ease-in-out infinite;}
        .lr-o2{width:480px;height:480px;background:radial-gradient(circle at 60% 60%,rgba(236,72,153,0.17),rgba(251,146,60,0.07) 60%,transparent 80%);bottom:-160px;left:-140px;animation:lrOrbIn 1s .3s ease forwards,lrD2 14s 1.4s ease-in-out infinite;}
        .lr-o3{width:280px;height:280px;background:radial-gradient(circle,rgba(34,211,238,0.13),transparent 70%);top:30%;left:6%;animation:lrOrbIn 1s .5s ease forwards,lrD3 10s 1.6s ease-in-out infinite;}
        .lr-o4{width:220px;height:220px;background:radial-gradient(circle,rgba(251,146,60,0.12),transparent 70%);bottom:14%;right:8%;animation:lrOrbIn 1s .7s ease forwards,lrD1 9s 1.8s ease-in-out infinite reverse;}
        @keyframes lrOrbIn{to{opacity:1}}
        @keyframes lrD1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-36px) scale(1.06)}66%{transform:translate(-18px,22px) scale(.95)}}
        @keyframes lrD2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-32px,-26px) scale(1.08)}70%{transform:translate(22px,18px) scale(.94)}}
        @keyframes lrD3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(14px,-30px) scale(1.1)}}
        .lr-pt{position:absolute;border-radius:50%;pointer-events:none;opacity:0;animation:lrPt linear infinite;}
        @keyframes lrPt{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:1}90%{opacity:.5}100%{transform:translateY(-100vh) rotate(720deg);opacity:0}}
        .lr-geo{position:absolute;pointer-events:none;opacity:0;animation:lrGIn 1s ease forwards,lrGF ease-in-out infinite;}
        @keyframes lrGIn{to{opacity:1}}
        @keyframes lrGF{0%,100%{transform:translateY(0) rotate(var(--r0,0deg))}50%{transform:translateY(-16px) rotate(var(--r1,20deg))}}
        .lr-pr{position:absolute;border-radius:50%;border:1px solid rgba(99,102,241,0.13);pointer-events:none;animation:lrPR 4s ease-out infinite;}
        .lr-pr:nth-child(2){animation-delay:1.4s}.lr-pr:nth-child(3){animation-delay:2.8s}
        @keyframes lrPR{0%{transform:scale(.5);opacity:.7}100%{transform:scale(2.5);opacity:0}}
        .lr-cl{position:absolute;pointer-events:none;}
        .lr-cl line{stroke-dasharray:60;stroke-dashoffset:60;animation:lrCL 1.2s ease forwards;}
        .lr-cl line:nth-child(2){animation-delay:.2s}.lr-cl line:nth-child(3){animation-delay:.4s}
        @keyframes lrCL{to{stroke-dashoffset:0}}

        /* CARD */
        .lr-card{position:relative;z-index:10;width:100%;max-width:440px;background:#fff;border-radius:24px;box-shadow:0 0 0 1px rgba(99,102,241,0.1),0 20px 60px rgba(99,102,241,0.12),0 4px 16px rgba(0,0,0,0.06);overflow:hidden;animation:lrCardIn .7s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(28px);}
        @keyframes lrCardIn{to{opacity:1;transform:translateY(0)}}

        /* TABS */
        .lr-tabs{display:flex;gap:6px;background:#f1f5f9;padding:8px;border-bottom:1px solid #e2e8f0;}
        .lr-tab{flex:1;padding:12px 0;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;border-radius:10px;transition:all .25s cubic-bezier(.4,0,.2,1);letter-spacing:.01em;}
        .lr-tab-on{background:#fff;color:#6366f1;box-shadow:0 2px 12px rgba(99,102,241,0.15),0 1px 3px rgba(0,0,0,0.08);cursor:default;}
        .lr-tab-off{background:transparent;color:#94a3b8;}
        .lr-tab-off:hover{background:rgba(99,102,241,0.06);color:#6366f1;}

        /* BODY */
        .lr-body{padding:32px 40px 40px;}

        /* ICON */
        .lr-icon{width:62px;height:62px;border-radius:17px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;box-shadow:0 8px 24px rgba(99,102,241,0.32);animation:lrIcon .6s cubic-bezier(.34,1.56,.64,1) .35s both;cursor:pointer;transition:transform .3s,box-shadow .3s;}
        .lr-icon:hover{transform:rotate(-8deg) scale(1.06);box-shadow:0 12px 32px rgba(99,102,241,0.42);}
        @keyframes lrIcon{from{opacity:0;transform:scale(.5) rotate(-20deg)}to{opacity:1;transform:scale(1) rotate(0)}}
        .lr-icon svg{width:28px;height:28px;stroke:#fff;}

        /* HEADER */
        .lr-hd{text-align:center;margin-bottom:28px;}
        .lr-hd h1{font-family:'Sora',sans-serif;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-.4px;margin-bottom:5px;}
        .lr-hd h1 span{background:linear-gradient(135deg,#6366f1,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .lr-hd p{color:#94a3b8;font-size:13px;}

        /* FIELD */
        .lr-f{display:flex;flex-direction:column;gap:5px;margin-bottom:16px;}
        .lr-lbl{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#475569;letter-spacing:.02em;transition:color .2s;}
        .lr-f:focus-within .lr-lbl{color:#6366f1;}
        .lr-lbl svg{width:13px;height:13px;}
        .lr-iw{position:relative;}
        .lr-iw input{width:100%;padding:11px 42px 11px 14px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:13px;font-family:'Inter',sans-serif;color:#0f172a;background:#f8fafc;outline:none;transition:border-color .25s,background .25s,box-shadow .25s;}
        .lr-iw input::placeholder{color:#cbd5e1;}
        .lr-iw input:focus{border-color:#6366f1;background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.1);}
        .lr-ii{position:absolute;right:13px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;transition:color .2s;}
        .lr-ii.c{pointer-events:all;cursor:pointer;}
        .lr-ii.c:hover{color:#6366f1;}
        .lr-f:focus-within .lr-ii{color:#6366f1;}
        .lr-ii svg{width:15px;height:15px;}
        .lr-err{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:#ef4444;background:#fef2f2;border:1px solid #fecaca;padding:6px 10px;border-radius:8px;animation:lrShk .4s ease;}
        .lr-err svg{width:12px;height:12px;flex-shrink:0;}
        @keyframes lrShk{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}

        /* REMEMBER */
        .lr-rr{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
        .lr-ck{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;color:#64748b;user-select:none;}
        .lr-ck:hover{color:#475569;}
        .lr-ck input{display:none;}
        .lr-cb{width:17px;height:17px;border:1.5px solid #cbd5e1;border-radius:5px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
        .lr-cb svg{width:9px;height:9px;opacity:0;transition:opacity .2s;}
        .lr-ck:hover .lr-cb{border-color:#6366f1;}
        .lr-ck input:checked + .lr-cb{background:#6366f1;border-color:#6366f1;}
        .lr-ck input:checked + .lr-cb svg{opacity:1;}
        .lr-fg{background:none;border:none;cursor:pointer;font-size:13px;font-weight:600;color:#6366f1;transition:color .2s;padding:0;}
        .lr-fg:hover{color:#ec4899;}

        /* SUBMIT */
        .lr-btn{width:100%;padding:13px;border:none;border-radius:13px;cursor:pointer;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;background:linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%);background-size:200% 200%;box-shadow:0 6px 20px rgba(99,102,241,0.32);transition:box-shadow .3s,transform .2s,background-position .4s;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:8px;animation:lrBG 3s ease-in-out infinite alternate;}
        .lr-btn:hover:not(:disabled){box-shadow:0 10px 30px rgba(99,102,241,0.46);transform:translateY(-1px);background-position:right center;}
        .lr-btn:active:not(:disabled){transform:translateY(0);}
        .lr-btn:disabled{opacity:.65;cursor:not-allowed;}
        .lr-btn svg{width:17px;height:17px;transition:transform .3s;}
        .lr-btn:hover svg{transform:translateX(3px);}
        .lr-sh{position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.22) 50%,transparent 60%);transform:translateX(-100%);transition:transform .6s;}
        .lr-btn:hover .lr-sh{transform:translateX(100%);}
        @keyframes lrBG{from{box-shadow:0 6px 20px rgba(99,102,241,0.32)}to{box-shadow:0 6px 28px rgba(168,85,247,0.44)}}

        /* MSG */
        .lr-msg{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 14px;border-radius:11px;margin-top:12px;font-size:12px;font-weight:600;animation:lrMI .4s ease;}
        .lr-msg.ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;}
        .lr-msg.er{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;}
        .lr-msg svg{width:14px;height:14px;flex-shrink:0;}
        @keyframes lrMI{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

        /* SECURE */
        .lr-sc{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:18px;font-size:11px;color:#cbd5e1;}
        .lr-sc svg{width:11px;height:11px;}

        @media(max-width:480px){.lr-card{max-width:100%;}.lr-body{padding:24px 20px 28px;}}
      `}</style>

      <form onSubmit={handleSubmit(SendRegisterData)} className="lr">
        {/* BG */}
        <div className="lr-grid"/>
        <div className="lr-orb lr-o1"/><div className="lr-orb lr-o2"/>
        <div className="lr-orb lr-o3"/><div className="lr-orb lr-o4"/>

        {BG.particles.map((p,i)=>(
          <div key={i} className="lr-pt" style={{width:p.s,height:p.s,background:p.c,left:p.l,top:p.t,animationDuration:p.dur,animationDelay:p.del,boxShadow:`0 0 ${p.s*2}px ${p.c}`}}/>
        ))}

        {BG.geos.map((g,i)=>{
          const b={position:'absolute',pointerEvents:'none','--r0':g.r0,'--r1':g.r1,top:g.top,left:g.left,animationDuration:g.dur,animationDelay:g.del}
          if(g.type==='sq') return <div key={i} className="lr-geo" style={{...b,width:g.s,height:g.s,background:g.c,borderRadius:3,animationName:'lrGIn,lrGF'}}/>
          if(g.type==='ci') return <div key={i} className="lr-geo" style={{...b,width:g.s,height:g.s,background:g.c,borderRadius:'50%',animationName:'lrGIn,lrGF'}}/>
          if(g.type==='rg') return <div key={i} className="lr-geo" style={{...b,width:g.s,height:g.s,border:`2px solid ${g.c}`,borderRadius:'50%',background:'transparent',animationName:'lrGIn,lrGF'}}/>
          return null
        })}

        <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:1,pointerEvents:'none'}}>
          {[0,1,2].map(i=><div key={i} className="lr-pr" style={{width:360,height:360,marginLeft:-180,marginTop:-180}}/>)}
        </div>

        <div className="lr-cl" style={{top:28,left:28}}>
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            <line x1="0" y1="0" x2="68" y2="0" stroke="rgba(99,102,241,0.22)" strokeWidth="1.5"/>
            <line x1="0" y1="0" x2="0"  y2="68" stroke="rgba(99,102,241,0.22)" strokeWidth="1.5"/>
            <line x1="11" y1="11" x2="34" y2="11" stroke="rgba(168,85,247,0.18)" strokeWidth="1"/>
          </svg>
        </div>
        <div className="lr-cl" style={{bottom:28,right:28,transform:'rotate(180deg)'}}>
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            <line x1="0" y1="0" x2="68" y2="0" stroke="rgba(236,72,153,0.2)" strokeWidth="1.5"/>
            <line x1="0" y1="0" x2="0"  y2="68" stroke="rgba(236,72,153,0.2)" strokeWidth="1.5"/>
            <line x1="11" y1="11" x2="34" y2="11" stroke="rgba(251,146,60,0.16)" strokeWidth="1"/>
          </svg>
        </div>

        {/* ══ CARD ══ */}
        <div className="lr-card">

          {/* TABS */}
          <div className="lr-tabs">
            <button type="button" className="lr-tab lr-tab-on">Login</button>
            <button type="button" className="lr-tab lr-tab-off" onClick={() => navigate('/register')}>Register</button>
          </div>

          {/* BODY */}
          <div className="lr-body">

            <div className="lr-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            <div className="lr-hd">
              <h1>Welcome <span>Back</span></h1>
              <p>Log in and continue your social journey.</p>
            </div>

            {/* Email */}
            <div className="lr-f">
              <label className="lr-lbl" htmlFor="lr-email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Address
              </label>
              <div className="lr-iw">
                <input {...register('email')} id="lr-email" type="email" placeholder="name@example.com"/>
                <span className="lr-ii">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
              </div>
              {formState.errors.email && (
                <div className="lr-err">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                  {formState.errors.email.message}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="lr-f">
              <label className="lr-lbl" htmlFor="lr-pw">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Password
              </label>
              <div className="lr-iw">
                <input {...register('password')} id="lr-pw" type={showPassword ? 'text' : 'password'} placeholder="••••••••"/>
                <span className="lr-ii c" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </span>
              </div>
              {formState.errors.password && (
                <div className="lr-err">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                  {formState.errors.password.message}
                </div>
              )}
            </div>

            {/* Remember / Forgot */}
            <div className="lr-rr">
              <label className="lr-ck">
                <input type="checkbox"/>
                <span className="lr-cb">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                Remember me
              </label>
              <button type="button" className="lr-fg">Forgot password?</button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="lr-btn">
              <span className="lr-sh"/>
              {loading
                ? <RotatingLines visible height="22" width="22" strokeColor="white" strokeWidth="5" animationDuration="0.75" ariaLabel="loading"/>
                : <><span>Log In</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
              }
            </button>

            {massg && (
              <div className={`lr-msg ${massg.toLowerCase().includes('error')||massg.toLowerCase().includes('invalid')||massg.toLowerCase().includes('wrong') ? 'er' : 'ok'}`}>
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {massg}
              </div>
            )}

            <div className="lr-sc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secured with SSL encryption
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

