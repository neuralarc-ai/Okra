import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ open, onClose, user, onLogout }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="card-bg hover-card shadow-lg rounded-xl border border-white/10 w-full max-w-md animate-fadeUp p-0">
        <CardHeader className="flex flex-row items-start justify-between pb-2 pt-6 px-6">
          <div>
            <CardTitle className="text-2xl font-bold text-white mb-1">User Profile & Token Usage</CardTitle>
            <p className="text-white/60 text-sm mt-1">Manage your account and monitor token usage</p>
          </div>
          <button
            className="text-white/60 hover:text-white text-xl ml-4 mt-1"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </CardHeader>
        <CardContent className="pt-0 px-6 pb-2">
          <div className="mb-4 mt-2">
            <div className="text-lg font-semibold text-white">{user?.name || 'User'}</div>
            <div className="text-sm text-white/60">{user?.email || ''}</div>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-[#9b87f5]/20 text-[#9b87f5] px-2 py-1 rounded-full font-semibold">Ultra Plan</span>
              <span className="text-xs text-white/40">Token Usage</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] h-3 rounded-full" style={{ width: '7.5%' }} />
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>37,547 / 500,000</span>
              <span>7.5%</span>
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/50">
              <span>Total Used</span>
              <span>37,547</span>
            </div>
            <div className="flex justify-between text-xs text-white/50">
              <span>Remaining</span>
              <span>462,453</span>
            </div>
          </div>
          <div className="mb-6">
            <div className="text-xs text-white/60 mb-1">Support</div>
            <div className="text-sm text-white/80">support@rovyk.com</div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center px-6 pb-6 pt-0">
          <button
            className="w-full py-3 rounded-lg bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-semibold text-lg shadow-md transition-all duration-300"
            onClick={onLogout}
          >
            Logout
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountModal; 