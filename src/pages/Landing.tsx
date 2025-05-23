import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from '@/components/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-[#FBFAF8]">
      {/* No dark background image for light theme */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 animate-fadeUp">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#1E1E1E] tracking-tight text-center">
                Okra AI
              </h1>
            </div>
            <h2 className="text-xl md:text-2xl text-[#222] font-medium text-center max-w-2xl">
              AI-powered research analyst for startups and innovators. Instantly validate your ideas, analyze competitors, and get actionable insights—beautifully, securely, and fast.
            </h2>
            <Button
              size="lg"
              className="mt-4 bg-[#302D2A] text-white font-semibold text-lg px-10 py-4 rounded-[4px] hover:bg-[#47423C] transition-all duration-300 border-none shadow-none"
              onClick={() => navigate("/app")}
            >
              Get Started
            </Button>
          </div>
          <div className="mt-20 flex flex-col items-center gap-6 animate-fadeUp">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-[8px] p-6 border border-[#E5E7EB] text-[#1E1E1E] text-center shadow-none">
                <h3 className="text-lg font-bold mb-2">Market Validation</h3>
                <p className="text-[#222] text-sm">Instantly assess your idea's potential with AI-driven validation and scoring.</p>
              </div>
              <div className="bg-white rounded-[8px] p-6 border border-[#E5E7EB] text-[#1E1E1E] text-center shadow-none">
                <h3 className="text-lg font-bold mb-2">Competitor Insights</h3>
                <p className="text-[#222] text-sm">See real competitors, strengths, and market gaps—no research required.</p>
              </div>
              <div className="bg-white rounded-[8px] p-6 border border-[#E5E7EB] text-[#1E1E1E] text-center shadow-none">
                <h3 className="text-lg font-bold mb-2">Actionable Reports</h3>
                <p className="text-[#222] text-sm">Get beautiful, shareable reports with pricing, forecasts, and more.</p>
              </div>
              <div className="bg-white rounded-[8px] p-6 border border-[#E5E7EB] text-[#1E1E1E] text-center shadow-none">
                <h3 className="text-lg font-bold mb-2">Go-to-Market Strategy</h3>
                <p className="text-[#222] text-sm">Receive tailored go-to-market plans and launch strategies for your product or service.</p>
              </div>
              <div className="bg-white rounded-[8px] p-6 border border-[#E5E7EB] text-[#1E1E1E] text-center shadow-none">
                <h3 className="text-lg font-bold mb-2">Financial Forecasts</h3>
                <p className="text-[#222] text-sm">Get detailed financial projections and revenue models to plan your growth.</p>
              </div>
              <div className="bg-white rounded-[8px] p-6 border border-[#E5E7EB] text-[#1E1E1E] text-center shadow-none">
                <h3 className="text-lg font-bold mb-2">Shareable PDF Reports</h3>
                <p className="text-[#222] text-sm">Download and share professional PDF reports with your team or investors.</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Landing; 