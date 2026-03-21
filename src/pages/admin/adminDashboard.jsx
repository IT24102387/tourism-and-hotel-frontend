// AdminDashBoard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashBoard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenueThisMonth: 0,
  });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

        // Very simple this-month revenue (you can improve with proper date check)
        const now = new Date();
        const thisMonthRevenue = orders
          .filter((o) => {
            const d = new Date(o.orderDate);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

        setStats({
          totalRevenue,
          totalUsers: users.length,
          totalOrders: orders.length,
          revenueThisMonth: thisMonthRevenue,
        });

        // Monthly chart data (last 12 months example – improve later)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mockMonthly = months.map(() => Math.floor(Math.random() * 35000) + 8000);

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Revenue",
              data: mockMonthly,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              fill: true,
              tension: 0.35,
              pointBackgroundColor: "#3b82f6",
              pointBorderColor: "#ffffff",
              pointHoverRadius: 7,
              pointRadius: 4,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Revenue Analytics – This Year",
        font: { size: 18 },
        padding: { bottom: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Rs. ${ctx.parsed.y.toLocaleString("en-LK")}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => `Rs. ${v.toLocaleString("en-LK", { notation: "compact" })}`,
        },
      },
    },
  };

  const cards = [
    {
      title: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toLocaleString("en-LK")}`,
      change: "+18.2%",
      trend: "up",
      color: "text-green-600",
      bg: "bg-green-50/70",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+11.4%",
      trend: "up",
      color: "text-blue-600",
      bg: "bg-blue-50/70",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "-2.8%",
      trend: "down",
      color: "text-purple-600",
      bg: "bg-purple-50/70",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: "Revenue This Month",
      value: `Rs. ${stats.revenueThisMonth.toLocaleString("en-LK")}`,
      change: "+9.7%",
      trend: "up",
      color: "text-emerald-600",
      bg: "bg-emerald-50/70",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your platform</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-xl border border-gray-200 ${card.bg} p-6 shadow-sm hover:shadow transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-white/80 ${card.color}`}>{card.icon}</div>
              <span className={`text-sm font-medium ${card.color}`}>
                {card.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
              {loading ? "—" : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">Revenue Analytics</h2>
        <div className="h-80 md:h-96">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* You can add more sections here later:
          - Recent Orders table
          - Top Products
          - User growth chart
          - etc.
      */}
    </div>
  );
}