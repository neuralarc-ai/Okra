import React, { useEffect, useState } from "react";

const COLORS = [
  "#f8e7d2",
  "#f7e1e6",
  "#e6e1f7",
  "#b6c6d6",
  "#9b87f5",
  "#7E69AB",
  "#61dafb"
];

const NUM_PARTICLES = 24;

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const ParticlesBackground: React.FC = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
      id: i,
      left: `${random(0, 100)}vw`,
      top: `${random(0, 100)}vh`,
      size: random(8, 24),
      duration: random(8, 18),
      delay: random(0, 8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: random(0.12, 0.28)
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            borderRadius: "50%",
            filter: "blur(1.5px)",
            animation: `particle-float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default ParticlesBackground; 