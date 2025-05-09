
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, UserPlus, LogIn, Github, Twitter, Facebook } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Auth = () => {
  const navigate = useNavigate()
  const [authTab, setAuthTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Register form state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  
  const calculatePasswordStrength = (password: string) => {
    // Basic password strength check
    if (!password) return 0
    
    let strength = 0
    
    // Add points for length
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    
    // Add point for numbers
    if (/\d/.test(password)) strength += 1
    
    // Add point for special characters
    if (/[!@#$%^&*]/.test(password)) strength += 1
    
    // Add point for mixed case
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1
    
    setPasswordStrength(strength)
  }
  
  const handleRegisterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setRegisterPassword(password)
    calculatePasswordStrength(password)
  }
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate login
    setTimeout(() => {
      setLoading(false)
      navigate("/user/dashboard")
    }, 1500)
  }
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate registration
    setTimeout(() => {
      setLoading(false)
      navigate("/user/dashboard")
    }, 1500)
  }
  
  const renderPasswordStrength = () => {
    const strengths = [
      { label: 'Very Weak', color: 'bg-destructive' },
      { label: 'Weak', color: 'bg-destructive' },
      { label: 'Fair', color: 'bg-warning-500' },
      { label: 'Good', color: 'bg-success-500' },
      { label: 'Strong', color: 'bg-success-500' }
    ]
    
    return (
      <div className="mt-2">
        <div className="flex gap-1 h-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-full flex-1 rounded-full ${i < passwordStrength ? strengths[passwordStrength - 1].color : 'bg-muted'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < passwordStrength ? 1 : 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            />
          ))}
        </div>
        {registerPassword && (
          <p className="text-xs text-muted-foreground">
            Password strength: {passwordStrength > 0 ? strengths[passwordStrength - 1].label : 'Very Weak'}
          </p>
        )}
      </div>
    )
  }
  
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-16 relative">
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/10 via-background to-background opacity-60" />
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ 
              x: [0, 50, 0, -50, 0],
              y: [0, 30, 60, 30, 0],
              scale: [1, 1.1, 1, 0.9, 1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
            animate={{ 
              x: [0, -50, 0, 50, 0],
              y: [0, 30, 60, 30, 0],
              scale: [1, 0.9, 1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          />
        </div>
        
        {/* Authentication Card */}
        <div className="w-full max-w-md">
          <motion.div
            className="glass-card p-8 border border-border/40 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs 
              defaultValue="login" 
              value={authTab} 
              onValueChange={setAuthTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8 bg-muted/50 backdrop-blur">
                <TabsTrigger value="login" className="data-[state=active]:bg-card">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-card">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      <>Sign in</>
                    )}
                  </Button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={registerPassword}
                        onChange={handleRegisterPasswordChange}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {renderPasswordStrength()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      <>Create account</>
                    )}
                  </Button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          <p className="text-center mt-4 text-sm text-muted-foreground">
            {authTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setAuthTab("register")}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setAuthTab("login")}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default Auth
