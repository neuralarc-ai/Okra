import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { LogOut, History, Gem } from 'lucide-react';
import { Button } from './ui/button';

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const supabase = getSupabaseClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Logged out successfully!');
      navigate('/auth');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'An error occurred during logout.');
    }
  };

  // Placeholder for token usage, you'd replace this with actual data
  const usedTokens = 9233;
  const totalTokens = 20000;
  const tokenPercentage = (usedTokens / totalTokens) * 100;

  if (loading) {
    return null; // Or a loading spinner
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';
  const userEmail = user?.email || 'N/A';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 bg-[#D4D4D4]">
            <AvatarFallback className="text-[#362716]">{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white shadow-lg rounded-lg p-4" align="end" forceMount>
        <DropdownMenuLabel className="font-normal mb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-[#202020]">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground text-[#696969]">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#E0E0E0]" />
        <DropdownMenuGroup>
          <div className="my-4 p-3 bg-[#F8F8F8] rounded-md flex flex-col space-y-2">
            <p className="text-sm text-[#202020]">Token Usage</p>
            <Progress value={tokenPercentage} className="h-2 bg-[#E0E0E0]" indicatorClassName="bg-gradient-to-r from-purple-400 to-pink-500" />
            <p className="text-xs text-right text-[#696969]">{usedTokens} / {totalTokens}</p>
          </div>
          <DropdownMenuItem className="cursor-pointer text-[#202020] hover:bg-[#F8F8F8] rounded-md px-3 py-2 flex items-center gap-2" onClick={() => navigate('/history')}>
            <History className="h-4 w-4 text-[#696969]" />
            <span>History</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-[#202020] hover:bg-[#F8F8F8] rounded-md px-3 py-2 flex items-center gap-2" onClick={() => navigate('/upgrade')}>
            <Gem className="h-4 w-4 text-[#696969]" />
            <span>Upgrade Plan</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#E0E0E0]" />
        <DropdownMenuItem className="cursor-pointer text-[#E54848] hover:bg-[#FEEAEA] rounded-md px-3 py-2 flex items-center gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4 text-[#E54848]" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu; 