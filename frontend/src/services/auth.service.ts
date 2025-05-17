import { apiClient } from '@/lib/api-client';
import axios from 'axios';

// Types
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface VerifyOtpData {
    email: string;
    otpCode: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    otpCode: string;
    newPassword: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatar?: string;
        isVerified?: boolean;
        createdAt: string;
        updatedAt: string;
    };
    token: string;
    message?: string;
}

export class AuthService {
    /**
     * Login with email and password
     */
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

            // Save token and user based on remember me preference
            if (credentials.rememberMe) {
                // Store in localStorage for persistent login
                this.saveToken(response.token, 'localStorage');
                this.saveUser(response.user, 'localStorage');
            } else {
                // Store in sessionStorage for session-only login
                this.saveToken(response.token, 'sessionStorage');
                this.saveUser(response.user, 'sessionStorage');
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Register a new user
     */
    static async register(data: RegisterData): Promise<any> {
        try {
            // In the new flow, registration doesn't return a token immediately
            // as the user needs to verify their email first
            const response = await apiClient.post<any>('/auth/register', data);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Verify OTP code
     */
    static async verifyOtp(data: VerifyOtpData): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/verify-otp', data);
            // If verification is successful, we'll get a token
            if (response.token) {
                // Default to sessionStorage for verified OTP logins
                this.saveToken(response.token, 'sessionStorage');
                this.saveUser(response.user, 'sessionStorage');
            }
            return response;
        } catch (error) {
            console.error('OTP verification error:', error);
            throw error;
        }
    }

    /**
     * Resend OTP code
     */
    static async resendOtp(email: string): Promise<any> {
        try {
            return await apiClient.get(`/auth/resend-otp/${email}`);
        } catch (error) {
            console.error('Resend OTP error:', error);
            throw error;
        }
    }

    /**
     * Request password reset (forgot password)
     */
    static async forgotPassword(data: ForgotPasswordData): Promise<any> {
        try {
            // Create direct axios call to avoid any issues with apiClient
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await axios.post(`${baseUrl}/auth/forgot-password`, data);
            return response.data;
        } catch (error: any) {
            console.error('Forgot password error:', error);
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    }

    /**
     * Reset password with OTP verification
     */
    static async resetPassword(data: ResetPasswordData): Promise<any> {
        try {
            return await apiClient.post('/auth/reset-password', data);
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(): Promise<any> {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            return apiClient.get('/auth/profile');
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    static logout(): void {
        // Clear both localStorage and sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/auth';
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Get authentication token
     */
    static getToken(): string | null {
        // Try to get token from sessionStorage first (session-only login)
        let token = sessionStorage.getItem('token');

        // If not found, try localStorage (persistent login)
        if (!token) {
            token = localStorage.getItem('token');
        }

        return token;
    }

    /**
     * Save authentication token
     */
    static saveToken(token: string, storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): void {
        if (storageType === 'localStorage') {
            localStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', token);
        }
    }

    /**
     * Save user data
     */
    static saveUser(user: any, storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): void {
        const userData = JSON.stringify(user);
        if (storageType === 'localStorage') {
            localStorage.setItem('user', userData);
        } else {
            sessionStorage.setItem('user', userData);
        }
    }

    /**
     * Get current user from storage
     */
    static getCurrentUserFromStorage(): any {
        // Check sessionStorage first (session-only login)
        let user = sessionStorage.getItem('user');

        // If not found, check localStorage (persistent login)
        if (!user) {
            user = localStorage.getItem('user');
        }

        return user ? JSON.parse(user) : null;
    }
} 