
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Eye,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { getComplaints } from '../../utils/storage';
import { Complaint, ComplaintStatus } from '../../types';

const OfficialDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getComplaints();
        setComplaints(data);
      } catch (error) {
        console.error('Failed to load complaints:', error);
      }
    };
    loadComplaints();
  }, []);

  const stats = [
    { label: "Total Reports", value: complaints.length, icon: <BarChart3 className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600" },
    { label: "New", value: complaints.filter(c => c.status === ComplaintStatus.NEW).length, icon: <Clock className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
    { label: "In Progress", value: complaints.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length, icon: <MoreVertical className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
    { label: "Resolved", value: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length, icon: <CheckCircle2 className="w-5 h-5" />, color: "bg-green-50 text-green-600" },
  ];

  const filtered = complaints.filter(c => {
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Official Dashboard</h1>
          <p className="text-gray-500">Managing city-wide environmental complaints and field reports.</p>
        </div>
        <button
          onClick={() => navigate('/official/analytics')}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          View Analytics
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, category or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all border border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 rounded-2xl outline-none border border-transparent focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value={ComplaintStatus.NEW}>New</option>
              <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
              <option value={ComplaintStatus.RESOLVED}>Resolved</option>
            </select>
            <button className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-gray-100">
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category & Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(complaint => (
                <tr key={complaint.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-emerald-600 text-xs">#{complaint.id.split('-').pop()}</span>
                    <div className="text-[10px] text-gray-400 mt-1">{new Date(complaint.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm">{complaint.category}</div>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${complaint.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 truncate max-w-xs">{complaint.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${complaint.status === ComplaintStatus.NEW ? 'bg-blue-100 text-blue-700' :
                        complaint.status === ComplaintStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                      }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/official/complaint/${complaint.id}`)}
                      className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium">
            No complaints found matching the criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialDashboardPage;
