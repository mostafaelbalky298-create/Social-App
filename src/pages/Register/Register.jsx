import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

const RegisterSchema = z.object({
  name: z.string().min(3, 'Min Chars Is 3').max(10, 'Max Chars Is 10'),
  email: z.string().min(1, 'Email Is Required').email('Email Is Not Valid'),
  password: z.string().min(1, 'Password Is Required')
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Password is not valid'),
  rePassword: z.string().min(1, 'RePassword Is Required'),
  dateOfBirth: z.string().refine(v => new Date(v) < new Date(), 'Date must be in the Past'),
  gender: z.enum(['male', 'female']),
}).refine(v => v.password === v.rePassword, {
  message: 'Repassword Is Not Match Password',
  path: ['rePassword'],
})

export default function Register() {
  const [massg, setmassg] = useState()
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showRePw, setShowRePw] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: '', email: '', password: '', rePassword: '', dateOfBirth: '', gender: '' },
  })

  async function SendRegisterData(values) {
    setLoading(true)
    try {
      const { data } = await axios.post('https://route-posts.routemisr.com/users/signup', values)
      if (data.success) {
        setmassg(data.message)
        navigate('/login')
      }
    } catch (err) {
      setmassg(err.response?.data.error)
    } finally {
      setLoading(false)
    }
  }

  const BG = {
    particles: [
      {s:6,c:'#ec4899',l:'12%',t:'85%',dur:'9s', del:'0s'},
      {s:4,c:'#f97316',l:'25%',t:'90%',dur:'12s',del:'2s'},
      {s:8,c:'#6366f1',l:'40%',t:'80%',dur:'10s',del:'1s'},
      {s:5,c:'#a855f7',l:'60%',t:'95%',dur:'14s',del:'3s'},
      {s:3,c:'#22d3ee',l:'75%',t:'88%',dur:'8s', del:'0.5s'},
      {s:7,c:'#ec4899',l:'88%',t:'92%',dur:'11s',del:'4s'},
      {s:4,c:'#f97316',l:'5%', t:'70%',dur:'13s',del:'1.5s'},
      {s:6,c:'#6366f1',l:'50%',t:'75%',dur:'9s', del:'2.5s'},
      {s:5,c:'#a855f7',l:'33%',t:'98%',dur:'15s',del:'0s'},
      {s:3,c:'#22d3ee',l:'67%',t:'82%',dur:'10s',del:'3.5s'},
    ],
    geos: [
      {type:'sq',s:18,top:'12%',left:'8%', c:'rgba(236,72,153,0.14)', dur:'7s', del:'0s',  r0:'15deg', r1:'35deg'},
      {type:'ci',s:14,top:'18%',left:'85%',c:'rgba(249,115,22,0.14)', dur:'9s', del:'1s',  r0:'0deg',  r1:'0deg'},
      {type:'sq',s:22,top:'72%',left:'5%', c:'rgba(99,102,241,0.13)', dur:'8s', del:'0.5s',r0:'-10deg',r1:'10deg'},
      {type:'rg',s:28,top:'45%',left:'3%', c:'rgba(168,85,247,0.14)', dur:'10s',del:'1.5s',r0:'0deg',  r1:'30deg'},
      {type:'rg',s:20,top:'55%',left:'93%',c:'rgba(236,72,153,0.12)', dur:'12s',del:'0.8s',r0:'10deg', r1:'-10deg'},
      {type:'sq',s:12,top:'30%',left:'92%',c:'rgba(34,211,238,0.13)', dur:'6s', del:'3s',  r0:'45deg', r1:'65deg'},
      {type:'ci',s:10,top:'65%',left:'15%',c:'rgba(249,115,22,0.11)', dur:'8s', del:'2.5s',r0:'0deg',  r1:'0deg'},
    ]
  }

  const ErrIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
    </svg>
  )

  const EyeOpen = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
  const EyeClosed = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )

  return (
    <>
      <title>Register</title>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .rg{min-height:100vh;background:#fff;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;position:relative;overflow:hidden;padding:32px 16px;}

        /* BG */
        .rg-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(236,72,153,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(236,72,153,0.05) 1px,transparent 1px);background-size:48px 48px;}
        .rg-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(70px);opacity:0;animation:rgOrbIn 1.2s ease forwards;}
        .rg-o1{width:580px;height:580px;background:radial-gradient(circle at 40% 40%,rgba(236,72,153,0.18),rgba(249,115,22,0.08) 60%,transparent 80%);top:-200px;right:-160px;animation:rgOrbIn 1s .1s ease forwards,rgD1 12s 1.2s ease-in-out infinite;}
        .rg-o2{width:500px;height:500px;background:radial-gradient(circle at 60% 60%,rgba(99,102,241,0.16),rgba(168,85,247,0.07) 60%,transparent 80%);bottom:-180px;left:-160px;animation:rgOrbIn 1s .3s ease forwards,rgD2 14s 1.4s ease-in-out infinite;}
        .rg-o3{width:280px;height:280px;background:radial-gradient(circle,rgba(34,211,238,0.12),transparent 70%);top:30%;left:6%;animation:rgOrbIn 1s .5s ease forwards,rgD3 10s 1.6s ease-in-out infinite;}
        .rg-o4{width:220px;height:220px;background:radial-gradient(circle,rgba(249,115,22,0.11),transparent 70%);bottom:14%;right:8%;animation:rgOrbIn 1s .7s ease forwards,rgD1 9s 1.8s ease-in-out infinite reverse;}
        @keyframes rgOrbIn{to{opacity:1}}
        @keyframes rgD1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-36px) scale(1.06)}66%{transform:translate(-18px,22px) scale(.95)}}
        @keyframes rgD2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-32px,-26px) scale(1.08)}70%{transform:translate(22px,18px) scale(.94)}}
        @keyframes rgD3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(14px,-30px) scale(1.1)}}
        .rg-pt{position:absolute;border-radius:50%;pointer-events:none;opacity:0;animation:rgPt linear infinite;}
        @keyframes rgPt{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:1}90%{opacity:.5}100%{transform:translateY(-100vh) rotate(720deg);opacity:0}}
        .rg-geo{position:absolute;pointer-events:none;opacity:0;animation:rgGI 1s ease forwards,rgGF ease-in-out infinite;}
        @keyframes rgGI{to{opacity:1}}
        @keyframes rgGF{0%,100%{transform:translateY(0) rotate(var(--r0,0deg))}50%{transform:translateY(-16px) rotate(var(--r1,20deg))}}
        .rg-pr{position:absolute;border-radius:50%;border:1px solid rgba(236,72,153,0.12);pointer-events:none;animation:rgPR 4s ease-out infinite;}
        .rg-pr:nth-child(2){animation-delay:1.4s}.rg-pr:nth-child(3){animation-delay:2.8s}
        @keyframes rgPR{0%{transform:scale(.5);opacity:.7}100%{transform:scale(2.5);opacity:0}}
        .rg-cl{position:absolute;pointer-events:none;}
        .rg-cl line{stroke-dasharray:60;stroke-dashoffset:60;animation:rgCL 1.2s ease forwards;}
        .rg-cl line:nth-child(2){animation-delay:.2s}.rg-cl line:nth-child(3){animation-delay:.4s}
        @keyframes rgCL{to{stroke-dashoffset:0}}

        /* CARD */
        .rg-card{position:relative;z-index:10;width:100%;max-width:580px;background:#fff;border-radius:24px;box-shadow:0 0 0 1px rgba(236,72,153,0.1),0 20px 60px rgba(236,72,153,0.11),0 4px 16px rgba(0,0,0,0.06);overflow:hidden;animation:rgCardIn .7s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(28px);}
        @keyframes rgCardIn{to{opacity:1;transform:translateY(0)}}

        /* TABS */
        .rg-tabs{display:flex;gap:6px;background:#f8f4f9;padding:8px;border-bottom:1px solid #fce7f3;}
        .rg-tab{flex:1;padding:12px 0;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;border-radius:10px;transition:all .25s cubic-bezier(.4,0,.2,1);letter-spacing:.01em;}
        .rg-tab-on{background:#fff;color:#ec4899;box-shadow:0 2px 12px rgba(236,72,153,0.15),0 1px 3px rgba(0,0,0,0.08);cursor:default;}
        .rg-tab-off{background:transparent;color:#94a3b8;}
        .rg-tab-off:hover{background:rgba(236,72,153,0.06);color:#ec4899;}

        /* BODY */
        .rg-body{padding:32px 40px 40px;}

        /* ICON */
        .rg-icon{width:62px;height:62px;border-radius:17px;background:linear-gradient(135deg,#ec4899,#f97316);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;box-shadow:0 8px 24px rgba(236,72,153,0.3);animation:rgIcon .6s cubic-bezier(.34,1.56,.64,1) .35s both;cursor:pointer;transition:transform .3s,box-shadow .3s;}
        .rg-icon:hover{transform:rotate(-8deg) scale(1.06);box-shadow:0 12px 32px rgba(236,72,153,0.42);}
        @keyframes rgIcon{from{opacity:0;transform:scale(.5) rotate(-20deg)}to{opacity:1;transform:scale(1) rotate(0)}}
        .rg-icon svg{width:28px;height:28px;stroke:#fff;}

        /* HEADER */
        .rg-hd{text-align:center;margin-bottom:28px;}
        .rg-hd h1{font-family:'Sora',sans-serif;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-.4px;margin-bottom:5px;}
        .rg-hd h1 span{background:linear-gradient(135deg,#ec4899,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .rg-hd p{color:#94a3b8;font-size:13px;}

        /* 2-COL */
        .rg-r2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

        /* FIELD */
        .rg-f{display:flex;flex-direction:column;gap:5px;margin-bottom:16px;}
        .rg-lbl{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#475569;letter-spacing:.02em;transition:color .2s;}
        .rg-f:focus-within .rg-lbl{color:#ec4899;}
        .rg-lbl svg{width:13px;height:13px;}
        .rg-iw{position:relative;}
        .rg-iw input{width:100%;padding:11px 42px 11px 14px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:13px;font-family:'Inter',sans-serif;color:#0f172a;background:#f8fafc;outline:none;transition:border-color .25s,background .25s,box-shadow .25s;}
        .rg-iw input::placeholder{color:#cbd5e1;}
        .rg-iw input:focus{border-color:#ec4899;background:#fff;box-shadow:0 0 0 3px rgba(236,72,153,0.1);}
        .rg-iw input[type="date"]{color-scheme:light;}
        .rg-ii{position:absolute;right:13px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;transition:color .2s;}
        .rg-ii.c{pointer-events:all;cursor:pointer;}
        .rg-ii.c:hover{color:#ec4899;}
        .rg-f:focus-within .rg-ii{color:#ec4899;}
        .rg-ii svg{width:15px;height:15px;}
        .rg-err{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:#ef4444;background:#fef2f2;border:1px solid #fecaca;padding:6px 10px;border-radius:8px;animation:rgShk .4s ease;}
        .rg-err svg{width:12px;height:12px;flex-shrink:0;}
        @keyframes rgShk{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}

        /* GENDER */
        .rg-gw{display:flex;gap:8px;height:43px;}
        .rg-go{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;border:1.5px solid #e2e8f0;border-radius:12px;cursor:pointer;font-size:13px;font-weight:600;color:#64748b;background:#f8fafc;transition:all .2s;position:relative;padding:0 8px;}
        .rg-go:hover{border-color:#ec4899;color:#ec4899;background:#fdf2f8;}
        .rg-go:has(input:checked){border-color:#ec4899;background:#fdf2f8;color:#ec4899;}
        .rg-go:has(input[value="male"]:checked){border-color:#6366f1;background:#f5f3ff;color:#6366f1;}
        .rg-go input{position:absolute;opacity:0;width:0;height:0;}
        .rg-go svg{width:15px;height:15px;}
        .rg-go .mi{stroke:#6366f1;}.rg-go .fi{stroke:#ec4899;}

        /* SUBMIT */
        .rg-btn{width:100%;padding:13px;margin-top:4px;border:none;border-radius:13px;cursor:pointer;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ec4899 0%,#f97316 60%,#eab308 100%);background-size:200% 200%;box-shadow:0 6px 20px rgba(236,72,153,0.3);transition:box-shadow .3s,transform .2s,background-position .4s;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:8px;animation:rgBG 3s ease-in-out infinite alternate;}
        .rg-btn:hover:not(:disabled){box-shadow:0 10px 30px rgba(236,72,153,0.44);transform:translateY(-1px);background-position:right center;}
        .rg-btn:active:not(:disabled){transform:translateY(0);}
        .rg-btn:disabled{opacity:.65;cursor:not-allowed;}
        .rg-btn svg{width:17px;height:17px;transition:transform .3s;}
        .rg-btn:hover svg{transform:translateX(3px);}
        .rg-sh{position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.22) 50%,transparent 60%);transform:translateX(-100%);transition:transform .6s;}
        .rg-btn:hover .rg-sh{transform:translateX(100%);}
        @keyframes rgBG{from{box-shadow:0 6px 20px rgba(236,72,153,0.3)}to{box-shadow:0 6px 28px rgba(249,115,22,0.4)}}

        /* MSG */
        .rg-msg{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 14px;border-radius:11px;margin-top:14px;font-size:12px;font-weight:600;animation:rgMI .4s ease;}
        .rg-msg.ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;}
        .rg-msg.er{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;}
        .rg-msg svg{width:14px;height:14px;flex-shrink:0;}
        @keyframes rgMI{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

        /* SECURE */
        .rg-sc{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:18px;font-size:11px;color:#cbd5e1;}
        .rg-sc svg{width:11px;height:11px;}

        @media(max-width:520px){.rg-card{max-width:100%;}.rg-body{padding:24px 20px 28px;}.rg-r2{grid-template-columns:1fr;}}
      `}</style>

      <div className="rg">
        {/* BG */}
        <div className="rg-grid"/>
        <div className="rg-orb rg-o1"/><div className="rg-orb rg-o2"/>
        <div className="rg-orb rg-o3"/><div className="rg-orb rg-o4"/>

        {BG.particles.map((p,i)=>(
          <div key={i} className="rg-pt" style={{width:p.s,height:p.s,background:p.c,left:p.l,top:p.t,animationDuration:p.dur,animationDelay:p.del,boxShadow:`0 0 ${p.s*2}px ${p.c}`}}/>
        ))}

        {BG.geos.map((g,i)=>{
          const b={position:'absolute',pointerEvents:'none','--r0':g.r0,'--r1':g.r1,top:g.top,left:g.left,animationDuration:g.dur,animationDelay:g.del}
          if(g.type==='sq') return <div key={i} className="rg-geo" style={{...b,width:g.s,height:g.s,background:g.c,borderRadius:3,animationName:'rgGI,rgGF'}}/>
          if(g.type==='ci') return <div key={i} className="rg-geo" style={{...b,width:g.s,height:g.s,background:g.c,borderRadius:'50%',animationName:'rgGI,rgGF'}}/>
          if(g.type==='rg') return <div key={i} className="rg-geo" style={{...b,width:g.s,height:g.s,border:`2px solid ${g.c}`,borderRadius:'50%',background:'transparent',animationName:'rgGI,rgGF'}}/>
          return null
        })}

        <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:1,pointerEvents:'none'}}>
          {[0,1,2].map(i=><div key={i} className="rg-pr" style={{width:420,height:420,marginLeft:-210,marginTop:-210}}/>)}
        </div>

        <div className="rg-cl" style={{top:28,left:28}}>
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            <line x1="0" y1="0" x2="68" y2="0" stroke="rgba(236,72,153,0.22)" strokeWidth="1.5"/>
            <line x1="0" y1="0" x2="0"  y2="68" stroke="rgba(236,72,153,0.22)" strokeWidth="1.5"/>
            <line x1="11" y1="11" x2="34" y2="11" stroke="rgba(249,115,22,0.18)" strokeWidth="1"/>
          </svg>
        </div>
        <div className="rg-cl" style={{bottom:28,right:28,transform:'rotate(180deg)'}}>
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            <line x1="0" y1="0" x2="68" y2="0" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5"/>
            <line x1="0" y1="0" x2="0"  y2="68" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5"/>
            <line x1="11" y1="11" x2="34" y2="11" stroke="rgba(168,85,247,0.16)" strokeWidth="1"/>
          </svg>
        </div>

        {/* ══ CARD ══ */}
        <form onSubmit={handleSubmit(SendRegisterData)} className="rg-card">

          {/* TABS */}
          <div className="rg-tabs">
            <button type="button" className="rg-tab rg-tab-off" onClick={() => navigate('/login')}>Login</button>
            <button type="button" className="rg-tab rg-tab-on">Register</button>
          </div>

          {/* BODY */}
          <div className="rg-body">

            <div className="rg-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>

            <div className="rg-hd">
              <h1>Create <span>Account</span></h1>
              <p>Join us today! Fill in your details below.</p>
            </div>

            {/* Row 1: Name + Email */}
            <div className="rg-r2">
              <div className="rg-f">
                <label className="rg-lbl" htmlFor="rg-name">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Full Name
                </label>
                <div className="rg-iw">
                  <input {...register('name')} id="rg-name" type="text" placeholder="John Doe"/>
                  <span className="rg-ii">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                </div>
                {formState.errors.name && <div className="rg-err"><ErrIcon/>{formState.errors.name.message}</div>}
              </div>

              <div className="rg-f">
                <label className="rg-lbl" htmlFor="rg-email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Address
                </label>
                <div className="rg-iw">
                  <input {...register('email')} id="rg-email" type="email" placeholder="name@example.com"/>
                  <span className="rg-ii">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                </div>
                {formState.errors.email && <div className="rg-err"><ErrIcon/>{formState.errors.email.message}</div>}
              </div>
            </div>

            {/* Row 2: Password + Confirm */}
            <div className="rg-r2">
              <div className="rg-f">
                <label className="rg-lbl" htmlFor="rg-pw">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  Password
                </label>
                <div className="rg-iw">
                  <input {...register('password')} id="rg-pw" type={showPw ? 'text' : 'password'} placeholder="••••••••"/>
                  <span className="rg-ii c" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOpen/> : <EyeClosed/>}</span>
                </div>
                {formState.errors.password && <div className="rg-err"><ErrIcon/>{formState.errors.password.message}</div>}
              </div>

              <div className="rg-f">
                <label className="rg-lbl" htmlFor="rg-repw">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Confirm Password
                </label>
                <div className="rg-iw">
                  <input {...register('rePassword')} id="rg-repw" type={showRePw ? 'text' : 'password'} placeholder="••••••••"/>
                  <span className="rg-ii c" onClick={() => setShowRePw(!showRePw)}>{showRePw ? <EyeOpen/> : <EyeClosed/>}</span>
                </div>
                {formState.errors.rePassword && <div className="rg-err"><ErrIcon/>{formState.errors.rePassword.message}</div>}
              </div>
            </div>

            {/* Row 3: DOB + Gender */}
            <div className="rg-r2">
              <div className="rg-f">
                <label className="rg-lbl" htmlFor="rg-dob">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Date of Birth
                </label>
                <div className="rg-iw">
                  <input {...register('dateOfBirth')} id="rg-dob" type="date"/>
                  <span className="rg-ii">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </span>
                </div>
                {formState.errors.dateOfBirth && <div className="rg-err"><ErrIcon/>{formState.errors.dateOfBirth.message}</div>}
              </div>

              <div className="rg-f">
                <label className="rg-lbl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="5"/><path d="M12 13v9m-3-3h6"/>
                  </svg>
                  Gender
                </label>
                <div className="rg-gw">
                  <label className="rg-go">
                    <input {...register('gender')} type="radio" value="male"/>
                    <svg className="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="14" r="5"/><line x1="19" y1="5" x2="14.14" y2="9.86"/><polyline points="15 4 20 4 20 9"/>
                    </svg>
                    Male
                  </label>
                  <label className="rg-go">
                    <input {...register('gender')} type="radio" value="female"/>
                    <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/>
                    </svg>
                    Female
                  </label>
                </div>
                {formState.errors.gender && <div className="rg-err"><ErrIcon/>{formState.errors.gender.message}</div>}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="rg-btn">
              <span className="rg-sh"/>
              {loading
                ? <RotatingLines visible height="22" width="22" strokeColor="white" strokeWidth="5" animationDuration="0.75" ariaLabel="loading"/>
                : <><span>Create Account</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
              }
            </button>

            {massg && (
              <div className={`rg-msg ${massg.toLowerCase().includes('error')||massg.toLowerCase().includes('invalid') ? 'er' : 'ok'}`}>
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {massg}
              </div>
            )}

            <div className="rg-sc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secured with SSL encryption
            </div>
          </div>
        </form>
      </div>
    </>
  )
}


    