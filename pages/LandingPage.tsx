
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Clock, 
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Users,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { isAuthenticated } from '../utils/auth';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleStart = () => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <Globe className="w-6 h-6 text-emerald-500" />,
      title: "Multi-Language Support",
      description: "Report environmental issues in English, Hindi, or Telugu seamlessly.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-500" />,
      title: "AI-Driven Insights",
      description: "Automated categorization and routing powered by Gemini AI.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
      title: "Smart Action Plans",
      description: "Officials receive AI-generated resolution steps instantly.",
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-emerald-900 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" 
            alt="Nature Background" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-950/40 to-emerald-950/90" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4" />
              The Future of Urban Care
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Protect Your <span className="text-emerald-400">Environment</span> in Your Language.
            </h1>
            <p className="text-xl text-emerald-100/70 mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
              EcoGuard connects citizens with local authorities through AI-powered reporting. Fast, transparent, and built for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <button 
                onClick={handleStart}
                className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20"
              >
                Enter Portal
                <ArrowRight className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-6 px-2">
                 <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-900 bg-emerald-800 flex items-center justify-center text-[10px] font-bold text-emerald-200">
                       {i}
                     </div>
                   ))}
                 </div>
                 <div className="text-sm">
                   <div className="text-white font-bold">12,000+ Citizens</div>
                   <div className="text-emerald-400/80 text-xs">Improving our city together</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="group p-8 rounded-3xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all">
              <div className="mb-6 bg-emerald-50 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-16">Trusted by Local Municipalities</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="font-black text-2xl tracking-tighter">GHMC</div>
            <div className="font-black text-2xl tracking-tighter">PCB</div>
            <div className="font-black text-2xl tracking-tighter">WATER BOARD</div>
            <div className="font-black text-2xl tracking-tighter">MUNICIPAL</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
