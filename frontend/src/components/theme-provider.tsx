
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // When mounted, prevent initial flash by applying theme preference
  React.useEffect(() => {
    const darkModePref = window.matchMedia("(prefers-color-scheme: dark)")
    document.documentElement.classList.toggle("dark", darkModePref.matches)
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider 
      {...props}
      defaultTheme="dark" 
      attribute="class"
      enableSystem
    >
      {children}
    </NextThemesProvider>
  )
}
