
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Globe,
  Cpu,
  Clock,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Users,
  MapPin,
  ExternalLink,
  Loader2,
  Recycle,
  AlertCircle,
  PlusCircle,
  Search
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { searchNearbyServices, MapsResult } from '../services/geminiService';
import { getComplaints } from '../utils/storage';
import { Complaint, ComplaintStatus } from '../types';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [nearbyResults, setNearbyResults] = useState<MapsResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, active: 0 });

  const TIPS = [
    "Recycling just one aluminum can saves enough energy to run a TV for three hours.",
    "Composting organic waste can reduce household garbage by up to 30%.",
    "Switching to LED bulbs uses 75% less energy than incandescent lighting.",
    "Fixing a leaky faucet can save over 3,000 gallons of water per year.",
    "Planting a single tree can absorb up to 48 pounds of CO2 per year."
  ];

  const [currentTip, setCurrentTip] = useState(TIPS[0]);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const all = await getComplaints();
        setRecentComplaints(all.slice(0, 4));

        const resolvedCount = all.filter(c => c.status === ComplaintStatus.RESOLVED).length;
        setStats({
          total: all.length,
          resolved: resolvedCount,
          active: all.length - resolvedCount
        });
      } catch (error) {
        console.error('Failed to load complaints:', error);
      }
    };
    loadComplaints();
  }, []);

  const handleSearchNearby = async (query: string) => {
    setIsSearching(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      setIsSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const result = await searchNearbyServices(query, pos.coords.latitude, pos.coords.longitude);
      setNearbyResults(result);
      setIsSearching(false);
    }, (err) => {
      alert("Please enable location to find nearby services.");
      setIsSearching(false);
    });
  };

  const showNextTip = () => {
    const currentIndex = TIPS.indexOf(currentTip);
    const nextIndex = (currentIndex + 1) % TIPS.length;
    setCurrentTip(TIPS[nextIndex]);
  };

  return (
    <div className="w-full bg-gray-50 pb-20">
      {/* Header Dashboard Banner */}
      <section className="bg-emerald-900 pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                {t('dashboardTitle')}
              </h1>
              <p className="text-emerald-100/80 font-medium">
                {t('dashboardSubtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/report')}
                className="bg-emerald-400 text-emerald-950 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-lg shadow-emerald-400/20"
              >
                <PlusCircle className="w-5 h-5" />
                {t('reportButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-emerald-900/5 border border-white flex items-center gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <PlusCircle className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900">{stats.total}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('totalReports')}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-emerald-900/5 border border-white flex items-center gap-6">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900">{stats.active}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('activeIssues')}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-emerald-900/5 border border-white flex items-center gap-6">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900">{stats.resolved}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('resolved')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                {t('recentReports')}
              </h2>
              <button
                onClick={() => navigate('/community')}
                className="text-emerald-600 font-bold text-sm hover:underline"
              >
                {t('viewAll')}
              </button>
            </div>

            {recentComplaints.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 border-dashed">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">{t('noComplaints')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentComplaints.map(complaint => (
                  <div key={complaint.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${complaint.status === ComplaintStatus.RESOLVED ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                        {complaint.status}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">#{complaint.id.split('-').pop()}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{complaint.description}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{complaint.location.address}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{complaint.category}</span>
                      <button className="text-emerald-600 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Awareness Section */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Cpu className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-black mb-4">{t('poweredBy')}</h3>
              <p className="text-emerald-50/80 mb-6 max-w-lg leading-relaxed">
                {t('aiDesc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Multi-lingual
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Auto-Routing
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Real-time Data
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Quick Map Search */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                {t('nearbyServices')}
              </h3>
              <p className="text-gray-500 text-sm mb-6">Find local recycling and waste centers instantly.</p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSearchNearby("Recycling centers near me")}
                  disabled={isSearching}
                  className="w-full flex items-center gap-3 bg-gray-50 p-4 rounded-2xl font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent"
                >
                  <Recycle className="w-5 h-5" />
                  {t('recyclingHubs')}
                </button>
                <button
                  onClick={() => handleSearchNearby("Waste management offices near me")}
                  disabled={isSearching}
                  className="w-full flex items-center gap-3 bg-gray-50 p-4 rounded-2xl font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {t('envAuthorities')}
                </button>
              </div>

              {isSearching ? (
                <div className="py-8 text-center text-emerald-600">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <span className="text-xs font-bold uppercase">Locating...</span>
                </div>
              ) : nearbyResults && (
                <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
                  {nearbyResults.links.slice(0, 3).map((link, i) => (
                    <a
                      key={i}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-xl hover:bg-emerald-50 transition-all group"
                    >
                      <span className="text-xs font-bold text-emerald-800 truncate pr-4">{link.title}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">{t('didYouKnow')}</h3>
              <div className="bg-emerald-50 p-6 rounded-3xl min-h-[120px] flex items-center">
                <p className="text-sm text-emerald-800 leading-relaxed italic">
                  "{currentTip}"
                </p>
              </div>
              <button
                onClick={showNextTip}
                className="w-full mt-6 py-3 border border-emerald-100 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-50 transition-all text-sm"
              >
                {t('learnMoreTips')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
