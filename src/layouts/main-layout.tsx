
import React from "react"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
      </div>
      <Header />
      <main className="flex-1 animate-fade-in relative">
        {children}
      </main>
      <Footer />
    </div>
  )
}
