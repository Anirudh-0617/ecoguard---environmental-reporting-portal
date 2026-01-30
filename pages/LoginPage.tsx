
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock,
  Building
} from 'lucide-react';
import { loginUser } from '../utils/auth';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'citizen' | 'official'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dept, setDept] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'citizen') {
      loginUser({ type: UserRole.CITIZEN, email });
      navigate('/'); // Go to intelligent root
    } else {
      loginUser({ type: UserRole.OFFICIAL, email, department: dept });
      navigate('/official/dashboard');
    }
  };

  const handleGuest = () => {
    loginUser({ type: UserRole.GUEST });
    navigate('/'); // Go to intelligent root
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">EcoGuard Portal: Protecting our community together.</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-emerald-900/5 border border-gray-100 overflow-hidden p-2">
          {/* Tabs */}
          <div className="flex bg-gray-50 p-1.5 rounded-[32px] mb-4">
            <button 
              onClick={() => setActiveTab('citizen')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[28px] font-bold transition-all ${
                activeTab === 'citizen' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Citizen
            </button>
            <button 
              onClick={() => setActiveTab('official')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[28px] font-bold transition-all ${
                activeTab === 'official' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Official
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 pt-2 space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-700"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-700"
                />
              </div>

              {activeTab === 'official' && (
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <select 
                    required
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-700 appearance-none"
                  >
                    <option value="">Select Department</option>
                    <option value="GHMC">Sanitation (GHMC)</option>
                    <option value="TPCB">Pollution Control (TPCB)</option>
                    <option value="Water">Water Board (HMWS&SB)</option>
                  </select>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              Login as {activeTab === 'citizen' ? 'Citizen' : 'Official'}
              <ArrowRight className="w-5 h-5" />
            </button>

            {activeTab === 'citizen' && (
              <div className="pt-4 text-center">
                <button 
                  type="button"
                  onClick={handleGuest}
                  className="text-gray-500 font-bold hover:text-emerald-600 transition-colors underline underline-offset-4"
                >
                  Continue as Guest
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
