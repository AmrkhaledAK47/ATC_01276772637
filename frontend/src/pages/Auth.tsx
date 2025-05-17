import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MainLayout } from "@/layouts/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordInput } from "@/components/ui/password-input"
import { UserPlus, LogIn, Github, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AuthService } from "@/services/auth.service"
import { useToast } from "@/components/ui/use-toast"
import { requestPasswordReset, resetPassword } from "@/utils/password-reset"

// Enhanced Google icon component with prettier design
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24"
    height="24"
    className="mr-2"
  >
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

// Using the imported PasswordInput component from ui components

const Auth = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [authTab, setAuthTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [resetStep, setResetStep] = useState(1) // 1: email entry, 2: code verification, 3: new password
  const [rememberMe, setRememberMe] = useState(false)

  // Check URL parameters for tab selection (login or register)
  useEffect(() => {
    // Get query parameters
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');

    if (tab === 'register') {
      setAuthTab("register");
    } else if (tab === 'login') {
      setAuthTab("login");
    } else if (params.get('signup') === 'true') {
      // For backward compatibility
      setAuthTab("register");
    }
  }, [location]);

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await AuthService.login({
        email: loginEmail,
        password: loginPassword,
        rememberMe: rememberMe
      })

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
        variant: "default",
      })

      // Redirect based on user role
      const user = response.user
      if (user.role === 'ADMIN') {
        navigate("/admin")
      } else {
        navigate("/user/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await AuthService.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword
      })

      toast({
        title: "Account created!",
        description: "Please verify your email to continue.",
        variant: "default",
      })

      // Redirect to OTP verification page with email and name
      navigate("/auth/verify", {
        state: {
          email: registerEmail,
          name: registerName
        }
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Unable to create account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      // Use the import.meta.env way for Vite to access environment variables
      // Strip the trailing '/api' from VITE_API_URL as the auth endpoint already includes it
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:3000';
      // Add remember me parameter to the GitHub auth URL
      const authUrl = `${baseUrl}/api/auth/github?remember=${rememberMe}`;

      console.log(`Redirecting to GitHub auth: ${authUrl}`);

      // Before redirecting, tell the user what's happening
      toast({
        title: "Redirecting to GitHub",
        description: "You'll be redirected to GitHub for authentication.",
        variant: "default",
      });

      // Add a small delay before redirecting
      setTimeout(() => {
        window.location.href = authUrl;
      }, 1000);

    } catch (error) {
      console.error('GitHub auth error:', error);
      toast({
        title: "Authentication failed",
        description: "Unable to redirect to GitHub. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Use the import.meta.env way for Vite to access environment variables
      // Strip the trailing '/api' from VITE_API_URL as the auth endpoint already includes it
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:3000';
      // Add remember me parameter to the Google auth URL
      const authUrl = `${baseUrl}/api/auth/google?remember=${rememberMe}`;

      console.log(`Redirecting to Google auth: ${authUrl}`);

      // Before redirecting, tell the user what's happening
      toast({
        title: "Redirecting to Google",
        description: "You'll be redirected to Google for authentication.",
        variant: "default",
      });

      // Add a small delay before redirecting
      setTimeout(() => {
        window.location.href = authUrl;
      }, 1000);

    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Authentication failed",
        description: "Unable to redirect to Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email first
    if (!forgotEmail || !forgotEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Use our direct utility function instead of AuthService
      await requestPasswordReset({
        email: forgotEmail
      });

      toast({
        title: "Reset code sent",
        description: "Please check your email for the password reset code.",
        variant: "default",
      });
      setResetStep(2);
    } catch (error: any) {
      console.error("Password reset error:", error);

      // Provide a user-friendly error message based on error type
      let errorMessage = "Unable to send reset code. Please try again later.";

      if (error.response) {
        // Handle common API error responses
        if (error.response.status === 404) {
          errorMessage = "No account found with this email address.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Request failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use direct utility function instead of AuthService
      await resetPassword({
        email: forgotEmail,
        otpCode: resetCode,
        newPassword: newPassword
      });

      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
        variant: "default",
      });

      // Return to login tab
      setShowForgotPassword(false);
      setResetStep(1);
      setAuthTab("login");

      // Clear fields
      setForgotEmail("");
      setResetCode("");
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Unable to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            {showForgotPassword ? (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetStep(1);
                    }}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to login
                  </button>
                  <h2 className="text-2xl font-semibold">Reset Password</h2>
                </div>

                <AnimatePresence mode="wait">
                  {resetStep === 1 && (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleForgotPassword}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="h-11"
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter your email address and we'll send you a code to reset your password.
                        </p>
                      </div>

                      <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            Sending code...
                          </>
                        ) : (
                          <>Send reset code</>
                        )}
                      </Button>
                    </motion.form>
                  )}

                  {resetStep === 2 && (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setResetStep(3);
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="reset-code">Verification Code</Label>
                        <Input
                          id="reset-code"
                          type="text"
                          placeholder="123456"
                          required
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          className="h-11"
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter the 6-digit code sent to {forgotEmail}
                        </p>
                      </div>

                      <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            Verifying...
                          </>
                        ) : (
                          <>Verify code</>
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => handleForgotPassword(new Event('click') as any)}
                          className="text-sm text-primary hover:underline"
                        >
                          Didn't receive a code? Send again
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {resetStep === 3 && (
                    <motion.form
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleResetPassword}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <PasswordInput
                          id="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          showPassword={showPassword}
                          togglePasswordVisibility={togglePasswordVisibility}
                          minLength={8}
                        />
                        <p className="text-sm text-muted-foreground">
                          Your new password must be at least 8 characters long.
                        </p>
                      </div>

                      <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            Resetting password...
                          </>
                        ) : (
                          <>Reset Password</>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            ) : (
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
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <PasswordInput
                        id="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        showPassword={showPassword}
                        togglePasswordVisibility={togglePasswordVisibility}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
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

                    <div className="mt-4 flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleGithubLogin}
                        disabled={loading}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                      >
                        <GoogleIcon />
                        Google
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
                      <PasswordInput
                        id="register-password"
                        value={registerPassword}
                        onChange={handleRegisterPasswordChange}
                        showPassword={showPassword}
                        togglePasswordVisibility={togglePasswordVisibility}
                      />
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

                    <div className="mt-4 flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleGithubLogin}
                        disabled={loading}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                      >
                        <GoogleIcon />
                        Google
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </motion.div>

          {!showForgotPassword && (
            <p className="text-center mt-4 text-sm text-muted-foreground">
              {authTab === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthTab("register")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthTab("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Auth
