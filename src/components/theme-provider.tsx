
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false} // Prefer our dark design by default
      disableTransitionOnChange={false} // Enable smooth transitions
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
