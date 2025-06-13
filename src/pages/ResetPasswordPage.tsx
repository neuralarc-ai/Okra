import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getSupabaseClient } from '@/lib/supabase';
import Footer from "@/components/Footer";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Check if we have access to update password
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link");
        navigate("/auth/login");
      }
    };

    checkAccess();
  }, [navigate, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        throw error;
      }

      toast.success("Password updated successfully!");
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF8]">
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]">
          <img
            src="/images/white-radial.svg"
            alt="Radial gradient"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex justify-center pt-20">
          <h1 className="font-['Fustat'] font-medium text-[32px] leading-[40px] tracking-[0.03em] text-center align-middle">Helium AI</h1>
        </div>

        <div className="flex items-center justify-center px-4">
          <div className="relative w-[676px] min-h-[500px] max-w-[90vw] rounded-[16px] overflow-hidden p-1 bg-gradient-to-br from-[#CFD4C9] via-[#E4E7DF] to-[#E3E6E0]">
            <img
              src="/background2.png"
              alt="Gradient Background"
              className="absolute inset-0 w-full h-full object-cover rounded-[15px] z-0"
            />
            <div className="relative z-10 w-full h-full p-8 flex flex-col bg-white/70 backdrop-blur-sm rounded-[15px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-2xl font-semibold text-[#202020] mb-6 text-center">Set New Password</h2>
                <p className="text-[#696969] text-center mb-8">
                  Please enter your new password below.
                </p>

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

                <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[548px] mx-auto">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#202020] text-left">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-16 bg-[#E3E6E0] border border-[#BDBDBD] rounded-lg py-2 pl-4 pr-10 text-[#202020] placeholder:text-[#949494] focus:outline-none focus:ring-2 focus:ring-[#232323] focus:border-[#232323]"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696969] hover:text-[#202020]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#202020] text-left">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full h-16 bg-[#E3E6E0] border border-[#BDBDBD] rounded-lg py-2 pl-4 pr-10 text-[#202020] placeholder:text-[#949494] focus:outline-none focus:ring-2 focus:ring-[#232323] focus:border-[#232323]"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696969] hover:text-[#202020]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-[#232323] text-white rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#111]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/auth/login")}
                      className="text-[#404040] hover:text-[#232323] text-sm underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default ResetPasswordPage; 