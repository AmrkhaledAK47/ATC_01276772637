
import React, { useEffect, useState } from "react"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"

interface MainLayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
}

export function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorDot, setCursorDot] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  useEffect(() => {
    // Check if it's a touch device
    const isTouchCapable = 'ontouchstart' in window || 
                          window.navigator.maxTouchPoints > 0 ||
                          (window.navigator as any).msMaxTouchPoints > 0
    setIsTouchDevice(isTouchCapable)
    
    if (isTouchCapable) return
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      
      // The dot follows immediately
      setCursorDot({ x: e.clientX, y: e.clientY })
    }
    
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'A' || 
          (e.target as HTMLElement).tagName === 'BUTTON' ||
          (e.target as HTMLElement).closest('a') ||
          (e.target as HTMLElement).closest('button')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])
  
  // Only render custom cursor on non-touch devices
  const renderCustomCursor = !isTouchDevice && (
    <>
      <div 
        className="cursor-dot" 
        style={{ 
          left: `${cursorDot.x}px`,
          top: `${cursorDot.y}px`,
          width: isHovering ? '10px' : '5px',
          height: isHovering ? '10px' : '5px',
        }}
      />
      <div 
        className="cursor-outline" 
        style={{ 
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          width: isHovering ? '50px' : '30px',
          height: isHovering ? '50px' : '30px',
          borderColor: isHovering ? 'hsla(var(--accent), 0.8)' : 'hsla(var(--accent), 0.5)',
        }}
      />
    </>
  )
  
  return (
    <div className={`min-h-screen flex flex-col ${!isTouchDevice ? 'cursor-glow' : ''}`}>
      {renderCustomCursor}
      <Header />
      <main className={`flex-1 ${fullWidth ? '' : 'container mx-auto px-4 md:px-6'}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
