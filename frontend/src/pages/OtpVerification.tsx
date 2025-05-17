import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, RefreshCw, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { AuthService } from "@/services/auth.service";
import DevOtpViewer from "@/components/ui/dev-otp-viewer";

const OtpVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // Get email from location state
    const { email, name } = location.state || {};

    const [otpCode, setOtpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Error",
                description: "Email information is missing. Please try registering again.",
                variant: "destructive",
            });
            navigate("/auth", { state: { tab: "register" } });
            return;
        }

        if (!otpCode) {
            toast({
                title: "Error",
                description: "Please enter the verification code.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setStatus("idle");

        try {
            const response = await AuthService.verifyOtp({
                email,
                otpCode
            });

            setStatus("success");
            setMessage(response.message || "Email verified successfully!");

            toast({
                title: "Success",
                description: "Your email has been verified successfully.",
                variant: "default",
            });

            // Redirect after a short delay
            setTimeout(() => {
                navigate("/user/dashboard");
            }, 1500);

        } catch (error: any) {
            setStatus("error");
            setMessage(error.response?.data?.message || "Invalid verification code.");

            toast({
                title: "Verification failed",
                description: error.response?.data?.message || "Invalid verification code.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast({
                title: "Error",
                description: "Email information is missing. Please try registering again.",
                variant: "destructive",
            });
            navigate("/auth", { state: { tab: "register" } });
            return;
        }

        setResendLoading(true);

        try {
            await AuthService.resendOtp(email);

            toast({
                title: "OTP Resent",
                description: "A new verification code has been sent to your email.",
                variant: "default",
            });
        } catch (error: any) {
            toast({
                title: "Failed to resend",
                description: error.response?.data?.message || "Unable to resend verification code.",
                variant: "destructive",
            });
        } finally {
            setResendLoading(false);
        }
    };

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

                {/* Verification Card */}
                <div className="w-full max-w-md">
                    <motion.div
                        className="glass-card p-8 border border-border/40 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold">Verify Your Email</h2>
                            <p className="text-muted-foreground mt-2">
                                {!email
                                    ? "Please enter the verification code sent to your email."
                                    : `We've sent a verification code to ${email}`}
                            </p>
                        </div>

                        {status === "success" ? (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
                                    <Check className="h-8 w-8 text-success-600" />
                                </div>
                                <p className="text-center text-lg font-medium">{message}</p>
                                <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
                            </div>
                        ) : status === "error" ? (
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <XCircle className="h-8 w-8 text-destructive" />
                                </div>
                                <p className="text-center text-destructive">{message}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setStatus("idle")}
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="otp-code">Verification Code</Label>
                                    <Input
                                        id="otp-code"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="h-12 text-lg text-center tracking-widest"
                                        maxLength={6}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>Verify Email</>
                                    )}
                                </Button>

                                <div className="pt-4 text-center">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Didn't receive the code?
                                    </p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-primary"
                                        onClick={handleResendOtp}
                                        disabled={resendLoading}
                                    >
                                        {resendLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                Resend Code
                                            </>
                                        )}
                                    </Button>
                                </div>
                                
                                {/* Development OTP Viewer */}
                                {process.env.NODE_ENV !== 'production' && email && (
                                    <DevOtpViewer email={email} />
                                )}
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OtpVerification; 