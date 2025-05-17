import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="min-h-[80vh] flex flex-col items-center justify-center py-16 text-center">
                <div className="flex flex-col items-center space-y-8 max-w-md px-6">
                    <div className="bg-destructive/10 p-4 rounded-full text-destructive">
                        <ShieldAlert size={48} />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
                        <p className="text-muted-foreground text-lg">
                            Sorry, you don't have permission to access this page.
                            Please contact an administrator if you believe this is a mistake.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Home size={16} />
                            Go to Home
                        </Button>
                        <Button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2"
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Unauthorized; 