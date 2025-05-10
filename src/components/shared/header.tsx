
import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
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
import { Calendar, Menu, User, Ticket } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  // State to track if the mobile menu is open
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  // Use our auth context
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative size-8 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar className="size-5 text-primary" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 opacity-30 animate-pulse"></div>
            </div>
            <span className="font-heading font-bold text-xl">EventHub</span>
          </Link>
        </div>
        
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
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                    <div className="mt-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-primary/20 text-primary">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/user/dashboard')}>
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user/bookings')}>
                  <Ticket className="mr-2 h-4 w-4" />
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Login
              </Button>
              <Button variant="default" onClick={() => navigate('/auth')}>
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
            
            {!user ? (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}>
                  Login
                </Button>
                <Button variant="default" onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}>
                  Sign up
                </Button>
              </div>
            ) : (
              <div className="border-t pt-2 space-y-2">
                <p className="px-2 text-sm font-medium text-muted-foreground mb-2">
                  Account
                </p>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-2 py-2 hover:bg-accent/50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/user/dashboard"
                  className="block px-2 py-2 hover:bg-accent/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <Link
                  to="/user/bookings"
                  className="block px-2 py-2 hover:bg-accent/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full mt-2" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Log out
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
