import React, { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [particles, setParticles] = useState([]);
  const [geometricShapes, setGeometricShapes] = useState([]);
  const [triangles, setTriangles] = useState([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8
    }));

    // Generate geometric shapes
    const newShapes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 20
    }));

    // Generate triangles
    const newTriangles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6
    }));

    setParticles(newParticles);
    setGeometricShapes(newShapes);
    setTriangles(newTriangles);
  }, []);

  return (
    <div className="animated-background">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(153, 69, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(20, 241, 149, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(153, 69, 255, 0.2) 0%, transparent 30%)
          `
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Geometric shapes */}
      {geometricShapes.map((shape) => (
        <div
          key={shape.id}
          className="geometric-shape"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            animationDelay: `${shape.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}

      {/* Triangle shapes */}
      {triangles.map((triangle) => (
        <div
          key={triangle.id}
          className="triangle"
          style={{
            left: `${triangle.x}%`,
            top: `${triangle.y}%`,
            animationDelay: `${triangle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;