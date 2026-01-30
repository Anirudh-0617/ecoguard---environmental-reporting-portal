
import React from 'react';
import { Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start items-center gap-2 text-emerald-600 font-semibold mb-2">
              <Leaf className="w-6 h-6" />
              <span className="text-xl font-bold">EcoGuard</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Empowering citizens to build cleaner, safer communities through AI-driven reporting and real-time action.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-600/20">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-100">Intelligence Engine</p>
              <p className="font-bold text-lg leading-none">Powered by Gemini AI</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EcoGuard Environmental Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
