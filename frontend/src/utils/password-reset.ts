import axios from 'axios';
import { ForgotPasswordData, ResetPasswordData } from '@/services/auth.service';

// Base API URL - use environment variable if available
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper functions for password reset operations
export async function requestPasswordReset(data: ForgotPasswordData): Promise<any> {
  try {
    console.log('Sending password reset request to:', `${API_URL}/auth/forgot-password`);
    const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
    return response.data;
  } catch (error: any) {
    console.error('Password reset request error:', error);
    // Rethrow with a clearer message
    throw new Error(
      error.response?.data?.message ||
      'Unable to request password reset. Please try again later.'
    );
  }
}

export async function resetPassword(data: ResetPasswordData): Promise<any> {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, data);
    return response.data;
  } catch (error: any) {
    console.error('Reset password error:', error);
    // Rethrow with a clearer message
    throw new Error(
      error.response?.data?.message ||
      'Unable to reset password. Please check your verification code and try again.'
    );
  }
}
