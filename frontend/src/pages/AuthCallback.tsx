import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { MainLayout } from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Check, Loader2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing your authentication...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get token and error information from URL
                const token = searchParams.get('token');
                const provider = searchParams.get('provider') || 'social provider';
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');
                const rememberMe = searchParams.get('remember') === 'true';

                console.log('AuthCallback params:', { token, provider, error, errorDescription, rememberMe });

                // Check for explicit error first
                if (error) {
                    setStatus('error');
                    const errorMsg = errorDescription || error;
                    setMessage(`Authentication error: ${errorMsg}`);
                    console.error('Auth callback error from provider:', error, errorDescription);

                    toast({
                        title: "Authentication failed",
                        description: errorMsg,
                        variant: "destructive",
                    });

                    // Log additional details for debugging
                    console.log('Full auth callback params:', Object.fromEntries(searchParams.entries()));
                    return;
                }

                // Check for missing token
                if (!token) {
                    setStatus('error');
                    setMessage('Authentication failed. No token received from the server.');

                    toast({
                        title: "Authentication failed",
                        description: "No authentication token was received. Please try again or use another login method.",
                        variant: "destructive",
                    });

                    // Log all params for debugging
                    console.log('Auth callback missing token. Params:', Object.fromEntries(searchParams.entries()));
                    return;
                }

                // For social logins, we default to sessionStorage unless remember=true is specified
                const storageType = rememberMe ? 'localStorage' : 'sessionStorage';

                // Save the token with the appropriate storage type
                AuthService.saveToken(token, storageType);

                try {
                    // Fetch the user profile
                    const userProfile = await AuthService.getProfile();

                    // Save the user data with the same storage type
                    AuthService.saveUser(userProfile, storageType);

                    setStatus('success');
                    setMessage(`Successfully authenticated with ${provider}!`);

                    toast({
                        title: "Login successful!",
                        description: `You've been authenticated using ${provider}.`,
                        variant: "default",
                    });

                    // Redirect after 2 seconds
                    setTimeout(() => {
                        const redirectPath = userProfile.role === 'ADMIN' ? '/admin' : '/user/dashboard';
                        navigate(redirectPath);
                    }, 2000);
                } catch (profileError: any) {
                    console.error('Error fetching user profile:', profileError);
                    setStatus('error');
                    setMessage('Failed to load your user profile. Please try logging in again.');

                    // Clean up the invalid token from both storages
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');

                    toast({
                        title: "Authentication incomplete",
                        description: "Your login was successful, but we couldn't load your profile.",
                        variant: "destructive",
                    });
                }
            } catch (error: any) {
                console.error('Auth callback general error:', error);
                setStatus('error');
                setMessage(error.message || 'Authentication failed. Please try again.');

                toast({
                    title: "Authentication failed",
                    description: "There was an error processing your login.",
                    variant: "destructive",
                });
            }
        };

        handleCallback();
    }, [searchParams, navigate, toast]);

    return (
        <MainLayout>
            <div className="min-h-[80vh] flex items-center justify-center">
                <motion.div
                    className="w-full max-w-md p-8 border border-border rounded-lg shadow-lg bg-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center text-center gap-4">
                        {status === 'loading' && (
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
                                <Check className="h-8 w-8 text-success-600" />
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <XCircle className="h-8 w-8 text-destructive" />
                            </div>
                        )}

                        <h2 className="text-2xl font-semibold mt-4">
                            {status === 'loading' && 'Authenticating...'}
                            {status === 'success' && 'Authentication Successful'}
                            {status === 'error' && 'Authentication Failed'}
                        </h2>

                        <p className="text-muted-foreground">
                            {message}
                        </p>

                        {status === 'error' && (
                            <Button
                                onClick={() => navigate('/auth')}
                                className="mt-4"
                            >
                                Return to Login
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
};

export default AuthCallback; 