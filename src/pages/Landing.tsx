import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from '@/components/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-[url('/background2.png')] bg-cover bg-top z-0"
      />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 animate-fadeUp">
          <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center rounded-full bg-white/10 p-3">
                <Sparkles className="text-white w-8 h-8 animate-pulse" />
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight text-center">
                Okra AI
              </h1>
            </div>
            <h2 className="text-xl md:text-2xl text-white/80 font-medium text-center max-w-2xl">
              AI-powered research analyst for startups and innovators. Instantly validate your ideas, analyze competitors, and get actionable insights—beautifully, securely, and fast.
            </h2>
            <Button
              size="lg"
              className="mt-4 bg-white text-black font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
              onClick={() => navigate("/app")}
            >
              Get Started
            </Button>
          </div>
          <div className="mt-20 flex flex-col items-center gap-6 animate-fadeUp">
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-white text-center shadow-md">
                <h3 className="text-lg font-bold mb-2">Market Validation</h3>
                <p className="text-white/80 text-sm">Instantly assess your idea's potential with AI-driven validation and scoring.</p>
              </div>
              <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-white text-center shadow-md">
                <h3 className="text-lg font-bold mb-2">Competitor Insights</h3>
                <p className="text-white/80 text-sm">See real competitors, strengths, and market gaps—no research required.</p>
              </div>
              <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-white text-center shadow-md">
                <h3 className="text-lg font-bold mb-2">Actionable Reports</h3>
                <p className="text-white/80 text-sm">Get beautiful, shareable reports with pricing, forecasts, and more.</p>
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