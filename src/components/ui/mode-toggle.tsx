
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Ensure theme toggle only renders client-side
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full w-9 h-9 relative overflow-hidden"
        aria-label="Toggle theme"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
        </div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 relative overflow-hidden hover:bg-primary/10 transition-all duration-500"
      aria-label="Toggle theme"
    >
      <div 
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          transform: theme === 'dark' ? 'translateY(0) rotate(0deg)' : 'translateY(-100%) rotate(-30deg)',
          opacity: theme === 'dark' ? 1 : 0,
        }}
      >
        <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
      </div>
      <div 
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          transform: theme === 'light' ? 'translateY(0) rotate(0deg)' : 'translateY(100%) rotate(30deg)',
          opacity: theme === 'light' ? 1 : 0,
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-accent" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
