
import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Logo } from "@/components/ui/logo"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Menu, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"

export function Header() {
  // State to track if the mobile menu is open
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    })
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo size="md" />
        
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {categories.map((category) => (
                    <ListItem
                      key={category.title}
                      title={category.title}
                      href={category.href}
                    >
                      {category.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/events">
                <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                  All Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <Link to="/user/dashboard">
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                    My Bookings
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {isAdmin && (
              <NavigationMenuItem>
                <Link to="/admin">
                  <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                    Admin
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Right-side Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/user/dashboard')}>My Bookings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user/profile')}>Profile</DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>Admin Dashboard</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" onClick={() => navigate('/auth?mode=login')}>
                Login
              </Button>
              <Button variant="default" onClick={() => navigate('/auth?mode=register')}>
                Sign up
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <Link 
              to="/" 
              className="block px-2 py-2 hover:bg-accent/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="border-t pt-2">
              <p className="px-2 text-sm font-medium text-muted-foreground mb-2">
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.title}
                  to={category.href}
                  className="block px-2 py-2 hover:bg-accent/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.title}
                </Link>
              ))}
            </div>
            <Link 
              to="/events" 
              className="block px-2 py-2 hover:bg-accent/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Events
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/user/dashboard" 
                  className="block px-2 py-2 hover:bg-accent/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-2 py-2 hover:bg-accent/50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => {
                  navigate('/auth?mode=login');
                  setMobileMenuOpen(false);
                }}>
                  Login
                </Button>
                <Button variant="default" onClick={() => {
                  navigate('/auth?mode=register');
                  setMobileMenuOpen(false);
                }}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

// Demo category data
const categories = [
  {
    title: "Conferences",
    href: "/category/conferences",
    description: "Professional gatherings for industry insights and networking."
  },
  {
    title: "Concerts",
    href: "/category/concerts",
    description: "Live music performances from popular artists and bands."
  },
  {
    title: "Workshops",
    href: "/category/workshops",
    description: "Hands-on learning experiences in various fields."
  },
  {
    title: "Sports",
    href: "/category/sports",
    description: "Athletic competitions and sporting events."
  },
]
