import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getSupabaseClient } from '@/lib/supabase';
import Footer from "@/components/Footer";

// Simplified Navbar with just the logo
const LoginNavbar = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <h1 className="font-['Fustat'] font-medium text-[32px] leading-[40px] tracking-[0.03em] text-center align-middle">Helium AI</h1>
        </div>
      </div>
    </nav>
  );
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset link sent! Please check your email.");
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen grain-texture font-fustat">
      <LoginNavbar />
      <div className="flex-grow flex flex-row items-center justify-center gap-12 max-w-[1440px] mx-auto mb-12">
        {/* Left blank card */}
        <div className="min-w-[634px] h-[calc(100vh-210px)] rounded-[16px] overflow-hidden">
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/loginbg.png)' }}
            ></div>
            <img
              src="/loginspark.png"
              alt="Login Spark"
              className="w-full h-full object-cover relative z-10 mix-blend-overlay"
            />
          </div>
        </div>

        {/* Right form section */}
        <div>
          <div className="flex justify-left mb-6">
            <h2 className="text-3xl font-semibold text-[#202020]">Reset Password</h2>
          </div>
          
          <div className="min-w-[676px] bg-cover bg-center bg-no-repeat rounded-[20px] shadow-none" 
            style={{ backgroundImage: 'url(/images/loginbg.png)' }}>
            {error && (
              <motion.div
                className="mb-4 text-destructive text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {error}
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6 w-full min-w-[548px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4">
                  <div className="bg-[#CFD4C9] rounded-[8px]">
                    <div className="p-6">
                      <label className="block text-[15px] font-medium text-black text-left pt-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-16 bg-[#E3E6E0] border border-[#BDBDBD] rounded-lg mt-4 pl-4 pr-4 text-[#202020] placeholder:text-[gray/500] focus:outline-none"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <motion.button
                      type="button"
                      className="w-full border border-[#0000001A] bg-[#FFFFFF47] text-[#000000] rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#FFFFFF47]/80"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/auth")}
                    >
                      Back to Login
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="w-full bg-[#232323] text-white rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#111]"
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage; 