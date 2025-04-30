
import React, { useEffect, useState } from 'react';
import { Sparkles, BarChart, Network, Globe, Search, Gauge, Users, Brain } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  source: string;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress, source }) => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, size: number, speed: number, opacity: number, color: string}>>([]);
  
  // Generate random particles for the animation
  useEffect(() => {
    const particleCount = 25;
    const colors = ['#ffffff', '#9b87f5', '#7E69AB', '#61dafb'];
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setParticles(newParticles);
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + particle.speed) % 100
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Analysis steps with icons
  const analysisSteps = [
    { name: 'Market research', icon: <Globe size={16} /> },
    { name: 'Competitor analysis', icon: <Network size={16} /> },
    { name: 'Target audience', icon: <Users size={16} /> },
    { name: 'Business model validation', icon: <Gauge size={16} /> },
    { name: 'Revenue projections', icon: <BarChart size={16} /> },
    { name: 'Risk assessment', icon: <Brain size={16} /> }
  ];

  return (
    <div className="w-full max-w-2xl animate-fadeUp mt-8 p-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
      <div className="mb-5 flex items-center gap-2">
        <div className="p-2 bg-white/10 rounded-full">
          <Search className="text-white h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg text-white font-medium tracking-wide">Deep Analysis in Progress</h3>
          <p className="text-sm text-white/70">{source}</p>
        </div>
      </div>
      
      <div className="progress-container h-3 relative overflow-hidden mb-6">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
        
        {/* Particle overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(particle => (
            <div 
              key={particle.id}
              className="absolute top-0 h-full rounded-full"
              style={{
                left: `${particle.x}%`,
                width: `${particle.size}px`,
                opacity: particle.opacity,
                backgroundColor: particle.color,
                transform: `translateX(-${particle.size / 2}px)`,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px ${particle.color}80`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-white/80 font-medium flex items-center gap-1">
          <Sparkles size={16} className="animate-pulse" /> Okra Ai is researching your idea
        </span>
        <span className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded-full">
          {progress}%
        </span>
      </div>
      
      {/* Analysis steps */}
      <div className="grid grid-cols-2 gap-3">
        {analysisSteps.map((step, index) => (
          <div 
            key={step.name} 
            className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-300 ${
              progress > (index * 15) ? 'bg-white/10 border border-white/20' : 'bg-transparent border border-white/5'
            }`}
          >
            <div 
              className={`flex items-center justify-center ${
                progress > (index * 15) ? 'text-white' : 'text-white/40'
              }`}
            >
              {step.icon}
            </div>
            <span className={`text-xs ${
              progress > (index * 15) ? 'text-white' : 'text-white/40'
            }`}>
              {step.name}
            </span>
            {progress > (index * 15) && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisProgress;
