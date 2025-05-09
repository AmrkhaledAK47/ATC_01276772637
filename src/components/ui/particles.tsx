
import { useState, useEffect } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface ParticlesProps {
  count?: number
  className?: string
}

export function Particles({ count = 50, className = "" }: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
      
      setParticles(newParticles)
    }
    
    generateParticles()
  }, [count])
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: 'hsla(var(--primary), 0.4)',
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            animation: `particle-${particle.id} ${15 + particle.id % 5}s linear infinite`,
          }}
        />
      ))}
      <style jsx>{`
        ${particles.map((particle) => `
          @keyframes particle-${particle.id} {
            0% {
              transform: translate(-50%, -50%);
            }
            25% {
              transform: translate(${particle.speedX * 100}px, ${particle.speedY * 100}px) translate(-50%, -50%);
            }
            50% {
              transform: translate(${particle.speedX * 150}px, ${-particle.speedY * 150}px) translate(-50%, -50%);
            }
            75% {
              transform: translate(${-particle.speedX * 100}px, ${-particle.speedY * 100}px) translate(-50%, -50%);
            }
            100% {
              transform: translate(-50%, -50%);
            }
          }
        `).join('')}
      `}</style>
    </div>
  )
}
