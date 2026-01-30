
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Send,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { getComplaintById, updateComplaint } from '../../utils/storage';
import { Complaint, ComplaintStatus } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const ComplaintDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(ComplaintStatus.NEW);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadComplaint = async () => {
      if (id) {
        try {
          const data = await getComplaintById(id);
          if (data) {
            setComplaint(data);
            setNewStatus(data.status);
          }
        } catch (error) {
          console.error('Failed to load complaint:', error);
        }
      }
    };
    loadComplaint();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (complaint) {
      setIsUpdating(true);
      const updated: Complaint = {
        ...complaint,
        status: newStatus,
        resolvedAt: newStatus === ComplaintStatus.RESOLVED ? new Date().toISOString() : complaint.resolvedAt
      };
      await updateComplaint(updated);
      setComplaint(updated);
      setTimeout(() => setIsUpdating(false), 800);
    }
  };

  if (!complaint) {
    return <div className="p-20 text-center">Loading complaint details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/official/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Detail Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">{complaint.id}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(complaint.createdAt).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> {complaint.category}</span>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full font-bold text-xs ${complaint.status === ComplaintStatus.NEW ? 'bg-blue-100 text-blue-700' :
                complaint.status === ComplaintStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                {complaint.status}
              </span>
            </div>

            <div className="p-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-gray-800 leading-relaxed text-lg mb-8 capitalize">
                {complaint.description}
              </p>

              {complaint.imageBase64 && (
                <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
                  <img src={complaint.imageBase64} alt="Reported Scene" className="w-full object-cover max-h-[400px] transform group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Location</h3>
                  <div className="flex gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-500">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{complaint.location.address}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">{complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meta Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Language:</span>
                      <span className="font-bold capitalize">{complaint.language}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Priority:</span>
                      <span className={`font-bold ${complaint.priority === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{complaint.priority}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-bold">{complaint.department}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Plan & Actions */}
        <div className="space-y-8">
          {/* AI Action Plan */}
          <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl shadow-emerald-900/20">
            <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold uppercase text-xs tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              AI-Generated Action Plan
            </div>
            <div className="space-y-4">
              {complaint.aiAnalysis?.actionPlan.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start group">
                  <div className="bg-white/10 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold group-hover:bg-emerald-500 transition-colors">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-emerald-50/80 leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Controls */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{t('updateStatus')}</h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">{t('currentProgress')}</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={ComplaintStatus.NEW}>New</option>
                  <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                  <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                </select>
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                {isUpdating ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t('confirmUpdate')}
              </button>

              <div className="pt-6 border-t border-gray-50 space-y-3">
                <button
                  onClick={() => alert("Team assigned successfully! Notification sent to: Sanitation Department.")}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  {t('assignTeam')}
                </button>
                <button
                  onClick={() => alert("Report escalated to High Priority. Zonal Commissioner notified.")}
                  className="w-full border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {t('escalateReport')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
