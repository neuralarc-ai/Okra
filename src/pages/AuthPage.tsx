import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { signIn, signUp } from "@/services/authService";
import { toast } from "sonner";
import { getSupabaseClient } from '@/lib/supabase';
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

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

// Initialize Supabase client
const supabase = getSupabaseClient();

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobile?: string;
}

const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][
    strength
  ];
  const strengthColor = ["#ff4444", "#ffbb33", "#ffeb3b", "#00C851", "#007E33"][
    strength
  ];

  return null; // Removed unused JSX
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (activeTab === "signup") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password = "Password must meet all requirements";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }
    } else {
      if (!formData.email) {
        newErrors.email = "Email is required";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoadingForm(true);

    if (!validateForm()) {
      setLoadingForm(false);
      return;
    }

    try {
      if (activeTab === "signup") {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (error) {
          throw new Error(error.message);
        }
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        setActiveTab("login");
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          throw new Error(error.message);
        }
        toast.success("Logged in successfully!");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
    } finally {
      setLoadingForm(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google Sign-in Error:', error);
        throw error;
      }

      // The redirect will happen automatically
      console.log('Google Sign-in initiated:', data);
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      setError(err.message || "An error occurred during Google sign in");
      toast.error(err.message || "An error occurred during Google sign in");
    }
  };

  const starfieldVariants = undefined;
  const ellipseVariants = undefined;

  return (
    <div className="flex flex-col min-h-screen grain-texture font-fustat">
      <LoginNavbar />
      <div className="flex-grow flex flex-row items-center justify-center gap-12 max-w-[1440px] mx-auto mb-12">
        {/* Left blank card */}

        <div className="min-w-[634px] h-[80vh] rounded-[16px] overflow-hidden">
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/loginbg.png)' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <img
                src="/loginspark.png"
                alt="Login Spark"
                className="object-contain mix-blend-overlay"
              />
            </div>
          </div>
        </div>
        {/* Right login/signup section */}
        <div>
          <div className="flex justify-left mb-6">
            <div className="bg-[#D4D4D4] rounded-xl p-1 flex">
              <button
                className={`px-6 py-2 text-base font-normal rounded-md transition-all duration-200 focus:outline-none
                  ${activeTab === "login"
                    ? "bg-[#362716] text-white shadow"
                    : "bg-transparent text-[#404040]"
                  }
                `}
                style={{ marginRight: '4px' }}
                onClick={() => {
                  setActiveTab("login");
                  setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    mobile: "",
                  });
                  setErrors({});
                }}
              >
                Log In
              </button>
              <button
                className={`px-6 py-2 text-base font-normal rounded-md transition-all duration-200 focus:outline-none
                  ${activeTab === "signup"
                    ? "bg-[#362716] text-white shadow"
                    : "bg-transparent text-[#404040]"
                  }
                `}
                onClick={() => {
                  setActiveTab("signup");
                  setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    mobile: "",
                  });
                  setErrors({});
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <div
              className="min-w-[676px] bg-[#E4E7DF] rounded-[20px] shadow-none="

            >
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
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                {activeTab === "login" ? (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6 w-full min-w-[548px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}

                  >
                    <div className=" p-4">
                      <div className="bg-[#FFFFFF] rounded-[8px]">
                        <div className="pt-4 px-8">
                          <label className="block text-[15px] font-medium text-black text-left pt-2">
                            User Name
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full h-16 bg-[#F8F8F8] border ${errors.email ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg mt-4  pl-4 pr-4 text-[#202020] placeholder:text-[gray/500] focus:outline-none bg-[#E3E6E0]`}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          {errors.email && (
                            <span className="text-destructive text-sm">
                              {errors.email}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between px-8 items-center pt-4">
                            <label className="block text-[15px]text-black text-left ">
                              Password
                            </label>
                            <span
                              className="text-sm text-[#949494] hover:text-[#949494]/80 cursor-pointer  text-decoration-line: underline"
                              onClick={() => navigate("/auth/forgot-password")}
                            >
                              Forgot password?
                            </span>
                          </div>
                          <div className="relative pb-8 px-8">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`w-full h-16 bg-[#F8F8F8] border ${errors.password ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg mt-4 pl-4 pr-10 text-[#202020] placeholder:text-[gray/500] focus:outline-none bg-[#E3E6E0]`}
                              placeholder="Enter your password"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-12 top-1/3 text-[#696969] hover:text-black"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <span className="text-destructive text-sm">
                              {errors.password}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4 mt-8">
                        <motion.button
                          type="button"
                          className="w-full border border-[#0000001A] bg-[#FFFFFF47] text-[#000000] rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#FFFFFF47]/80"
                          whileTap={{ scale: 0.98 }}
                          onClick={handleGoogleSignIn}
                        >
                          <img
                            src="/Gblack.svg"
                            alt="Google"
                            className="w-5 h-5"
                          />
                          Sign in with Google
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="w-full bg-[#232323] text-white rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#111]"
                          whileTap={{ scale: 0.98 }}
                          disabled={loadingForm}
                        >
                          {loadingForm ? "Signing in..." : "Sign In"}
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>



                  </motion.form>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6 w-full min-w-[548px] mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4">
                      <div className="bg-[#FFFFFF] rounded-[16px]">
                        <div className="px-8 pt-8">
                          <label className="block text-[15px] font-medium text-black text-left">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className={`w-full h-16 bg-[#F8F8F8] border ${errors.fullName ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg mt-4 pl-4 pr-4 text-[#202020] placeholder:text-[gray/500] focus:outline-none bg-[#E3E6E0] `}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          {errors.fullName && (
                            <span className="text-destructive text-sm">
                              {errors.fullName}
                            </span>
                          )}
                        </div>

                        <div className=" px-8">
                          <label className="block text-[15px] mt-4 font-medium text-black text-left">
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full h-16 bg-[#F8F8F8] border ${errors.email ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg mt-4 pl-4 pr-4 text-[#202020] placeholder:text-[gray/500] focus:outline-none bg-[#E3E6E0]`}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          {errors.email && (
                            <span className="text-destructive text-sm">
                              {errors.email}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 px-8">
                          <label className="block text-[15px] mt-4 font-medium text-black text-left">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`w-full h-16 bg-[#F8F8F8] border ${errors.password ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg mt-4 pl-4 pr-10 text-[#202020] placeholder:text-[gray/500] focus:outline-none bg-[#E3E6E0]`}
                              placeholder="Create a password"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-[60%] -translate-y-1/2 text-[#696969] hover:text-black"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          
                          {errors.password && (
                            <span className="text-destructive text-sm">
                              {errors.password}
                            </span>
                          )}


                        </div>

                        <div className="space-y-2 px-8">
                          <label className="block text-[15px] mt-4 font-medium text-black text-left">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`w-full h-16 bg-[#F8F8F8] border ${errors.confirmPassword ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg mt-2 pl-4 pr-10 text-[#202020] placeholder:text-[gray/500] focus:outline-none bg-[#E3E6E0]`}
                              placeholder="Confirm your password"
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-[55%] -translate-y-1/2 text-[#696969] hover:text-black"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <span className="text-destructive text-sm">
                              {errors.confirmPassword}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 pb-6 px-8 ">
                          <label className="block text-[15px] mt-4 font-medium text-black text-left">
                            Mobile No.
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              className={`w-full h-16 bg-[#F8F8F8] border ${errors.mobile ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg mt-2 pl-4 pr-4 text-[#202020] placeholder:text-[gray/500] focus:outline-none bg-[#E3E6E0]`}
                              placeholder="Enter your mobile number"
                            />
                          </div>
                          {errors.mobile && (
                            <span className="text-destructive text-sm">
                              {errors.mobile}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-6 p-4 overflow-hidden">
                        <div className="flex gap-4">
                          <motion.button
                            type="button"
                            className="w-full border border-[#0000001A] bg-[#FFFFFF47] text-[#000000] rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#FFFFFF47]/80"
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogleSignIn}
                          >
                            <img
                              src="/Gblack.svg"
                              alt="Google"
                              className="w-5 h-5"
                            />
                            Sign up with Google
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="w-full bg-[#232323] text-white rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#111]"
                            whileTap={{ scale: 0.98 }}
                            disabled={loadingForm}
                          >
                            {loadingForm ? "Creating account..." : "Sign Up"}
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                    </div>
                  </motion.form>

                )}

              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage; 