
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

  const steps = [
    {
      number: "01",
      title: "Snap & Describe",
      description: "Take a photo and add a short description. Our AI analyzes both to fully understand and categorize the problem."
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Gemini AI instantly scans your report, assigns priority, and routes it to the exact right department."
    },
    {
      number: "03",
      title: "Problem Solved",
      description: "Authorities are notified immediately. Track the cleanup progress in real-time until it's done."
    }
  ];

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
    <div className="w-full bg-white font-sans">
      {/* Hero Section - Background Preserved */}
      <section className="relative min-h-[90vh] flex items-center bg-emerald-900 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000"
            alt="Nature Background"
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/70 to-emerald-900/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-12">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 font-bold text-xs uppercase tracking-widest mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Spot It. Report It.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Get It Fixed.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-100/80 mb-12 max-w-2xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000">
              The easiest way to keep your city clean. Simply upload a photo, and our <span className="text-white font-semibold">AI Assistant</span> handles the paperwork, routing it directly to the officials who can fix it.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <button
                onClick={handleStart}
                className="bg-emerald-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 border-4 border-emerald-500/30 bg-clip-padding"
              >
                Report an Issue Now
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">How EcoGuard Works</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We've simplified environmental reporting down to three simple steps. No forms, no confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-gray-50 pt-4">
                <div className="w-16 h-16 bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center text-xl font-black text-emerald-600 shadow-xl mx-auto mb-8 relative z-10">
                  {step.number}
                </div>
                <div className="text-center px-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-6">
              AI Powered Technology
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
              We Speak Your Language.<br />And the Government's.
            </h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Language barriers shouldn't stop you from improving your community.
              EcoGuard translates your reports from Hindi, Telugu, or English directly into official formats for the authorities.
            </p>

            <div className="space-y-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{feature.title}</h4>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-100 rounded-3xl transform rotate-3" />
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Official Dashboard</div>
                    <div className="text-xs text-gray-400">GHMC Sanitation Dept</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">High Priority</div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 bg-[url('https://images.unsplash.com/photo-1530587210959-1678122906ec?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center" />
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-1">Heap of garbage on Main Road</div>
                    <div className="text-xs text-gray-500 mb-2">Reported 2 hours ago • Madhapur</div>
                    <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Analysis: Solid Waste Category
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-emerald-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-10">Trusted Partner of</p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-60">
            <h3 className="text-white text-3xl font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default">GHMC</h3>
            <h3 className="text-white text-3xl font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default">POLLUTION BOARD</h3>
            <h3 className="text-white text-3xl font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default">HMWS&SB</h3>
            <h3 className="text-white text-3xl font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default">FOREST DEPT</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
