
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  TrendingUp,
  Map,
  Layers,
  Calendar
} from 'lucide-react';
import { getComplaints } from '../../utils/storage';
import { Complaint, ComplaintStatus } from '../../types';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const complaints = await getComplaints();
        setData(complaints);
      } catch (error) {
        console.error('Failed to load complaints:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Compute stats
  const total = data.length;
  const resolved = data.filter(c => c.status === ComplaintStatus.RESOLVED).length;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

  // Category Distribution
  const categoryMap: Record<string, number> = {};
  data.forEach(c => categoryMap[c.category] = (categoryMap[c.category] || 0) + 1);
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Status Distribution
  const statusData = [
    { name: 'New', value: data.filter(c => c.status === ComplaintStatus.NEW).length, color: '#3b82f6' },
    { name: 'In Progress', value: data.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length, color: '#f59e0b' },
    { name: 'Resolved', value: data.filter(c => c.status === ComplaintStatus.RESOLVED).length, color: '#10b981' },
  ];

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  // Insights Logic
  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0];
  const totalOpen = total - resolved;
  const healthStatus = resolutionRate > 50 ? 'Good' : 'Needs Attention';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate('/official/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Reports", value: total, icon: <Layers />, color: "text-blue-600" },
          { label: "Resolution Rate", value: `${resolutionRate}%`, icon: <TrendingUp />, color: "text-emerald-600" },
          { label: "Avg Response", value: "4.2 hrs", icon: <RefreshCw />, color: "text-amber-600" },
          { label: "Active Districts", value: "12", icon: <Map />, color: "text-purple-600" },
        ].map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className={`mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-3xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>



      {/* Key Insights Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 mb-10 border border-emerald-100 flex flex-col md:flex-row gap-8 items-center">
        <div className="bg-white p-4 rounded-full shadow-sm">
          <TrendingUp className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Summary</h3>
          <p className="text-gray-600 leading-relaxed">
            The top reported category is <strong className="text-emerald-700">{topCategory?.name || 'N/A'}</strong> with {topCategory?.value || 0} reports.
            Currently, there are <strong className="text-blue-700">{totalOpen} active cases</strong> requiring attention.
            Overall department performance is rated as <strong className="text-amber-700">{healthStatus}</strong> based on the current resolution timeframe.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[450px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Complaint Distribution by Category</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 11, fontWeight: 600, fill: '#4b5563' }} />
              <Tooltip
                cursor={{ fill: '#ecfdf5' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#059669', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} barSize={28} activeBar={{ fill: '#059669' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[450px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Current Case Status</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={8}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area hotspots (Simulated table) */}
      <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Department Performance</h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Real-time stats</span>
        </div>
        <div className="p-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                <th className="pb-4">Department</th>
                <th className="pb-4">Active Cases</th>
                <th className="pb-4">Resolved</th>
                <th className="pb-4">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(() => {
                const deptStats: Record<string, { active: number; resolved: number }> = {};

                data.forEach(c => {
                  const dept = c.department || 'Unassigned';
                  if (!deptStats[dept]) deptStats[dept] = { active: 0, resolved: 0 };

                  if (c.status === ComplaintStatus.RESOLVED) {
                    deptStats[dept].resolved++;
                  } else {
                    deptStats[dept].active++;
                  }
                });

                return Object.entries(deptStats).map(([name, stats], i) => {
                  const total = stats.active + stats.resolved;
                  const rate = total > 0 ? ((stats.resolved / total) * 100).toFixed(1) : 0;

                  return (
                    <tr key={i}>
                      <td className="py-4 font-bold text-gray-700">{name}</td>
                      <td className="py-4 font-mono">{stats.active}</td>
                      <td className="py-4 font-mono">{stats.resolved}</td>
                      <td className={`py-4 font-bold ${Number(rate) >= 80 ? 'text-emerald-500' : Number(rate) >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {rate}%
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default AnalyticsPage;
