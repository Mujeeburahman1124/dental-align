import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>© 2026 DentAlign. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#007AFF]">Privacy</a>
          <a href="#" className="hover:text-[#007AFF]">Terms</a>
          <a href="#" className="hover:text-[#007AFF]">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
