import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { PiBagSimpleBold } from "react-icons/pi";
import {
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

function aggregateMonthlyRevenue(orders) {
  const map = {};
  orders.forEach((o) => {
    const d = new Date(o.orderDate);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    map[key] = (map[key] || 0) + Number(o.totalAmount || 0);
  });
  const now = new Date();
  const labels = [], values = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    labels.push(MONTH_NAMES[d.getMonth()]);
    values.push(Math.round(map[key] || 0));
  }
  return { labels, values };
}

function aggregateMonthlyOrders(orders) {
  const map = {};
  orders.forEach((o) => {
    const d = new Date(o.orderDate);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    map[key] = (map[key] || 0) + 1;
  });
  const now = new Date();
  const values = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    values.push(map[`${d.getFullYear()}-${d.getMonth()}`] || 0);
  }
  return values;
}

function getPrevMonthRevenue(orders) {
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return orders
    .filter((o) => {
      const d = new Date(o.orderDate);
      return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear();
    })
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
}

function pctChange(cur, prev) {
  if (!prev) return null;
  return ((cur - prev) / prev * 100).toFixed(1);
}

function countByStatus(orders) {
  const counts = { Approved: 0, Pending: 0, Rejected: 0 };
  orders.forEach((o) => {
    if (o.status in counts) counts[o.status]++;
  });
  return counts;
}

export default function AdminDashBoard() {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalUsers: 0, totalOrders: 0,
    revenueThisMonth: 0, prevMonthRevenue: 0, peakMonth: "—", avgMonthly: 0,
  });
  const [statusCounts, setStatusCounts] = useState({ Approved: 0, Pending: 0, Rejected: 0 });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartMode, setChartMode] = useState("revenue");
  const [range, setRange] = useState(12);
  const [loading, setLoading] = useState(true);

  const rawRevRef = useRef({ labels: [], values: [] });
  const rawOrdRef = useRef([]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/`, { headers }),
        ]);
        const users = usersRes.data || [];
        const orders = ordersRes.data || [];

        const totalRevenue = orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
        const now = new Date();
        const thisMonthRevenue = orders
          .filter((o) => { const d = new Date(o.orderDate); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
          .reduce((s, o) => s + Number(o.totalAmount || 0), 0);
        const prevMonthRevenue = getPrevMonthRevenue(orders);

        const monthly = aggregateMonthlyRevenue(orders);
        const monthlyOrders = aggregateMonthlyOrders(orders);

        const peakIdx = monthly.values.indexOf(Math.max(...monthly.values));
        const peakMonth = monthly.values[peakIdx] > 0 ? monthly.labels[peakIdx] : "—";
        const nonZero = monthly.values.filter((v) => v > 0);
        const avgMonthly = nonZero.length
          ? Math.round(nonZero.reduce((a, b) => a + b, 0) / nonZero.length)
          : 0;

        rawRevRef.current = monthly;
        rawOrdRef.current = monthlyOrders;

        setStatusCounts(countByStatus(orders));

        setStats({
          totalRevenue: Math.round(totalRevenue),
          totalUsers: users.length,
          totalOrders: orders.length,
          revenueThisMonth: Math.round(thisMonthRevenue),
          prevMonthRevenue: Math.round(prevMonthRevenue),
          peakMonth,
          avgMonthly,
        });
        buildChart(monthly, monthlyOrders, "revenue", 12);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function buildChart(monthly, monthlyOrders, mode, r) {
    const isRev = mode === "revenue";
    setChartData({
      labels: monthly.labels.slice(-r),
      datasets: [{
        label: isRev ? "Revenue" : "Orders",
        data: (isRev ? monthly.values : monthlyOrders).slice(-r),
        borderColor: isRev ? "#185FA5" : "#1D9E75",
        backgroundColor: isRev ? "rgba(24,95,165,0.08)" : "rgba(29,158,117,0.08)",
        fill: true,
        tension: 0.42,
        pointBackgroundColor: isRev ? "#185FA5" : "#1D9E75",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        borderWidth: 2.5,
      }],
    });
  }

  function handleModeChange(mode) {
    setChartMode(mode);
    buildChart(rawRevRef.current, rawOrdRef.current, mode, range);
  }

  function handleRangeChange(r) {
    setRange(r);
    buildChart(rawRevRef.current, rawOrdRef.current, chartMode, r);
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeInOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(4,44,83,0.93)",
        titleFont: { size: 12, weight: "500" },
        bodyFont: { size: 13 },
        padding: 12,
        callbacks: {
          label: (ctx) =>
            chartMode === "revenue"
              ? `Rs. ${Math.round(ctx.parsed.y).toLocaleString("en-LK")}`
              : `${ctx.parsed.y} orders`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 11 }, color: "#888780", autoSkip: false, maxRotation: 0 },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(136,135,128,0.12)" },
        border: { display: false },
        ticks: {
          font: { size: 11 },
          color: "#888780",
          callback: (v) =>
            chartMode === "revenue"
              ? v >= 1000 ? `Rs. ${(v / 1000).toFixed(0)}k` : `Rs. ${v}`
              : `${v}`,
        },
      },
    },
    interaction: { mode: "index", intersect: false },
  };

  const total = statusCounts.Approved + statusCounts.Pending + statusCounts.Rejected;

  const doughnutData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [{
      data: [statusCounts.Approved, statusCounts.Pending, statusCounts.Rejected],
      backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
      hoverBackgroundColor: ["#16a34a", "#ca8a04", "#dc2626"],
      borderColor: "#ffffff",
      borderWidth: 3,
      hoverOffset: 8,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeInOutQuart" },
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(4,44,83,0.93)",
        titleFont: { size: 12, weight: "500" },
        bodyFont: { size: 13 },
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
            return ` ${ctx.parsed} orders (${pct}%)`;
          },
        },
      },
    },
  };

  const revPct = pctChange(stats.revenueThisMonth, stats.prevMonthRevenue);

  const statCards = [
    {
      title: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toLocaleString("en-LK")}`,
      sub: revPct ? `${revPct > 0 ? "+" : ""}${revPct}% vs last month` : "vs last month",
      trend: revPct > 0 ? "up" : "down",
      bg: "bg-green-50", iconBg: "bg-green-100",
      icon: <FiDollarSign className="text-green-600" size={20} />,
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sub: "registered accounts",
      trend: "up",
      bg: "bg-blue-50", iconBg: "bg-blue-100",
      icon: <FiUsers className="text-blue-600" size={20} />,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      sub: "all time",
      trend: "neutral",
      bg: "bg-purple-50", iconBg: "bg-purple-100",
      icon: <FiShoppingBag className="text-purple-600" size={20} />,
    },
    {
      title: "This Month",
      value: `Rs. ${stats.revenueThisMonth.toLocaleString("en-LK")}`,
      sub: `Peak: ${stats.peakMonth}`,
      trend: "up",
      bg: "bg-emerald-50", iconBg: "bg-emerald-100",
      icon: <FiTrendingUp className="text-emerald-600" size={20} />,
    },
  ];

  const statusMeta = [
    { key: "Approved", color: "#22c55e", bg: "bg-green-100",  text: "text-green-700"  },
    { key: "Pending",  color: "#eab308", bg: "bg-yellow-100", text: "text-yellow-700" },
    { key: "Rejected", color: "#ef4444", bg: "bg-red-100",    text: "text-red-700"    },
  ];

  const Skeleton = () => <div className="animate-pulse bg-gray-200 rounded-lg h-7 w-3/4" />;

  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Platform overview &mdash;{" "}
          {new Date().toLocaleDateString("en-LK", { month: "long", year: "numeric" })}
        </p>
      </header>

      {/* Inventory label */}
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
        <MdOutlineInventory2 size={22} />
        Equipment Inventory
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className={`rounded-xl border border-gray-100 ${card.bg} p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${card.iconBg}`}>{card.icon}</div>
              {card.trend === "up"   && <FiArrowUpRight   size={16} className="text-green-500" />}
              {card.trend === "down" && <FiArrowDownRight size={16} className="text-red-400"   />}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{card.title}</p>
              {loading ? <Skeleton /> : (
                <p className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{card.value}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT — Revenue / Orders Line Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Revenue Analytics</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real data — last {range} months</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                {["revenue", "orders"].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={`px-3 py-1.5 capitalize transition ${
                      chartMode === m ? "bg-[#2F2D8F] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                {[3, 6, 12].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRangeChange(r)}
                    className={`px-3 py-1.5 transition ${
                      range === r ? "bg-[#2F2D8F] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {r}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-56 md:h-64">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F2D8F]" />
                <span className="text-sm">Loading chart data…</span>
              </div>
            ) : !chartData.datasets[0]?.data.some((v) => v > 0) ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No data available for this period.
              </div>
            ) : (
              <Line data={chartData} options={lineOptions} />
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <span className="inline-block w-5 h-0.5 rounded"
              style={{ background: chartMode === "revenue" ? "#185FA5" : "#1D9E75" }} />
            {chartMode === "revenue" ? "Monthly Revenue (Rs.)" : "Monthly Orders"}
          </div>
        </div>

        {/* RIGHT — Order Status Doughnut */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-800">Order Status</h3>
            <p className="text-xs text-gray-400 mt-0.5">Breakdown of all orders by status</p>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F2D8F]" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : total === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              No orders found.
            </div>
          ) : (
            <>
              {/* Doughnut */}
              <div className="relative flex items-center justify-center" style={{ height: "220px" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                {/* Centre label */}
                <div className="absolute flex flex-col items-center pointer-events-none">
                  <span className="text-2xl font-bold text-gray-800">{total}</span>
                  <span className="text-xs text-gray-400">Total</span>
                </div>
              </div>

              {/* Legend rows */}
              <div className="flex flex-col gap-3 mt-5">
                {statusMeta.map((s) => {
                  const count = statusCounts[s.key];
                  const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-sm text-gray-600 flex-1">{s.key}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                        {count}
                      </span>
                      <span className="text-xs text-gray-400 w-12 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bars */}
              <div className="flex gap-0 mt-5 rounded-full overflow-hidden h-2">
                {statusMeta.map((s) => {
                  const pct = total > 0 ? (statusCounts[s.key] / total) * 100 : 0;
                  return pct > 0 ? (
                    <div
                      key={s.key}
                      className="h-2 transition-all duration-700"
                      style={{ width: `${pct}%`, background: s.color }}
                      title={`${s.key}: ${pct.toFixed(1)}%`}
                    />
                  ) : null;
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}