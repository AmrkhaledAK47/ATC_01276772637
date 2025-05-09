
import React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent" />
        <div className="absolute inset-0 spotlight" />
      </div>
      <AdminSidebar />
      <div className="md:ml-64 transition-all duration-500">
        <main className="container py-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
