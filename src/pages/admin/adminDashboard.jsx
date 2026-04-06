import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { MdOutlineInventory2, MdOutlineBed } from "react-icons/md";
import {
  FiDollarSign, FiUsers, FiShoppingBag, FiTrendingUp,
  FiArrowUpRight, FiArrowDownRight, FiFilter,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa6";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler);

const BASE        = import.meta.env.VITE_BACKEND_URL;
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ── helpers ── */
function aggregateMonthlyRevenue(orders) {
  const map = {};
  orders.forEach(o => {
    const d = new Date(o.orderDate); if (isNaN(d)) return;
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    map[k] = (map[k]||0) + Number(o.totalAmount||0);
  });
  const now = new Date(); const labels=[], values=[];
  for (let i=11;i>=0;i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    labels.push(MONTH_NAMES[d.getMonth()]);
    values.push(Math.round(map[`${d.getFullYear()}-${d.getMonth()}`]||0));
  }
  return { labels, values };
}
function aggregateMonthlyOrders(orders) {
  const map = {};
  orders.forEach(o => {
    const d = new Date(o.orderDate); if (isNaN(d)) return;
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    map[k] = (map[k]||0)+1;
  });
  const now = new Date(); const values=[];
  for (let i=11;i>=0;i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    values.push(map[`${d.getFullYear()}-${d.getMonth()}`]||0);
  }
  return values;
}
function getPrevMonthRevenue(orders) {
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth()-1, 1);
  return orders.filter(o=>{const d=new Date(o.orderDate);return d.getMonth()===prev.getMonth()&&d.getFullYear()===prev.getFullYear();})
    .reduce((s,o)=>s+Number(o.totalAmount||0),0);
}
function pctChange(cur,prev) { if(!prev) return null; return ((cur-prev)/prev*100).toFixed(1); }
function countByStatus(orders) {
  const c={Approved:0,Pending:0,Rejected:0};
  orders.forEach(o=>{if(o.status in c)c[o.status]++;});
  return c;
}

/* ── Skeleton ── */
const Skeleton = () => <div className="animate-pulse bg-gray-200 rounded-lg h-7 w-3/4"/>;

/* ── Recent booking row ── */
function BookingRow({ b, navigate }) {
  const approved = b.isApproved;
  const rejected = b.paymentStatus==="rejected";
  const badge = approved ? {bg:"#d1fae5",color:"#065f46",label:"✅ Confirmed"}
              : rejected ? {bg:"#fee2e2",color:"#991b1b",label:"❌ Rejected"}
              :             {bg:"#fef3c7",color:"#92400e",label:"⏳ Pending"};
  return (
    <div onClick={()=>navigate("/admin/room-bookings")}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <img src={b.room?.images?.[0]||b.room?.image||"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&q=60"}
          alt="" className="w-full h-full object-cover"
          onError={e=>e.target.src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&q=60"}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{b.room?.roomType} — Room {b.room?.roomNumber}</p>
        <p className="text-xs text-gray-400 truncate">{b.email} · {b.room?.hotelName}</p>
        <p className="text-xs text-gray-400 mt-0.5">📅 {new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()} · {b.numberOfNights}n</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-amber-600 text-sm mb-1">LKR {(b.totalAmount||0).toLocaleString()}</p>
        <span style={{background:badge.bg,color:badge.color}} className="px-2.5 py-0.5 rounded-full text-xs font-semibold">{badge.label}</span>
      </div>
    </div>
  );
}

/* ── Donut chart ── */
function DonutCard({ title, subtitle, data, labels, colors, total, loading }) {
  const opts = {
    responsive:true, maintainAspectRatio:false,
    animation:{duration:900,easing:"easeInOutQuart"}, cutout:"68%",
    plugins:{legend:{display:false}, tooltip:{backgroundColor:"rgba(4,44,83,0.93)",titleFont:{size:12,weight:"500"},bodyFont:{size:13},padding:12,
      callbacks:{label:ctx=>{const pct=total>0?((ctx.parsed/total)*100).toFixed(1):0;return ` ${ctx.parsed} (${pct}%)`;}}}},
  };
  const chartData = { labels, datasets:[{data, backgroundColor:colors, hoverBackgroundColor:colors, borderColor:"#fff", borderWidth:3, hoverOffset:8}] };
  const meta = labels.map((l,i)=>({label:l,count:data[i],color:colors[i]}));
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-400 mt-0.5 mb-4">{subtitle}</p>
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F2D8F]"/><span className="text-sm">Loading…</span>
        </div>
      ) : total===0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">No data yet.</div>
      ) : (
        <>
          <div className="relative flex items-center justify-center" style={{height:"200px"}}>
            <Doughnut data={chartData} options={opts}/>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">{total}</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {meta.map(s=>{
              const pct = total>0?((s.count/total)*100).toFixed(1):"0.0";
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{background:s.color}}/>
                  <span className="text-sm text-gray-600 flex-1">{s.label}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">{s.count}</span>
                  <span className="text-xs text-gray-400 w-12 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-0 mt-4 rounded-full overflow-hidden h-2">
            {meta.map(s=>{ const pct=total>0?(s.count/total)*100:0; return pct>0?<div key={s.label} className="h-2 transition-all duration-700" style={{width:`${pct}%`,background:s.color}}/>:null; })}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminDashBoard() {
  const navigate = useNavigate();

  /* ── equipment state ── */
  const [eqStats,     setEqStats]     = useState({totalRevenue:0,totalUsers:0,totalOrders:0,revenueThisMonth:0,prevMonthRevenue:0,peakMonth:"—"});
  const [statusCounts,setStatusCounts]= useState({Approved:0,Pending:0,Rejected:0});
  const [chartData,   setChartData]   = useState({labels:[],datasets:[]});
  const [chartMode,   setChartMode]   = useState("revenue");
  const [range,       setRange]       = useState(12);
  const [eqLoad,      setEqLoad]      = useState(true);
  const rawRevRef = useRef({labels:[],values:[]});
  const rawOrdRef = useRef([]);

  /* ── room booking state ── */
  const [allBookings, setAllBookings] = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [hotels,      setHotels]      = useState([]);
  const [roomTypes,   setRoomTypes]   = useState([]);
  const [filters,     setFilters]     = useState({fromDate:"",toDate:"",hotel:"all",roomType:"all"});
  const [rmLoad,      setRmLoad]      = useState(true);

  /* ── fetch equipment ── */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token"); if(!token) return;
        const headers = {Authorization:`Bearer ${token}`};
        const [uRes,oRes] = await Promise.all([
          axios.get(`${BASE}/api/users/all`,{headers}),
          axios.get(`${BASE}/api/orders/`,{headers}),
        ]);
        const users=uRes.data||[], orders=oRes.data||[];
        const totalRevenue=orders.reduce((s,o)=>s+Number(o.totalAmount||0),0);
        const now=new Date();
        const thisMonthRevenue=orders.filter(o=>{const d=new Date(o.orderDate);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();}).reduce((s,o)=>s+Number(o.totalAmount||0),0);
        const prevMonthRevenue=getPrevMonthRevenue(orders);
        const monthly=aggregateMonthlyRevenue(orders);
        const monthlyOrders=aggregateMonthlyOrders(orders);
        const peakIdx=monthly.values.indexOf(Math.max(...monthly.values));
        const peakMonth=monthly.values[peakIdx]>0?monthly.labels[peakIdx]:"—";
        rawRevRef.current=monthly; rawOrdRef.current=monthlyOrders;
        setStatusCounts(countByStatus(orders));
        setEqStats({totalRevenue:Math.round(totalRevenue),totalUsers:users.length,totalOrders:orders.length,revenueThisMonth:Math.round(thisMonthRevenue),prevMonthRevenue:Math.round(prevMonthRevenue),peakMonth});
        buildChart(monthly,monthlyOrders,"revenue",12);
      } catch(e){console.error(e);}
      finally{setEqLoad(false);}
    })();
  },[]);

  /* ── fetch room bookings ── */
  useEffect(() => {
    (async () => {
      try {
        const token=localStorage.getItem("token"); if(!token) return;
        const res=await axios.get(`${BASE}/api/rooms/bookings/all`,{headers:{Authorization:`Bearer ${token}`}});
        const data=res.data||[];
        setAllBookings(data);
        setHotels([...new Set(data.map(b=>b.room?.hotelName).filter(Boolean))]);
        setRoomTypes([...new Set(data.map(b=>b.room?.roomType).filter(Boolean))]);
      } catch(e){console.error(e);}
      finally{setRmLoad(false);}
    })();
  },[]);

  /* ── apply filters ── */
  useEffect(() => {
    let result = allBookings;
    result = result.filter(b => {
      const d = new Date(b.createdAt||b.checkInDate);
      if(filters.fromDate && d < new Date(filters.fromDate)) return false;
      if(filters.toDate   && d > new Date(filters.toDate))   return false;
      if(filters.hotel!=="all"    && b.room?.hotelName!==filters.hotel)    return false;
      if(filters.roomType!=="all" && b.room?.roomType!==filters.roomType)  return false;
      return true;
    });
    setFiltered(result);
  },[filters,allBookings]);

  function buildChart(monthly,monthlyOrders,mode,r) {
    const isRev=mode==="revenue";
    setChartData({
      labels:monthly.labels.slice(-r),
      datasets:[{
        label:isRev?"Revenue":"Orders", data:(isRev?monthly.values:monthlyOrders).slice(-r),
        borderColor:isRev?"#185FA5":"#1D9E75", backgroundColor:isRev?"rgba(24,95,165,0.08)":"rgba(29,158,117,0.08)",
        fill:true, tension:0.42, pointBackgroundColor:isRev?"#185FA5":"#1D9E75",
        pointBorderColor:"#fff", pointBorderWidth:2, pointRadius:5, pointHoverRadius:8, borderWidth:2.5,
      }],
    });
  }
  function handleModeChange(m){setChartMode(m);buildChart(rawRevRef.current,rawOrdRef.current,m,range);}
  function handleRangeChange(r){setRange(r);buildChart(rawRevRef.current,rawOrdRef.current,chartMode,r);}

  const lineOptions = {
    responsive:true,maintainAspectRatio:false,animation:{duration:800,easing:"easeInOutQuart"},
    plugins:{legend:{display:false},tooltip:{backgroundColor:"rgba(4,44,83,0.93)",titleFont:{size:12,weight:"500"},bodyFont:{size:13},padding:12,
      callbacks:{label:ctx=>chartMode==="revenue"?`Rs. ${Math.round(ctx.parsed.y).toLocaleString("en-LK")}`:`${ctx.parsed.y} orders`}}},
    scales:{
      x:{grid:{display:false},border:{display:false},ticks:{font:{size:11},color:"#888780",autoSkip:false,maxRotation:0}},
      y:{beginAtZero:true,grid:{color:"rgba(136,135,128,0.12)"},border:{display:false},
        ticks:{font:{size:11},color:"#888780",callback:v=>chartMode==="revenue"?v>=1000?`Rs. ${(v/1000).toFixed(0)}k`:`Rs. ${v}`:`${v}`}},
    },interaction:{mode:"index",intersect:false},
  };
  const barOptions = (cb) => ({
    responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false},tooltip:{backgroundColor:"rgba(4,44,83,0.93)",padding:12,callbacks:{label:cb}}},
    scales:{x:{grid:{display:false},border:{display:false},ticks:{font:{size:11},color:"#888780"}},
      y:{beginAtZero:true,grid:{color:"rgba(136,135,128,0.12)"},border:{display:false},ticks:{font:{size:11},color:"#888780"}}},
  });

  /* ── computed room stats ── */
  const rmConfirmed = filtered.filter(b=>b.isApproved).length;
  const rmPending   = filtered.filter(b=>!b.isApproved&&b.paymentStatus!=="rejected").length;
  const rmCancelled = filtered.filter(b=>b.paymentStatus==="rejected").length;
  const rmRevenue   = filtered.filter(b=>b.isApproved).reduce((s,b)=>s+Number(b.totalAmount||0),0);
  const rmTotal     = filtered.length;

  /* revenue by hotel */
  const revenueByHotel = {};
  filtered.forEach(b=>{const h=b.room?.hotelName||"Unknown";revenueByHotel[h]=(revenueByHotel[h]||0)+Number(b.totalAmount||0);});
  const hotelBarData = {
    labels:Object.keys(revenueByHotel),
    datasets:[{label:"Revenue",data:Object.values(revenueByHotel),backgroundColor:"rgba(59,130,246,0.75)",borderColor:"#3b82f6",borderWidth:2,borderRadius:6}],
  };

  /* top rooms */
  const roomCount = {};
  filtered.forEach(b=>{const k=`${b.room?.roomType} #${b.room?.roomNumber}`;roomCount[k]=(roomCount[k]||0)+1;});
  const topRooms = Object.entries(roomCount).sort((a,b)=>b[1]-a[1]).slice(0,5);

  /* monthly bookings */
  const monthlyBookings = Array(12).fill(0);
  filtered.forEach(b=>{const d=new Date(b.createdAt||b.checkInDate);if(!isNaN(d))monthlyBookings[d.getMonth()]++;});
  const monthlyBarData = {
    labels:MONTH_NAMES,
    datasets:[{label:"Bookings",data:monthlyBookings,backgroundColor:"rgba(251,191,36,0.75)",borderColor:"#F59E0B",borderWidth:2,borderRadius:6}],
  };

  /* recent 5 */
  const recent = [...allBookings].sort((a,b)=>new Date(b.createdAt||b.checkInDate)-new Date(a.createdAt||a.checkInDate)).slice(0,5);

  /* eq total */
  const eqTotal = statusCounts.Approved+statusCounts.Pending+statusCounts.Rejected;
  const revPct  = pctChange(eqStats.revenueThisMonth, eqStats.prevMonthRevenue);

  const eqCards = [
    {title:"Total Revenue", value:`Rs. ${eqStats.totalRevenue.toLocaleString("en-LK")}`, sub:revPct?`${revPct>0?"+":""}${revPct}% vs last month`:"vs last month", trend:revPct>0?"up":"down", bg:"bg-green-50",   iconBg:"bg-green-100",   icon:<FaRupeeSign  className="text-green-600"   size={20}/>},
    {title:"Total Users",   value:eqStats.totalUsers.toLocaleString(),                    sub:"registered accounts", trend:"up",      bg:"bg-blue-50",    iconBg:"bg-blue-100",    icon:<FiUsers       className="text-blue-600"    size={20}/>},
    {title:"Total Orders",  value:eqStats.totalOrders.toLocaleString(),                   sub:"all time",            trend:"neutral", bg:"bg-purple-50",  iconBg:"bg-purple-100",  icon:<FiShoppingBag className="text-purple-600"  size={20}/>},
    {title:"This Month",    value:`Rs. ${eqStats.revenueThisMonth.toLocaleString("en-LK")}`, sub:`Peak: ${eqStats.peakMonth}`, trend:"up", bg:"bg-emerald-50", iconBg:"bg-emerald-100", icon:<FiTrendingUp  className="text-emerald-600" size={20}/>},
  ];

  const inp = "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 bg-white";

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Platform overview — {new Date().toLocaleDateString("en-LK",{month:"long",year:"numeric"})}</p>
      </header>

      {/* ══════ EQUIPMENT INVENTORY ══════ */}
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
        <MdOutlineInventory2 size={22}/> Equipment Inventory
      </h2>

      {/* eq stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {eqCards.map((c,i)=>(
          <div key={i} className={`rounded-xl border border-gray-100 ${c.bg} p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${c.iconBg}`}>{c.icon}</div>
              {c.trend==="up"   && <FiArrowUpRight   size={16} className="text-green-500"/>}
              {c.trend==="down" && <FiArrowDownRight size={16} className="text-red-400"/>}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{c.title}</p>
              {eqLoad?<Skeleton/>:<p className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{c.value}</p>}
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* eq charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Revenue Analytics</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real data — last {range} months</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                {["revenue","orders"].map(m=>(
                  <button key={m} onClick={()=>handleModeChange(m)} className={`px-3 py-1.5 capitalize transition ${chartMode===m?"bg-[#2F2D8F] text-white":"bg-white text-gray-500 hover:bg-gray-50"}`}>{m}</button>
                ))}
              </div>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                {[3,6,12].map(r=>(
                  <button key={r} onClick={()=>handleRangeChange(r)} className={`px-3 py-1.5 transition ${range===r?"bg-[#2F2D8F] text-white":"bg-white text-gray-500 hover:bg-gray-50"}`}>{r}m</button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-56 md:h-64">
            {eqLoad?<div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F2D8F]"/><span className="text-sm">Loading…</span></div>
              :!chartData.datasets[0]?.data.some(v=>v>0)?<div className="h-full flex items-center justify-center text-gray-400 text-sm">No data.</div>
              :<Line data={chartData} options={lineOptions}/>}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <span className="inline-block w-5 h-0.5 rounded" style={{background:chartMode==="revenue"?"#185FA5":"#1D9E75"}}/>
            {chartMode==="revenue"?"Monthly Revenue (Rs.)":"Monthly Orders"}
          </div>
        </div>
        <DonutCard title="Order Status" subtitle="Breakdown of all orders by status"
          data={[statusCounts.Approved,statusCounts.Pending,statusCounts.Rejected]}
          labels={["Approved","Pending","Rejected"]} colors={["#22c55e","#eab308","#ef4444"]}
          total={eqTotal} loading={eqLoad}/>
      </div>

      {/* ══════ ROOM BOOKING ANALYTICS ══════ */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <MdOutlineBed size={22}/> Room Booking Analytics
        </h2>
        <button onClick={()=>navigate("/admin/room-bookings")}
          className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-amber-400 text-amber-600 hover:bg-amber-50 transition">
          View All Bookings →
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        <FiFilter size={16} className="text-gray-400 mt-1 flex-shrink-0"/>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">From Date</label>
          <input type="date" className={inp} value={filters.fromDate} onChange={e=>setFilters(f=>({...f,fromDate:e.target.value}))}/>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">To Date</label>
          <input type="date" className={inp} value={filters.toDate} onChange={e=>setFilters(f=>({...f,toDate:e.target.value}))}/>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Hotel</label>
          <select className={inp} value={filters.hotel} onChange={e=>setFilters(f=>({...f,hotel:e.target.value}))}>
            <option value="all">All Hotels</option>
            {hotels.map(h=><option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Room Type</label>
          <select className={inp} value={filters.roomType} onChange={e=>setFilters(f=>({...f,roomType:e.target.value}))}>
            <option value="all">All Types</option>
            {roomTypes.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button onClick={()=>setFilters({fromDate:"",toDate:"",hotel:"all",roomType:"all"})}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">
          Reset
        </button>
        {(filters.fromDate||filters.toDate||filters.hotel!=="all"||filters.roomType!=="all") && (
          <span className="text-xs text-amber-600 font-semibold px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            {filtered.length} result{filtered.length!==1?"s":""}
          </span>
        )}
      </div>

      {/* room stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {title:"TOTAL BOOKINGS", value:rmTotal,                                         sub:"filtered results",      bg:"bg-blue-50",    iconBg:"bg-blue-100",    icon:<MdOutlineBed   className="text-blue-600"    size={20}/>},
          {title:"ROOM REVENUE",   value:`Rs. ${rmRevenue.toLocaleString("en-LK")}`,      sub:"confirmed bookings",    bg:"bg-green-50",   iconBg:"bg-green-100",   icon:<FiDollarSign   className="text-green-600"   size={20}/>},
          {title:"PENDING",        value:rmPending,                                        sub:"awaiting confirmation", bg:"bg-yellow-50",  iconBg:"bg-yellow-100",  icon:<FiTrendingUp   className="text-yellow-600"  size={20}/>},
          {title:"CONFIRMED",      value:rmConfirmed,                                      sub:"approved bookings",     bg:"bg-emerald-50", iconBg:"bg-emerald-100", icon:<FiArrowUpRight className="text-emerald-600" size={20}/>},
        ].map((c,i)=>(
          <div key={i} className={`rounded-xl border border-gray-100 ${c.bg} p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${c.iconBg}`}>{c.icon}</div>
              <FiArrowUpRight size={16} className="text-green-500"/>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{c.title}</p>
              {rmLoad?<Skeleton/>:<p className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{c.value}</p>}
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* room charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* monthly bookings bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Monthly Bookings</h3>
          <p className="text-xs text-gray-400 mb-4">Number of bookings per month</p>
          <div className="h-56">
            {rmLoad?<div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"/><span className="text-sm">Loading…</span></div>
              :<Bar data={monthlyBarData} options={barOptions(ctx=>`${ctx.parsed.y} booking${ctx.parsed.y!==1?"s":""}`)}/>}
          </div>
        </div>

        {/* revenue by hotel bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Revenue by Hotel</h3>
          <p className="text-xs text-gray-400 mb-4">Total revenue per hotel (filtered)</p>
          <div className="h-56">
            {rmLoad?<div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"/><span className="text-sm">Loading…</span></div>
              :Object.keys(revenueByHotel).length===0?<div className="h-full flex items-center justify-center text-gray-400 text-sm">No data.</div>
              :<Bar data={hotelBarData} options={barOptions(ctx=>`Rs. ${Math.round(ctx.parsed.y).toLocaleString("en-LK")}`)}/>}
          </div>
        </div>
      </div>

      {/* room charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* booking status donut */}
        <DonutCard title="Booking Status" subtitle="Breakdown of room bookings by status"
          data={[rmConfirmed,rmPending,rmCancelled]}
          labels={["Confirmed","Pending","Cancelled"]} colors={["#3b82f6","#eab308","#ef4444"]}
          total={rmTotal} loading={rmLoad}/>

        {/* top performing rooms */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Top Performing Rooms</h3>
          <p className="text-xs text-gray-400 mb-4">Most booked rooms (filtered)</p>
          {rmLoad ? (
            <div className="flex flex-col gap-3 mt-2">{[...Array(5)].map((_,i)=><div key={i} className="animate-pulse bg-gray-100 rounded-lg h-10"/>)}</div>
          ) : topRooms.length===0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {topRooms.map(([room,count],i)=>{
                const max=topRooms[0][1];
                const pct=(count/max)*100;
                return (
                  <div key={room}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-4">#{i+1}</span>
                        {room}
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">{count} booking{count!==1?"s":""}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{width:`${pct}%`,background:"linear-gradient(90deg,#FBBF24,#F59E0B)"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Booking activity heatmap ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="text-base font-semibold text-gray-800 mb-1">Booking Activity</h3>
        <p className="text-xs text-gray-400 mb-4">Each dot represents a booking</p>
        {rmLoad ? (
          <div className="animate-pulse h-10 bg-gray-100 rounded-lg"/>
        ) : filtered.length===0 ? (
          <div className="text-sm text-gray-400">No activity data.</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {filtered.slice(0,80).map((b,i)=>{
              const d = new Date(b.createdAt||b.checkInDate);
              const isConfirmed = b.isApproved;
              const isRejected  = b.paymentStatus==="rejected";
              const color = isConfirmed?"#22c55e":isRejected?"#ef4444":"#f59e0b";
              return (
                <div key={i}
                  title={`${d.toDateString()} · ${b.room?.roomType} · LKR ${(b.totalAmount||0).toLocaleString()}`}
                  className="rounded-sm transition-transform hover:scale-150 cursor-pointer"
                  style={{width:14,height:14,background:color,opacity:0.4+Math.random()*0.6}}
                />
              );
            })}
            {filtered.length>80 && <span className="text-xs text-gray-400 self-center ml-1">+{filtered.length-80} more</span>}
          </div>
        )}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block"/>Confirmed</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block"/>Pending</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block"/>Rejected</span>
        </div>
      </div>

    </div>
  );
}