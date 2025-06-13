import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, History, TrendingUp, User as UserIcon } from 'lucide-react';

const UserMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Logged out successfully!');
      navigate('/auth', { replace: true });
    } catch (error: any) {
      console.error('Logout Error:', error);
      toast.error(error.message || 'An error occurred during logout');
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';
  const userEmail = user?.email || '';
  const avatarFallback = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Placeholder for token usage - you will need to integrate actual token usage
  const tokenUsed = 9233;
  const tokenLimit = 20000;
  const tokenPercentage = (tokenUsed / tokenLimit) * 100;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative z-50 w-[72px] h-[72px] rounded-full p-3.5 flex items-center justify-center bg-[#4C4740] bg-opacity-45 cursor-pointer transition-all duration-200 hover:opacity-80 shadow-[0px_15px_8.1px_rgba(0,0,0,0.1)]"
        >
          {/* Inner circle */}
          <div className="w-[44px] h-[44px] rounded-full bg-[#29241E] flex flex-col items-center justify-center space-y-[9.5px]">
            {/* Horizontal lines */}
            <div className="w-[18.5px] h-[1.5px] bg-[#F8F8F8]"></div>
            <div className="w-[18.5px] h-[1.5px] bg-[#F8F8F8]"></div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[330px]  p-3 bg-[#38312C] text-white rounded-[12px] shadow-lg border-[1.5px] border-[#404040]" align="end" forceMount>
        {user && (
          <>
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12 bg-[#333333] text-white flex-shrink-0">
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-white">{userName}</p>
                <p className="text-sm text-[#AAAAAA]">{userEmail}</p>
              </div>
            </div>
            <div className="mb-4 p-3 bg-[#2D2623] rounded-lg">
              <div className="flex justify-between items-center mb-2 mt-2">
                <p className="text-[18px] leading-5 text-white" style={{ fontFamily: 'Fustat', fontWeight: 400, letterSpacing: '0%' }}>Token Usage</p>
                <div
                  className="px-3 py-1 rounded-full text-[#202020] font-medium text-sm whitespace-nowrap"
                  style={{
                    background: `linear-gradient(to right, #D9C3BA, #94E4E6)`,
                  }}
                >
                  {tokenUsed.toLocaleString()} / {tokenLimit.toLocaleString()}
                </div>
              </div>
              <div className="w-full bg-[#404040] rounded-full h-2.5 mb-2 mt-5">
                <div
                  className="h-2.5 rounded-full "
                  style={{
                    width: `${tokenPercentage}%`,
                    background: `linear-gradient(to right, #6A67FB, #FF67C4)`,
                  }}
                ></div>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-[#404040] my-3" />
          </>
        )}
        <DropdownMenuItem 
          onClick={() => navigate('/history')} 
          className="flex items-center gap-3 py-2 px-3 text-white cursor-pointer hover:bg-[#404040] rounded-md transition-colors"
        >
          <History className="w-5 h-5 text-[#AAAAAA]" />
          History
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/upgrade')} 
          className="flex items-center gap-3 py-2 px-3 text-white cursor-pointer hover:bg-[#404040] rounded-md transition-colors"
        >
          <TrendingUp className="w-5 h-5 text-[#AAAAAA]" />
          Upgrade Plan
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="flex items-center gap-3 py-2 px-3 text-white cursor-pointer hover:bg-[#404040] rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5 text-[#AAAAAA]" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu; 