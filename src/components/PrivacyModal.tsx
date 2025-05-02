import React from 'react';

const PrivacyModal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#18181b] rounded-lg shadow-lg max-w-lg w-full mx-2 p-6 relative border border-white/10">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
        <div className="text-sm text-gray-200 max-h-[60vh] overflow-y-auto pr-2 whitespace-pre-line">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal; 