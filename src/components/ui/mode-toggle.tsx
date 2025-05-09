
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // When mounted, prevent initial flash
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="relative rounded-full w-9 h-9 overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
          theme === 'dark' 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`} />
        <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} />
      </div>
      <span className="sr-only">Toggle theme</span>
      
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-primary to-secondary transition-opacity duration-300"></div>
    </Button>
  )
}
