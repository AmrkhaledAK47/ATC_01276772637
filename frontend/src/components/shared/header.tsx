import * as React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Calendar, Menu, User, Settings, LogOut, CreditCard, LayoutDashboard } from "lucide-react"
import { AuthService } from "@/services/auth.service"
import { Skeleton } from "@/components/ui/skeleton"

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  // State to track if the mobile menu is open
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Initialize auth state on component mount and when location changes
  React.useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);

      if (isAuthenticated) {
        const userData = AuthService.getCurrentUserFromStorage();
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [location.pathname]);

  const handleLogin = () => {
    navigate("/auth?tab=login");
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    navigate("/auth?tab=register");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to determine user role display
  const getRoleDisplay = (role: string) => {
    if (!role) return "User";
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "Administrator";
      case "ORGANIZER":
        return "Event Organizer";
      default:
        return "User";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
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
            <NavigationMenuItem>
              <Link to="/faq">
                <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                  FAQ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact">
                <NavigationMenuLink className="px-4 py-2 hover:text-primary">
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right-side Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {loading ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Avatar className="h-9 w-9 border-2 border-primary/20 transition-all hover:border-primary/50">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoleDisplay(user.role)}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/user/dashboard")} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/user/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/user/bookings")} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </DropdownMenuItem>
                {user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" onClick={handleLogin}>
                Login
              </Button>
              <Button variant="default" onClick={handleSignup}>
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
            {isLoggedIn && user && (
              <div className="flex items-center gap-3 p-2 mb-2 bg-accent/30 rounded-md">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

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
            <Link
              to="/faq"
              className="block px-2 py-2 hover:bg-accent/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="block px-2 py-2 hover:bg-accent/50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <Button variant="outline" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="default" onClick={handleSignup}>
                  Sign up
                </Button>
              </div>
            )}

            {isLoggedIn && user && (
              <div className="border-t pt-2 space-y-2">
                <p className="px-2 text-sm font-medium text-muted-foreground mb-2">
                  My Account
                </p>
                <Link
                  to="/user/profile"
                  className="flex items-center px-2 py-2 hover:bg-accent/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/user/dashboard"
                  className="flex items-center px-2 py-2 hover:bg-accent/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/user/bookings"
                  className="flex items-center px-2 py-2 hover:bg-accent/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  My Bookings
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="flex items-center px-2 py-2 hover:bg-accent/50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                )}
                <Button
                  variant="destructive"
                  className="w-full mt-2 flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
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
  {
    title: "Arts",
    href: "/category/arts",
    description: "Exhibitions, performances, and creative experiences."
  },
  {
    title: "Charity",
    href: "/category/charity",
    description: "Fundraisers and events supporting important causes."
  },
]
