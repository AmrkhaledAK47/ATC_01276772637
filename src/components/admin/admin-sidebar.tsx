
import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };
  
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
          <Calendar className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-xl">EventHub</span>
          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded ml-1">
            Admin
          </span>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="px-4 py-4 border-b flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        
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
            to="/admin/users"
            icon={<Users className="h-4 w-4" />}
            label="Users"
            isActive={location.pathname.startsWith("/admin/users")}
          />
          <SidebarLink
            to="/admin/categories"
            icon={<Tag className="h-4 w-4" />}
            label="Categories"
            isActive={location.pathname.startsWith("/admin/categories")}
          />
          <SidebarLink
            to="/admin/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
            isActive={location.pathname.startsWith("/admin/settings")}
          />
        </nav>
        
        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link to="/">
              <Calendar className="h-4 w-4 mr-2" />
              Back to Main Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
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
