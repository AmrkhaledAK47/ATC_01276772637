import { apiClient } from '@/lib/api-client';
import { Booking, BookingCreate, BookingUpdate } from '@/types';

export class BookingsService {
    private static BASE_URL = '/bookings';

    /**
     * Get all bookings for the current user
     */
    static async getMyBookings(): Promise<Booking[]> {
        return apiClient.get<Booking[]>(`${this.BASE_URL}/me`);
    }

    /**
     * Get all bookings (admin only)
     */
    static async getAllBookings(params?: {
        eventId?: string;
        userId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<Booking[]> {
        // Convert parameters to query string
        const queryParams = new URLSearchParams();

        if (params?.eventId) {
            queryParams.append('eventId', params.eventId);
        }

        if (params?.userId) {
            queryParams.append('userId', params.userId);
        }

        if (params?.status) {
            queryParams.append('status', params.status);
        }

        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const query = queryParams.toString();
        const url = query ? `${this.BASE_URL}?${query}` : this.BASE_URL;

        return apiClient.get<Booking[]>(url);
    }

    /**
     * Get a single booking by ID
     */
    static async getBooking(id: string): Promise<Booking> {
        return apiClient.get<Booking>(`${this.BASE_URL}/${id}`);
    }

    /**
     * Create a new booking
     */
    static async createBooking(data: BookingCreate): Promise<Booking> {
        return apiClient.post<Booking>(this.BASE_URL, data);
    }

    /**
     * Update an existing booking
     */
    static async updateBooking(id: string, data: BookingUpdate): Promise<Booking> {
        return apiClient.patch<Booking>(`${this.BASE_URL}/${id}`, data);
    }

    /**
     * Cancel a booking
     */
    static async cancelBooking(id: string): Promise<void> {
        return apiClient.delete<void>(`${this.BASE_URL}/${id}`);
    }
} 