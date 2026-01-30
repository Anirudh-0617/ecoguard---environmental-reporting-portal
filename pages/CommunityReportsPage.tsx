
import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Star,
    Info,
    Loader2
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getComplaints } from '../utils/storage';
import { Complaint, ComplaintStatus } from '../types';

const CommunityReportsPage: React.FC = () => {
    const { t } = useLanguage();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadComplaints = async () => {
            setIsLoading(true);
            try {
                // Fetch ALL complaints (no userId filter)
                const data = await getComplaints();
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Community Reports</h1>
                    <p className="text-gray-500">See what's happening in your neighborhood. Real-time updates from all citizens.</p>
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No reports found</h3>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">There are no community reports matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(complaint => (
                        <div key={complaint.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer">
                            {complaint.imageBase64 && (
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 z-10" />
                                    <img src={complaint.imageBase64} alt="Issue" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <span className={`absolute bottom-3 right-3 z-20 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md ${complaint.status === ComplaintStatus.RESOLVED ? 'bg-emerald-500/90 text-white' :
                                            complaint.status === ComplaintStatus.IN_PROGRESS ? 'bg-amber-500/90 text-white' :
                                                'bg-blue-500/90 text-white'
                                        }`}>
                                        {complaint.status}
                                    </span>
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                                                #{complaint.id.split('-').pop()}
                                            </span>
                                            {!complaint.imageBase64 && (
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 capitalize mb-1 group-hover:text-emerald-700 transition-colors">
                                            {complaint.description}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2.5 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                        <span className="truncate font-medium">{complaint.location.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-500 px-2">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                        <span>Reported on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Priority</span>
                                        <span className={`text-xs font-black uppercase tracking-wide ${complaint.priority === 'High' ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                                        {complaint.rating ? [...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < complaint.rating! ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                        )) : <span className="text-[10px] font-bold text-gray-400">Not Rated</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityReportsPage;
