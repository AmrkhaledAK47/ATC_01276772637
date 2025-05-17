
import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Home,
  Users,
  Settings,
  LogOut,
  Tag,
  Menu,
  X,
  Ticket,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

const SidebarLink = ({ to, icon, label, isActive }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "hover:bg-primary/10 text-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
)

export function AdminSidebar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  // Handle responsive behavior for mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transition-transform duration-300 md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 border-b px-4">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl">EventHub</span>
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded ml-1">
              Admin
            </span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <SidebarLink
            to="/admin"
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            isActive={location.pathname === "/admin"}
          />
          <SidebarLink
            to="/admin/events"
            icon={<Calendar className="h-4 w-4" />}
            label="Events"
            isActive={location.pathname.startsWith("/admin/events")}
          />
          <SidebarLink
            to="/admin/categories"
            icon={<Tag className="h-4 w-4" />}
            label="Categories"
            isActive={location.pathname.startsWith("/admin/categories")}
          />
          <SidebarLink
            to="/admin/tags"
            icon={<Tag className="h-4 w-4" />}
            label="Tags"
            isActive={location.pathname.startsWith("/admin/tags")}
          />
          <SidebarLink
            to="/admin/bookings"
            icon={<Ticket className="h-4 w-4" />}
            label="Bookings"
            isActive={location.pathname.startsWith("/admin/bookings")}
          />
          <SidebarLink
            to="/admin/users"
            icon={<Users className="h-4 w-4" />}
            label="Users"
            isActive={location.pathname.startsWith("/admin/users")}
          />
          <SidebarLink
            to="/admin/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
            isActive={location.pathname.startsWith("/admin/settings")}
          />
        </nav>
        
        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  )
}
