import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_BACKEND_URL ;
const getToken = () => localStorage.getItem("token");
const authH    = () => ({ Authorization: `Bearer ${getToken()}` });
const today    = () => new Date().toISOString().split("T")[0];
const tomorrow = () => new Date(Date.now()+86400000).toISOString().split("T")[0];
const nights   = (ci,co) => ci&&co ? Math.max(0,Math.ceil((new Date(co)-new Date(ci))/86400000)) : 0;

/* ── shared styles ── */
const G = { background:"linear-gradient(135deg,#060914 0%,#0a0f22 60%,#060914 100%)", minHeight:"100vh", fontFamily:"'Jost',sans-serif", color:"white" };
const glass = { background:"rgba(8,12,28,0.82)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)" };
const inp   = { background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.13)", color:"white", borderRadius:"10px", outline:"none", fontFamily:"'Jost',sans-serif" };
const goldBtn = { background:"linear-gradient(135deg,#F5A623,#FFB84D)", color:"#1a0f00", fontWeight:700, border:"none", cursor:"pointer", fontFamily:"'Jost',sans-serif" };

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,700&family=Jost:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px}
  input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(1) opacity(.45);cursor:pointer}
  input[type="date"]{color-scheme:dark}
  select option{background:#0a0f22;color:white}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fadeUp .45s ease both}
  .fu1{animation-delay:.05s}.fu2{animation-delay:.1s}.fu3{animation-delay:.15s}.fu4{animation-delay:.2s}
  .room-card:hover{border-color:rgba(245,166,35,0.22)!important;transform:translateY(-4px);box-shadow:0 18px 50px rgba(0,0,0,.5)}
  .room-card{transition:all .28s ease;cursor:pointer}
  .hover-gold:hover{color:#F5A623!important}
`;

/* ── icons ── */
const I = {
  back:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6"/></svg>,
  next:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>,
  search:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  cal:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  bed:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><path d="M2 20v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/><path d="M2 15h20"/></svg>,
  map:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  check:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  x:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  shield:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  filter:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  bank:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  card:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  wifi:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  ac:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M12 17v4"/><path d="M7 11h.01M12 11h.01M17 11h.01"/></svg>,
  tv:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>,
  park:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>,
  water:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  mini:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>,
};
const Spin = () => <svg style={{animation:"spin .7s linear infinite",display:"inline"}} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.2)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
function Logo(){return(<svg width="26" height="26" viewBox="0 0 32 32" fill="none"><polygon points="16,2 28,14 16,26 4,14" fill="none" stroke="#F5A623" strokeWidth="2"/><polygon points="16,7 23,14 16,21 9,14" fill="#F5A623" opacity=".35"/><circle cx="16" cy="14" r="3" fill="#F5A623"/></svg>);}

/* ── shared navbar ── */
function Nav({back,backLabel="Back"}){
  const nav=useNavigate();
  return(
    <nav style={{background:"rgba(6,9,20,.92)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,.06)",position:"sticky",top:0,zIndex:30,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",height:"60px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"}} onClick={()=>nav("/")}><Logo/><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"18px",fontWeight:700,color:"white"}}>Kadiraa</span></div>
      <button onClick={back||(()=>nav(-1))} className="hover-gold" style={{display:"flex",alignItems:"center",gap:"5px",background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:"13px",fontFamily:"'Jost',sans-serif",transition:"color .2s"}}>
        {I.back} {backLabel}
      </button>
    </nav>
  );
}

/* ── facility pills ── */
const FAC_MAP={ac:{i:I.ac,l:"Air Conditioning"},wifi:{i:I.wifi,l:"Free WiFi"},parking:{i:I.park,l:"Free Parking"},tv:{i:I.tv,l:"Smart TV"},hotWater:{i:I.water,l:"Hot Water"},miniBar:{i:I.mini,l:"Mini Bar"}};

/* ── loading screen ── */
function Loading(){return(<div style={{...G,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{FONTS}</style><div style={{textAlign:"center"}}><Spin/><p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(255,255,255,.5)",fontSize:"18px",marginTop:"14px"}}>Loading…</p></div></div>);}

/* ══════════════════════════════════════════════════
   PAGE 1 — SEARCH + RESULTS
══════════════════════════════════════════════════ */
export function RoomSearchPage({ embedded = false }){
  const nav=useNavigate();
  const [sp]=useSearchParams();

  const [f,setF]=useState({
    checkIn:  sp.get("checkIn")  || today(),
    checkOut: sp.get("checkOut") || tomorrow(),
    guests:   sp.get("guests")   || "",
    roomType: "",
    hotel:    sp.get("hotel")    || "",
  });
  const [results,setResults]=useState([]);
  const [hotels,setHotels]  =useState([]);
  const [searched,setSearched]=useState(false);
  const [loading,setLoading]  =useState(false);
  const [err,setErr]          =useState("");
  const [showAdv,setShowAdv]  =useState(false);

  useEffect(()=>{
    axios.get(`${BASE}/api/hotels`).then(r=>setHotels(r.data)).catch(()=>{});
    // auto-search if dates came from landing page
    if(sp.get("checkIn")&&sp.get("checkOut")) doSearch(sp.get("checkIn"),sp.get("checkOut"),sp.get("guests")||"",sp.get("hotel")||"");
  },[]);

  async function doSearch(ci=f.checkIn,co=f.checkOut,g=f.guests,h=f.hotel){
    if(!ci||!co){setErr("Please select check-in and check-out dates.");return;}
    if(new Date(ci)>=new Date(co)){setErr("Check-out must be after check-in.");return;}
    setErr("");setLoading(true);
    try{
      const p=new URLSearchParams({checkIn:ci,checkOut:co});
      if(g) p.append("guests",g);
      if(f.roomType) p.append("roomType",f.roomType);
      if(h) p.append("hotelName",h);
      const res=await axios.get(`${BASE}/api/rooms/search?${p}`);
      setResults(res.data);setSearched(true);
    }catch(e){setErr("Search failed. Please try again.");}
    setLoading(false);
  }

  const n=nights(f.checkIn,f.checkOut);
  const TYPES=["Standard","Deluxe","Suite","Family Suite","Pool Villa","Garden Cottage"];

  return(
    <div style={G}>
      <style>{FONTS}</style>
      {!embedded && <Nav backLabel="Home" back={()=>nav("/")}/>}

      {/* hero + search bar */}
      <div style={{position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.18,backgroundImage:"url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=60')",backgroundSize:"cover",backgroundPosition:"center"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(6,9,20,.55),rgba(6,9,20,.97))"}}/>
        <div style={{position:"relative",zIndex:10,maxWidth:"920px",margin:"0 auto",padding:"48px 24px 36px",textAlign:"center"}}>
          <div style={{width:"32px",height:"2px",background:"#F5A623",borderRadius:"2px",margin:"0 auto 14px"}}/>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,46px)",fontWeight:700,color:"white",margin:"0 0 6px"}}>Check Availability</h1>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:"14px",fontWeight:300,margin:"0 0 28px"}}>Find the perfect room for your dates</p>

          {/* search card */}
          <div style={{...glass,borderRadius:"18px",padding:"18px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:"10px",alignItems:"end"}}>
              {/* check-in */}
              <div style={{textAlign:"left"}}>
                <label style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:"7px"}}>{I.cal} Check-In</label>
                <input type="date" min={today()} value={f.checkIn} onChange={e=>setF({...f,checkIn:e.target.value})} style={{...inp,width:"100%",height:"42px",padding:"0 12px",fontSize:"13px"}}/>
              </div>
              {/* check-out */}
              <div style={{textAlign:"left"}}>
                <label style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:"7px"}}>{I.cal} Check-Out</label>
                <input type="date" min={f.checkIn||today()} value={f.checkOut} onChange={e=>setF({...f,checkOut:e.target.value})} style={{...inp,width:"100%",height:"42px",padding:"0 12px",fontSize:"13px"}}/>
              </div>
              {/* guests */}
              <div style={{textAlign:"left"}}>
                <label style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:"7px"}}>{I.users} Guests</label>
                <select value={f.guests} onChange={e=>setF({...f,guests:e.target.value})} style={{...inp,width:"100%",height:"42px",padding:"0 12px",fontSize:"13px",appearance:"none"}}>
                  <option value="">Any</option>
                  {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                </select>
              </div>
              {/* search btn */}
              <button onClick={()=>doSearch()} disabled={loading} style={{...goldBtn,height:"42px",padding:"0 22px",borderRadius:"10px",fontSize:"13px",display:"flex",alignItems:"center",gap:"7px",whiteSpace:"nowrap",opacity:loading?.65:1}}>
                {loading?<Spin/>:I.search} {loading?"Searching…":"Search"}
              </button>
            </div>

            {/* advanced filters toggle */}
            <button onClick={()=>setShowAdv(v=>!v)} style={{display:"flex",alignItems:"center",gap:"6px",background:"none",border:"none",color:"rgba(245,166,35,.7)",cursor:"pointer",fontSize:"12px",fontWeight:600,fontFamily:"'Jost',sans-serif",marginTop:"12px"}}>
              {I.filter} Filters {showAdv?"▲":"▼"}
            </button>

            {showAdv&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginTop:"10px",paddingTop:"10px",borderTop:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{textAlign:"left"}}>
                  <label style={{display:"block",fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:"7px"}}>Room Type</label>
                  <select value={f.roomType} onChange={e=>setF({...f,roomType:e.target.value})} style={{...inp,width:"100%",height:"42px",padding:"0 12px",fontSize:"13px",appearance:"none"}}>
                    <option value="">All Types</option>
                    {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{textAlign:"left"}}>
                  <label style={{display:"block",fontSize:"10px",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:"7px"}}>Hotel</label>
                  <select value={f.hotel} onChange={e=>setF({...f,hotel:e.target.value})} style={{...inp,width:"100%",height:"42px",padding:"0 12px",fontSize:"13px",appearance:"none"}}>
                    <option value="">All Hotels</option>
                    {hotels.map(h=><option key={h.hotelId} value={h.name}>{h.name}</option>)}
                  </select>
                </div>
              </div>
            )}

            {err&&<p style={{marginTop:"10px",color:"#f87171",fontSize:"13px",display:"flex",alignItems:"center",gap:"6px",margin:"10px 0 0"}}>{I.x} {err}</p>}
          </div>

          {/* date summary pill */}
          {f.checkIn&&f.checkOut&&n>0&&(
            <div style={{display:"inline-flex",alignItems:"center",gap:"8px",marginTop:"12px",padding:"6px 14px",borderRadius:"20px",background:"rgba(245,166,35,.08)",border:"1px solid rgba(245,166,35,.2)",color:"rgba(255,255,255,.6)",fontSize:"12px"}}>
              📅 {f.checkIn} → {f.checkOut} · <strong style={{color:"#F5A623"}}>{n} night{n>1?"s":""}</strong>
              {f.guests&&<> · {f.guests} guest{f.guests>1?"s":""}</>}
            </div>
          )}
        </div>
      </div>

      {/* results */}
      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"32px 24px 80px"}}>
        {!searched&&!loading&&(
          <div style={{textAlign:"center",padding:"60px 20px",opacity:.45}}>
            <div style={{fontSize:"44px",marginBottom:"12px"}}>🔍</div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"20px",color:"white",margin:"0 0 6px"}}>Select your dates to search</p>
            <p style={{color:"rgba(255,255,255,.35)",fontSize:"13px"}}>Enter check-in, check-out and hit Search</p>
          </div>
        )}

        {searched&&!loading&&(
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px",flexWrap:"wrap",gap:"10px"}}>
              <div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"26px",fontWeight:700,color:"white",margin:"0 0 3px"}}>
                  {results.length} Room{results.length!==1?"s":""} Available
                </h2>
                <p style={{color:"rgba(255,255,255,.35)",fontSize:"13px",margin:0}}>{f.checkIn} → {f.checkOut}{f.guests?` · ${f.guests} guest${f.guests>1?"s":""}`:""}</p>
              </div>
            </div>

            {results.length===0?(
              <div style={{...glass,borderRadius:"20px",padding:"60px",textAlign:"center"}}>
                <div style={{fontSize:"40px",marginBottom:"14px"}}>🛏</div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"22px",color:"white",margin:"0 0 8px"}}>No rooms available for these dates</p>
                <p style={{color:"rgba(255,255,255,.4)",fontSize:"14px",margin:"0 0 20px"}}>Try different dates or remove some filters</p>
                <button onClick={()=>{setF({...f,checkIn:"",checkOut:""});setSearched(false);}} style={{...goldBtn,padding:"10px 22px",borderRadius:"10px",fontSize:"13px"}}>Clear & Try Again</button>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:"18px"}}>
                {results.map((room,i)=>(
                  <RoomCard key={room.key} room={room} delay={i*.07}
                    onSelect={()=>nav(`/rooms/${room.key}`,{state:{checkIn:f.checkIn,checkOut:f.checkOut,guests:f.guests}})}/>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── room card ── */
function RoomCard({room,delay,onSelect}){
  const FACS=[{k:"ac",i:I.ac,l:"AC"},{k:"wifi",i:I.wifi,l:"WiFi"},{k:"parking",i:I.park,l:"Parking"},{k:"miniBar",i:I.mini,l:"Mini Bar"}];
  return(
    <div className="room-card" onClick={onSelect}
      style={{...glass,borderRadius:"18px",overflow:"hidden",animation:`fadeUp .45s ease ${delay}s both`}}>
      <div style={{position:"relative",height:"195px",overflow:"hidden"}}>
        <img src={room.images?.[0]} alt={room.roomType}
          onError={e=>e.target.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75"}
          style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .5s ease"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(6,9,20,.8) 0%,transparent 55%)"}}/>
        <div style={{position:"absolute",bottom:"12px",left:"14px"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"20px",fontWeight:700,color:"#F5A623"}}>
            LKR {room.price?.toLocaleString()}<span style={{color:"rgba(255,255,255,.4)",fontSize:"11px",fontFamily:"'Jost',sans-serif",fontWeight:300}}>/night</span>
          </span>
        </div>
        <span style={{position:"absolute",top:"10px",right:"10px",padding:"3px 10px",borderRadius:"20px",fontSize:"10px",fontWeight:700,background:"rgba(52,211,153,.15)",color:"#34d399",border:"1px solid rgba(52,211,153,.3)"}}>Available</span>
      </div>
      <div style={{padding:"14px 16px 18px"}}>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:"10px",textTransform:"uppercase",letterSpacing:"1.5px",margin:"0 0 3px",fontWeight:600}}>{room.hotelName}</p>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"18px",fontWeight:700,color:"white",margin:"0 0 7px"}}>{room.roomType}</h3>
        <div style={{display:"flex",gap:"14px",color:"rgba(255,255,255,.4)",fontSize:"12px",marginBottom:"10px"}}>
          <span style={{display:"flex",alignItems:"center",gap:"4px"}}>{I.bed} Room {room.roomNumber}</span>
          <span style={{display:"flex",alignItems:"center",gap:"4px"}}>{I.users} Max {room.capacity}</span>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"14px"}}>
          {FACS.filter(f=>room.facilities?.[f.k]).map(f=>(
            <span key={f.k} style={{padding:"3px 9px",borderRadius:"8px",fontSize:"10px",fontWeight:700,background:"rgba(245,166,35,.08)",color:"#FCD34D",border:"1px solid rgba(245,166,35,.15)"}}>
              {f.i} {f.l}
            </span>
          ))}
        </div>
        <button style={{...goldBtn,width:"100%",height:"38px",borderRadius:"10px",fontSize:"13px",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
          View & Book {I.next}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE 2 — ROOM DETAILS
══════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════
   SHARED SITE THEME STYLES
══════════════════════════════════════════════════ */
const SITE_BG  = "#FAF7F2";
const CARD_BG  = "#FFFBF5";
const AMBER    = "#D97706";
const AMBER_LT = "#FBBF24";
const TEXT     = "#292524";
const MUTED    = "#78716C";
const BORDER   = "#F5EACF";
const inp2     = { background:"#FEF3C7", border:"1.5px solid #FCD34D", color:TEXT, borderRadius:"12px", outline:"none", fontSize:"14px", padding:"10px 14px", width:"100%", colorScheme:"light" };
const card2    = { background:CARD_BG, borderRadius:"20px", border:`1px solid ${BORDER}`, boxShadow:"0 4px 24px rgba(217,119,6,0.08)" };
const goldBtn2 = { background:`linear-gradient(135deg,${AMBER_LT},${AMBER})`, color:"#1C1917", fontWeight:700, border:"none", cursor:"pointer", borderRadius:"12px" };
const FAC_LABELS = { ac:"Air Conditioning", wifi:"Free WiFi", parking:"Free Parking", tv:"Smart TV", hotWater:"Hot Water", miniBar:"Mini Bar" };
const FAC_ICONS  = { ac:"❄️", wifi:"📶", parking:"🅿️", tv:"📺", hotWater:"🚿", miniBar:"🍾" };

/* ══════════════════════════════════════════════════
   PAGE 2 — ROOM DETAILS  (site theme)
══════════════════════════════════════════════════ */
export function RoomDetailsPage({ embedded = false }) {
  const { key } = useParams();
  const loc     = useLocation();
  const nav     = useNavigate();
  const st      = loc.state || {};

  const [room,     setRoom]     = useState(null);
  const [hotel,    setHotel]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [activeImg,setActiveImg]= useState(0);
  const [checkIn,  setCheckIn]  = useState(st.checkIn  || "");
  const [checkOut, setCheckOut] = useState(st.checkOut || "");

  const n     = nights(checkIn, checkOut);
  const sub   = room ? room.price * n : 0;
  const tax   = Math.round(sub * 0.1);
  const total = sub + tax;

  useEffect(() => {
    axios.get(`${BASE}/api/rooms/${key}`)
      .then(r => {
        setRoom(r.data);
        setLoading(false);
        // Fetch hotel to get its image
        axios.get(`${BASE}/api/hotels`)
          .then(hr => {
            const found = hr.data.find(h => h.name === r.data.hotelName);
            if (found) setHotel(found);
          })
          .catch(() => {});
      })
      .catch(() => setLoading(false));
  }, [key]);

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:SITE_BG }}>
      <div className="w-12 h-12 border-4 rounded-full border-t-amber-500 animate-spin" />
    </div>
  );

  if (!room) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:SITE_BG }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"48px", marginBottom:"16px" }}>🛏</div>
        <p style={{ fontFamily:"Georgia,serif", fontSize:"22px", color:TEXT, margin:"0 0 12px" }}>Room not found</p>
        <button onClick={() => nav(-1)} style={{ color:AMBER, background:"none", border:"none", cursor:"pointer", fontSize:"14px", fontWeight:600 }}>← Go back</button>
      </div>
    </div>
  );

  const imgs = room.images?.filter(Boolean).length ? room.images : ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80"];

  return (
    <div style={{ minHeight:"100vh", background:SITE_BG, fontFamily:"'Outfit',sans-serif" }}>

      {/* ── Topbar — hidden when site header is present ── */}
      {!embedded && (
      <div style={{ background:CARD_BG, borderBottom:`1px solid ${BORDER}`, padding:"0 28px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:30, boxShadow:"0 2px 12px rgba(217,119,6,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }} onClick={() => nav("/rooms")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ fontSize:"14px", fontWeight:600, color:MUTED }}>Resort Rooms</span>
        </div>
        <span style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:700, color:TEXT }}>
          Wild<span style={{ color:AMBER }}>Haven</span>
        </span>
        <button onClick={() => nav("/rooms")} style={{ fontSize:"13px", color:MUTED, background:"none", border:"none", cursor:"pointer", fontWeight:500 }}>
          ✕ Close
        </button>
      </div>
      )}

      {/* Back breadcrumb shown when embedded */}
      {embedded && (
        <div style={{ padding:"16px 28px 0", maxWidth:"1100px", margin:"0 auto" }}>
          <button onClick={() => nav("/rooms")} style={{ display:"flex", alignItems:"center", gap:"6px", background:"none", border:"none", cursor:"pointer", color:MUTED, fontSize:"13px", fontWeight:600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Resort Rooms
          </button>
        </div>
      )}

      <div style={{ maxWidth:"1100px", margin:"0 auto", padding: embedded ? "16px 24px 80px" : "32px 24px 80px" }}>

        {/* ── Image Gallery ── */}
        <div style={{ display:"grid", gridTemplateColumns:"3fr 1fr", gridTemplateRows:"210px 210px", gap:"8px", borderRadius:"24px", overflow:"hidden", marginBottom:"32px" }}>
          <div style={{ gridRow:"1/3", overflow:"hidden", position:"relative", cursor:"pointer" }}>
            <img src={imgs[activeImg]} alt={room.roomType}
              onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80"; }}
              style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
              onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
            />
          </div>
          {[1, 2].map(i => (
            <div key={i} onClick={() => setActiveImg(imgs[i] ? i : 0)}
              style={{ overflow:"hidden", cursor:"pointer", position:"relative" }}>
              <img src={imgs[i] || imgs[0]}
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=75"; }}
                alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"all .3s", opacity: activeImg === i ? 1 : 0.7 }}
                onMouseEnter={e => e.currentTarget.style.opacity="1"}
                onMouseLeave={e => e.currentTarget.style.opacity = activeImg === i ? "1" : "0.7"}
              />
            </div>
          ))}
        </div>

        {/* ── Main layout ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"28px", alignItems:"start" }}>

          {/* LEFT */}
          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

            {/* Title */}
            <div>
              {/* Hotel name with thumbnail */}
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"10px" }}>
                <div style={{ width:"48px", height:"48px", borderRadius:"12px", overflow:"hidden", border:`2px solid ${BORDER}`, flexShrink:0, boxShadow:"0 2px 8px rgba(217,119,6,0.15)" }}>
                  <img
                    src={hotel?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"}
                    alt={room.hotelName}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80"; }}
                  />
                </div>
                <div>
                  <p style={{ color:AMBER, fontSize:"13px", fontWeight:700, margin:"0 0 2px" }}>{room.hotelName}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    {hotel?.location && (
                      <span style={{ color:MUTED, fontSize:"12px", display:"flex", alignItems:"center", gap:"3px" }}>
                        📍 {hotel.location}
                      </span>
                    )}
                    {hotel?.starRating && (
                      <span style={{ color:AMBER_LT, fontSize:"12px" }}>{"★".repeat(hotel.starRating)}</span>
                    )}
                  </div>
                </div>
              </div>
              <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(26px,3.5vw,42px)", fontWeight:700, color:TEXT, margin:"0 0 12px" }}>
                {room.roomType}
              </h1>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"14px", color:MUTED, fontSize:"14px", alignItems:"center" }}>
                <span>🛏 Room {room.roomNumber}</span>
                <span>👥 Up to {room.capacity} guests</span>
                <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:700, background:"rgba(5,150,105,0.1)", color:"#059669", border:"1px solid rgba(5,150,105,0.25)" }}>
                  ✓ Available
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{ ...card2, padding:"22px 24px" }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:"18px", color:TEXT, margin:"0 0 10px" }}>About this room</h3>
              <p style={{ color:MUTED, fontSize:"14px", lineHeight:1.75, margin:0 }}>
                {room.description || room.hotelName}
              </p>
            </div>

            {/* Amenities */}
            <div style={{ ...card2, padding:"22px 24px" }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:"18px", color:TEXT, margin:"0 0 16px" }}>Amenities</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
                {Object.entries(FAC_LABELS).map(([k, label]) => {
                  const has = room.facilities?.[k];
                  return (
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 14px", borderRadius:"12px", fontSize:"13px", fontWeight:600,
                      background: has ? "rgba(217,119,6,0.06)" : "rgba(0,0,0,0.02)",
                      border: `1px solid ${has ? "rgba(217,119,6,0.2)" : BORDER}`,
                      color: has ? AMBER : "#C4B5AA", opacity: has ? 1 : 0.6 }}>
                      <span>{FAC_ICONS[k]}</span>
                      <span style={{ flex:1 }}>{label}</span>
                      <span style={{ fontSize:"12px" }}>{has ? "✓" : "✗"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Policies */}
            <div style={{ ...card2, padding:"22px 24px" }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:"18px", color:TEXT, margin:"0 0 16px" }}>Policies</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
                {[["Check-in","From 2:00 PM"],["Check-out","Before 12:00 PM"],["Cancellation","Free up to 48h"]].map(([l, v]) => (
                  <div key={l} style={{ textAlign:"center", padding:"16px 12px", borderRadius:"12px", background:"rgba(217,119,6,0.04)", border:`1px solid ${BORDER}` }}>
                    <p style={{ color:MUTED, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 5px" }}>{l}</p>
                    <p style={{ color:TEXT, fontSize:"13px", fontWeight:700, margin:0 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — booking card */}
          <div style={{ position:"sticky", top:"76px" }}>
            <div style={{ ...card2 }}>
              <div style={{ padding:"22px 22px 0" }}>
                <p style={{ color:MUTED, fontSize:"10px", textTransform:"uppercase", letterSpacing:"1.5px", margin:"0 0 4px" }}>Nightly rate</p>
                <p style={{ fontFamily:"Georgia,serif", fontSize:"32px", fontWeight:700, color:AMBER, margin:"0 0 20px" }}>
                  LKR {room.price?.toLocaleString()}<span style={{ color:MUTED, fontSize:"13px", fontFamily:"sans-serif", fontWeight:400 }}>/night</span>
                </p>

                {/* Date pickers */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
                  {[["CHECK-IN", checkIn, setCheckIn], ["CHECK-OUT", checkOut, setCheckOut]].map(([l, v, set]) => (
                    <div key={l}>
                      <label style={{ display:"block", fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:MUTED, marginBottom:"6px" }}>{l}</label>
                      <input type="date" min={today()} value={v} onChange={e => set(e.target.value)} style={{ ...inp2, height:"42px", padding:"0 12px", fontSize:"13px" }} />
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:"14px", marginBottom:"16px", minHeight:"60px" }}>
                  {n > 0 ? (
                    <>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"6px", color:MUTED }}>
                        <span>LKR {room.price?.toLocaleString()} × {n} night{n > 1 ? "s" : ""}</span>
                        <span style={{ fontWeight:600, color:TEXT }}>LKR {sub.toLocaleString()}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"10px", color:MUTED }}>
                        <span>Taxes & fees (10%)</span>
                        <span style={{ fontWeight:600, color:TEXT }}>LKR {tax.toLocaleString()}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:"16px", borderTop:`1px solid ${BORDER}`, paddingTop:"10px" }}>
                        <span style={{ color:TEXT }}>Total</span>
                        <span style={{ color:AMBER }}>LKR {total.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <p style={{ color:MUTED, fontSize:"13px", textAlign:"center", margin:"8px 0" }}>Select dates to see price</p>
                  )}
                </div>
              </div>

              <div style={{ padding:"0 22px 22px" }}>
                <button
                  disabled={!checkIn || !checkOut || n <= 0}
                  onClick={() => {
                    if (!getToken()) {
                      nav("/login", {
                        state: {
                          from: `/rooms/${room.key}/book`,
                          checkIn,
                          checkOut,
                          guests: st.guests || "",
                        },
                      });
                      return;
                    }
                    nav(`/rooms/${room.key}/book`, { state: { checkIn, checkOut, guests: st.guests || "" } });
                  }}
                  style={{ ...goldBtn2, width:"100%", height:"50px", fontSize:"15px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                    opacity:(checkIn && checkOut && n > 0) ? 1 : 0.4,
                    background:(checkIn && checkOut && n > 0) ? `linear-gradient(135deg,${AMBER_LT},${AMBER})` : BORDER,
                    color:(checkIn && checkOut && n > 0) ? "#1C1917" : MUTED,
                    cursor:(checkIn && checkOut && n > 0) ? "pointer" : "not-allowed" }}>
                  {(checkIn && checkOut && n > 0) ? "Reserve Now →" : "Select dates to continue"}
                </button>
                <p style={{ textAlign:"center", color:MUTED, fontSize:"11px", margin:"10px 0 0", display:"flex", alignItems:"center", justifyContent:"center", gap:"4px" }}>
                  🔒 Free cancellation · No hidden fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE 3 — BOOKING FORM  (site theme)
══════════════════════════════════════════════════ */
export function RoomBookingFormPage({ embedded = false }) {
  const { key } = useParams();
  const loc     = useLocation();
  const nav     = useNavigate();
  const st      = loc.state || {};

  const [room,       setRoom]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err,        setErr]        = useState("");
  const [success,    setSuccess]    = useState(null);

  const [form, setForm] = useState({
    checkInDate:     st.checkIn  || "",
    checkOutDate:    st.checkOut || "",
    numberOfGuests:  parseInt(st.guests) || 1,
    specialRequests: "",
    paymentMethod:   "bank_deposit",
  });

  const n     = nights(form.checkInDate, form.checkOutDate);
  const sub   = room ? room.price * n : 0;
  const tax   = Math.round(sub * 0.1);
  const total = sub + tax;

  useEffect(() => {
    if (!getToken()) {
        nav("/login", {
          state: {
            from: `/rooms/${key}/book`,
            checkIn:  st.checkIn,
            checkOut: st.checkOut,
            guests:   st.guests,
          }
        });
        return;
      }
    axios.get(`${BASE}/api/rooms/${key}`)
      .then(r => { setRoom(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [key]);

  async function submit() {
    if (!form.checkInDate || !form.checkOutDate) { setErr("Please select check-in and check-out dates."); return; }
    if (n <= 0) { setErr("Check-out must be after check-in."); return; }
    if (form.numberOfGuests > room.capacity) { setErr(`Max ${room.capacity} guests for this room.`); return; }
    setErr(""); setSubmitting(true);
    try {
      const res = await axios.post(`${BASE}/api/rooms/bookings/create`, {
        roomKey:        room.key,
        checkInDate:    form.checkInDate,
        checkOutDate:   form.checkOutDate,
        numberOfGuests: form.numberOfGuests,
        specialRequests:form.specialRequests,
        paymentMethod:  form.paymentMethod,
        totalAmount:    total,
      }, { headers: authH() });
      setSuccess({ bookingId: res.data.bookingId, total, email: JSON.parse(atob(localStorage.getItem("token").split(".")[1]||"e30="))?.email || "" });
    } catch (e) {
      const msg = e.response?.data?.message || "Booking failed. Please try again.";
      setErr(msg);
      toast.error(msg);
    }
    setSubmitting(false);
  }

  const Spinner = () => <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:`${AMBER_LT} transparent ${AMBER_LT} ${AMBER_LT}` }} />;

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:SITE_BG }}>
      <div className="w-12 h-12 border-4 rounded-full border-t-amber-500 animate-spin" />
    </div>
  );

  if (!room) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:SITE_BG }}>
      <p style={{ fontFamily:"Georgia,serif", fontSize:"22px", color:TEXT }}>Room not found</p>
    </div>
  );

  /* ── Success screen ── */
  if (success) return (
    <div style={{ minHeight:"100vh", background:SITE_BG, fontFamily:"'Outfit',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <div style={{ maxWidth:"520px", width:"100%", textAlign:"center" }}>

        <div style={{ width:"80px", height:"80px", borderRadius:"24px", background:"rgba(5,150,105,0.1)", border:"2px solid rgba(5,150,105,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:"36px" }}>🎉</div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:"32px", fontWeight:700, color:TEXT, margin:"0 0 10px" }}>Booking Confirmed!</h1>
        <p style={{ color:MUTED, fontSize:"15px", lineHeight:1.7, marginBottom:"28px" }}>Your reservation has been received. We'll review your payment and confirm shortly.</p>

        {/* Summary card */}
        <div style={{ ...card2, padding:"22px", marginBottom:"20px", textAlign:"left" }}>
          {[["Booking ID",success.bookingId],["Room",`${room.roomType} · Room ${room.roomNumber}`],["Hotel",room.hotelName],["Check-In",form.checkInDate],["Check-Out",form.checkOutDate],["Nights",`${n} night${n>1?"s":""}`],["Guests",`${form.numberOfGuests}`],["Total",`LKR ${success.total.toLocaleString()}`],["Payment",form.paymentMethod==="bank_deposit"?"Bank Deposit":form.paymentMethod==="checkout"?"Pay at Checkout":"Online"]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${BORDER}` }}>
              <span style={{ color:MUTED, fontSize:"13px" }}>{l}</span>
              <span style={{ color:l==="Total"?AMBER:TEXT, fontSize:"13px", fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>

        {form.paymentMethod === "bank_deposit" && (
          <div style={{ background:"rgba(217,119,6,0.06)", border:`1px solid ${BORDER}`, borderRadius:"16px", padding:"18px", marginBottom:"20px", textAlign:"left", fontSize:"13px", color:MUTED, lineHeight:1.75 }}>
            <strong style={{ color:AMBER, display:"block", marginBottom:"6px" }}>Bank Transfer Details</strong>
            Bank: Commercial Bank of Ceylon<br/>
            Account: Kadiraa Tourism Pvt Ltd<br/>
            Account No: 1234 5678 9012<br/>
            Amount: <strong style={{ color:AMBER }}>LKR {success.total.toLocaleString()}</strong><br/>
            <span style={{ color:MUTED, fontSize:"12px" }}>Reference: {success.bookingId}</span>
          </div>
        )}

        {form.paymentMethod === "checkout" && (
          <div style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:"16px", padding:"18px", marginBottom:"20px", textAlign:"left", fontSize:"13px", color:MUTED, lineHeight:1.75 }}>
            <strong style={{ color:"#059669", display:"block", marginBottom:"6px" }}>✅ Booking Confirmed — Pay at Checkout</strong>
            Your room is reserved. No payment needed now.<br/>
            Amount due at checkout: <strong style={{ color:AMBER }}>LKR {success.total.toLocaleString()}</strong><br/>
            <span style={{ fontSize:"12px" }}>Our team will send your detailed bill to <strong>{success.email}</strong> before your checkout date.</span>
          </div>
        )}

        <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
          <button onClick={() => nav("/my-bookings")} style={{ ...goldBtn2, padding:"12px 24px", fontSize:"14px" }}>View My Bookings</button>
          <button onClick={() => nav("/")} style={{ padding:"12px 24px", borderRadius:"12px", background:CARD_BG, color:MUTED, border:`1px solid ${BORDER}`, cursor:"pointer", fontSize:"14px", fontWeight:600 }}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:SITE_BG, fontFamily:"'Outfit',sans-serif" }}>

      {/* ── Topbar — hidden when site header present ── */}
      {!embedded && (
      <div style={{ background:CARD_BG, borderBottom:`1px solid ${BORDER}`, padding:"0 28px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:30, boxShadow:"0 2px 12px rgba(217,119,6,0.06)" }}>
        <button onClick={() => nav(-1)} style={{ display:"flex", alignItems:"center", gap:"8px", background:"none", border:"none", cursor:"pointer", color:MUTED, fontSize:"14px", fontWeight:600 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Room Details
        </button>
        <span style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:700, color:TEXT }}>
          Wild<span style={{ color:AMBER }}>Haven</span>
        </span>
        <div style={{ display:"flex", gap:"6px" }}>
          {[["1","Details",true],["2","Review",false],["3","Confirmed",false]].map(([n,l,active])=>(
            <div key={n} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <div style={{ width:"24px", height:"24px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700,
                background:active?`linear-gradient(135deg,${AMBER_LT},${AMBER})`:BORDER, color:active?"#1C1917":MUTED }}>{n}</div>
              <span style={{ fontSize:"12px", fontWeight:600, color:active?TEXT:MUTED }}>{l}</span>
              {n!=="3" && <span style={{ color:BORDER, marginRight:"4px" }}>›</span>}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Back breadcrumb when embedded */}
      {embedded && (
        <div style={{ padding:"16px 28px 0", maxWidth:"860px", margin:"0 auto" }}>
          <button onClick={() => nav(-1)} style={{ display:"flex", alignItems:"center", gap:"6px", background:"none", border:"none", cursor:"pointer", color:MUTED, fontSize:"13px", fontWeight:600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Room Details
          </button>
        </div>
      )}

      <div style={{ maxWidth:"860px", margin:"0 auto", padding: embedded ? "16px 24px 80px" : "32px 24px 80px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"24px", alignItems:"start" }}>

          {/* LEFT — form */}
          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            <div>
              <h1 style={{ fontFamily:"Georgia,serif", fontSize:"28px", fontWeight:700, color:TEXT, margin:"0 0 4px" }}>Complete Your Booking</h1>
              <p style={{ color:MUTED, fontSize:"14px", margin:0 }}>Fill in the details to confirm your stay</p>
            </div>

            {/* Stay details */}
            <div style={{ ...card2, padding:"22px" }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:"18px", color:TEXT, margin:"0 0 16px" }}>📅 Stay Details</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
                {[["Check-In","checkInDate"],["Check-Out","checkOutDate"]].map(([l,k])=>(
                  <div key={k}>
                    <label style={{ display:"block", fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:MUTED, marginBottom:"6px" }}>{l}</label>
                    <input type="date" min={today()} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={{ ...inp2 }} />
                  </div>
                ))}
              </div>

              {/* Guests counter */}
              <div style={{ marginBottom:"16px" }}>
                <label style={{ display:"block", fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:MUTED, marginBottom:"8px" }}>Guests</label>
                <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <button onClick={()=>setForm(f=>({...f,numberOfGuests:Math.max(1,f.numberOfGuests-1)}))}
                    style={{ width:"42px", height:"42px", borderRadius:"12px", border:`1px solid ${BORDER}`, background:CARD_BG, color:TEXT, fontSize:"22px", cursor:"pointer" }}>−</button>
                  <span style={{ flex:1, height:"42px", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(217,119,6,0.05)", border:`1px solid ${BORDER}`, borderRadius:"12px", fontWeight:800, fontSize:"18px", color:TEXT }}>{form.numberOfGuests}</span>
                  <button onClick={()=>setForm(f=>({...f,numberOfGuests:Math.min(room.capacity,f.numberOfGuests+1)}))}
                    style={{ width:"42px", height:"42px", borderRadius:"12px", border:`1px solid ${BORDER}`, background:CARD_BG, color:TEXT, fontSize:"22px", cursor:"pointer" }}>+</button>
                  <span style={{ color:MUTED, fontSize:"13px" }}>Max {room.capacity}</span>
                </div>
              </div>

              {/* Special requests */}
              <div>
                <label style={{ display:"block", fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:MUTED, marginBottom:"6px" }}>
                  Special Requests <span style={{ color:MUTED, fontWeight:400, textTransform:"none", letterSpacing:0, fontSize:"11px" }}>(optional)</span>
                </label>
                <textarea value={form.specialRequests} rows={3} onChange={e=>setForm({...form,specialRequests:e.target.value})}
                  placeholder="Dietary needs, early check-in, special occasions…"
                  style={{ ...inp2, resize:"vertical", lineHeight:1.65, padding:"12px 14px" }} />
              </div>
            </div>

            {/* Payment method */}
            <div style={{ ...card2, padding:"22px" }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:"18px", color:TEXT, margin:"0 0 16px" }}>💳 Payment Method</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px" }}>
                {[{v:"bank_deposit",l:"Bank Deposit",s:"Transfer & upload slip",icon:"🏦"},{v:"online",l:"Online Payment",s:"Card / digital wallet",icon:"💳"},{v:"checkout",l:"Pay at Checkout",s:"Settle bill on departure",icon:"🏨"}].map(opt=>(
                  <div key={opt.v} onClick={()=>setForm({...form,paymentMethod:opt.v})}
                    style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px", borderRadius:"14px", cursor:"pointer",
                      background:form.paymentMethod===opt.v?"rgba(217,119,6,0.06)":CARD_BG,
                      border:`2px solid ${form.paymentMethod===opt.v?AMBER:BORDER}` }}>
                    <span style={{ fontSize:"24px" }}>{opt.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ color:TEXT, fontSize:"14px", fontWeight:700, margin:"0 0 2px" }}>{opt.l}</p>
                      <p style={{ color:MUTED, fontSize:"12px", margin:0 }}>{opt.s}</p>
                    </div>
                    <div style={{ width:"20px", height:"20px", borderRadius:"50%", border:`2px solid ${form.paymentMethod===opt.v?AMBER:BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {form.paymentMethod===opt.v && <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:AMBER }} />}
                    </div>
                  </div>
                ))}
              </div>

              {form.paymentMethod === "bank_deposit" && (
                <div style={{ marginTop:"14px", padding:"16px", borderRadius:"12px", background:"rgba(217,119,6,0.05)", border:`1px solid ${BORDER}`, fontSize:"13px", color:MUTED, lineHeight:1.75 }}>
                  <strong style={{ color:AMBER, display:"block", marginBottom:"5px" }}>Bank Transfer Details</strong>
                  Bank: Commercial Bank of Ceylon · Account: Kadiraa Tourism Pvt Ltd<br/>
                  Account No: <strong style={{ color:TEXT }}>1234 5678 9012</strong><br/>
                  <span style={{ fontSize:"12px" }}>Transfer LKR {total > 0 ? total.toLocaleString() : "—"} and upload your slip after booking</span>
                </div>
              )}
              {form.paymentMethod === "checkout" && (
                <div style={{ marginTop:"14px", padding:"16px", borderRadius:"12px", background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.2)", fontSize:"13px", color:MUTED, lineHeight:1.75 }}>
                  <strong style={{ color:"#059669", display:"block", marginBottom:"5px" }}>🏨 Pay at Checkout — How it works</strong>
                  Your booking will be <strong style={{ color:TEXT }}>automatically confirmed</strong> with no upfront payment.<br/>
                  The total of <strong style={{ color:AMBER }}>LKR {total > 0 ? total.toLocaleString() : "—"}</strong> is due at the front desk on your checkout date.<br/>
                  <span style={{ fontSize:"12px" }}>The admin will email your bill details before checkout.</span>
                </div>
              )}
            </div>

            {err && (
              <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"14px 16px", borderRadius:"12px", background:"rgba(220,38,38,0.06)", border:"1px solid rgba(220,38,38,0.2)" }}>
                <span style={{ fontSize:"18px" }}>⚠️</span>
                <p style={{ color:"#DC2626", fontSize:"13px", margin:0, fontWeight:600 }}>{err}</p>
              </div>
            )}

            <button onClick={submit} disabled={submitting}
              style={{ ...goldBtn2, height:"52px", fontSize:"16px", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", opacity:submitting?0.65:1, transition:"opacity .2s" }}>
              {submitting ? <><Spinner /> Processing…</> : "Confirm Booking →"}
            </button>
            <p style={{ textAlign:"center", color:MUTED, fontSize:"12px", display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", margin:0 }}>
              🔒 Secure · Free cancellation up to 48h before check-in
            </p>
          </div>

          {/* RIGHT — summary */}
          <div style={{ position:"sticky", top:"76px" }}>
            <div style={{ ...card2, overflow:"hidden" }}>
              <div style={{ position:"relative", height:"160px" }}>
                <img src={room.images?.[0]} alt={room.roomType}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75"; }}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(41,37,36,0.65) 0%,transparent 55%)" }} />
                <div style={{ position:"absolute", bottom:"12px", left:"14px" }}>
                  <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", margin:"0 0 2px" }}>{room.hotelName}</p>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:"18px", fontWeight:700, color:"white", margin:0 }}>{room.roomType}</p>
                </div>
              </div>
              <div style={{ padding:"18px" }}>
                {[["Room",`Room ${room.roomNumber}`],["Check-In",form.checkInDate||"—"],["Check-Out",form.checkOutDate||"—"],["Nights",n>0?`${n} night${n>1?"s":""}`: "—"],["Guests",`${form.numberOfGuests}`]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${BORDER}` }}>
                    <span style={{ color:MUTED, fontSize:"12px" }}>{l}</span>
                    <span style={{ color:TEXT, fontSize:"13px", fontWeight:600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:"12px", marginTop:"4px" }}>
                  {n > 0 ? (
                    <>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"5px", color:MUTED }}>
                        <span>LKR {room.price?.toLocaleString()} × {n}n</span>
                        <span style={{ fontWeight:600, color:TEXT }}>LKR {sub.toLocaleString()}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"10px", color:MUTED }}>
                        <span>Tax (10%)</span>
                        <span style={{ fontWeight:600, color:TEXT }}>LKR {tax.toLocaleString()}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:"16px" }}>
                        <span style={{ color:TEXT }}>Total</span>
                        <span style={{ color:AMBER }}>LKR {total.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <p style={{ color:MUTED, fontSize:"13px", textAlign:"center", margin:0 }}>Add dates to see total</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RoomSearchPage;