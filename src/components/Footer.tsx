import React from 'react';

const Footer = ({ onPrivacyClick, onEthicsClick }: { onPrivacyClick?: () => void; onEthicsClick?: () => void }) => (
  <footer className="w-full py-4 px-2 bg-black/60 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
    <div className="flex items-center gap-2">
      <span className="font-bold text-white">Okra</span>
      <span className="hidden md:inline">© {new Date().getFullYear()} All rights reserved.</span>
    </div>
    <div className="flex items-center gap-4">
      <button className="underline hover:text-white transition" onClick={onPrivacyClick}>Privacy Policy</button>
      <button className="underline hover:text-white transition" onClick={onEthicsClick}>Responsible AI & Disclaimer</button>
    </div>
  </footer>
);

export default Footer; 