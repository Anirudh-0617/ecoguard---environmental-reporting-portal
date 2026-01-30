
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  ExternalLink,
  Info,
  Loader2,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getComplaints, updateComplaint, deleteComplaint } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { Complaint, ComplaintStatus } from '../types';

const TrackComplaintsPage: React.FC = () => {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        const data = await getComplaints(currentUser?.id);
        setComplaints(data);
      } catch (error) {
        console.error('Failed to load complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadComplaints();
  }, []);

  const filtered = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.NEW: return 'bg-blue-100 text-blue-700';
      case ComplaintStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700';
      case ComplaintStatus.RESOLVED: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleRateSubmit = async () => {
    if (selectedComplaint) {
      const updated = { ...selectedComplaint, rating, feedback };
      await updateComplaint(updated);
      const refreshed = await getComplaints();
      setComplaints(refreshed);
      setIsRatingModalOpen(false);
      setSelectedComplaint(null);
      setRating(0);
      setFeedback('');
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      await deleteComplaint(id);
      const currentUser = getCurrentUser();
      const refreshed = await getComplaints(currentUser?.id);
      setComplaints(refreshed);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('trackTitle')}</h1>
          <p className="text-gray-500">Monitoring environmental resolution progress across the city.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value={ComplaintStatus.NEW}>New</option>
            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
            <Info className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Either you haven't reported any issues yet, or your search didn't match anything.</p>
          <button
            onClick={() => window.location.hash = '/report'}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {t('reportButton')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              {complaint.imageBase64 && (
                <div className="h-40 overflow-hidden">
                  <img src={complaint.imageBase64} alt="Issue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mb-2 inline-block">
                      {complaint.id}
                    </span>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{complaint.description}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{complaint.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Priority</span>
                    <span className={`text-xs font-bold ${complaint.priority === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  {complaint.status === ComplaintStatus.RESOLVED && complaint.rating === null ? (
                    <button
                      onClick={() => { setSelectedComplaint(complaint); setIsRatingModalOpen(true); }}
                      className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      {t('rateButton')}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      {complaint.rating && [...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < complaint.rating! ? 'fill-emerald-500 text-emerald-500' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Resolution</h2>
            <p className="text-gray-500 text-sm mb-6">How satisfied are you with the resolution of your environmental concern?</p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-full transition-all ${rating >= star ? 'text-emerald-500' : 'text-gray-300'}`}
                >
                  <Star className={`w-8 h-8 ${rating >= star ? 'fill-emerald-500' : ''}`} />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Any feedback on the response? (Optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={rating === 0}
                onClick={handleRateSubmit}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComplaintsPage;
