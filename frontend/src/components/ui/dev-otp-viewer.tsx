import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { ReloadIcon, CopyIcon, CheckIcon } from '@radix-ui/react-icons';

/**
 * A development-only component for retrieving and displaying OTP codes
 * This should never be used in production
 */
interface DevOtpViewerProps {
  email: string;
}

const DevOtpViewer = ({ email }: DevOtpViewerProps) => {
  const [otp, setOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchOtp = async () => {
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await axios.get(`${baseUrl}/auth/dev/latest-otp/${encodeURIComponent(email)}`);

      if (response.data?.otp) {
        setOtp(response.data.otp);
      } else {
        setError('No OTP found for this email');
      }
    } catch (error: any) {
      console.error('Error fetching OTP:', error);
      setError(error.response?.data?.message || 'Failed to retrieve OTP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch the OTP in development
    if (process.env.NODE_ENV !== 'production' && email) {
      fetchOtp();
    }
  }, [email]);

  const copyToClipboard = () => {
    if (otp) {
      navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="p-4 border-dashed border-yellow-500 bg-yellow-500/10 mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/50">
            DEV ONLY
          </Badge>
          <span className="text-sm ml-2 text-muted-foreground">OTP Viewer</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchOtp}
          disabled={loading}
          className="h-8 px-2"
        >
          {loading ? <ReloadIcon className="h-4 w-4 animate-spin" /> : <ReloadIcon className="h-4 w-4" />}
        </Button>
      </div>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : otp ? (
        <div className="flex items-center justify-between">
          <div className="font-mono text-lg tracking-widest bg-muted px-4 py-1 rounded">{otp}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 ml-2"
          >
            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {loading ? "Fetching OTP..." : "No OTP found. Try clicking the refresh button."}
        </p>
      )}
    </Card>
  );
};

export default DevOtpViewer;
