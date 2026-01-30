
import React from 'react';
import { Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-2 text-emerald-600 font-semibold mb-4">
          <Leaf className="w-6 h-6" />
          <span>EcoGuard</span>
        </div>
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} EcoGuard Environmental Portal. All rights reserved.
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Empowering citizens through AI-driven environmental reporting.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
