
"use client"

import * as React from "react"
import { useTheme } from "next-themes"

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
  color?: string
  count?: number // Alternative to quantity
}

export function Particles({
  className = "",
  quantity = 50,
  staticity = 50,
  ease = 50,
  refresh = false,
  color,
  count, // Use count as an alternative to quantity
}: ParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 })
  const { theme } = useTheme()
  
  // Use count as a fallback for quantity
  const particleCount = count || quantity

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    setCanvasSize({ width: canvas.offsetWidth, height: canvas.offsetHeight })
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particleColor = color || (theme === "dark" ? "#fff" : "#000")
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvasSize.width,
      y: Math.random() * canvasSize.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
    }))

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvasSize.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvasSize.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()
      })

      animationFrameId = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [canvasSize, particleCount, theme, refresh, color])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: 0.75 }}
    />
  )
}

/*
// CSS for styling particles - Can be added to global CSS

.particles {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
*/
