import { apiClient } from '@/lib/api-client';
import { Event, EventCreate, EventUpdate } from '@/types';

export class EventsService {
    private static BASE_URL = '/events';

    /**
     * Get all events with optional filtering
     */
    static async getEvents(params?: {
        categoryId?: string;
        tagIds?: string[];
        search?: string;
        isFeatured?: boolean;
        page?: number;
        limit?: number;
    }): Promise<Event[]> {
        // Convert parameters to query string
        const queryParams = new URLSearchParams();

        if (params?.categoryId) {
            queryParams.append('categoryId', params.categoryId);
        }

        if (params?.tagIds && params.tagIds.length > 0) {
            params.tagIds.forEach(tagId => {
                queryParams.append('tagIds', tagId);
            });
        }

        if (params?.search) {
            queryParams.append('search', params.search);
        }

        if (params?.isFeatured !== undefined) {
            queryParams.append('isFeatured', params.isFeatured.toString());
        }

        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const query = queryParams.toString();
        const url = query ? `${this.BASE_URL}?${query}` : this.BASE_URL;

        return apiClient.get<Event[]>(url);
    }

    /**
     * Get featured events
     */
    static async getFeaturedEvents(): Promise<Event[]> {
        return apiClient.get<Event[]>(`${this.BASE_URL}/featured`);
    }

    /**
     * Get a single event by ID
     */
    static async getEvent(id: string): Promise<Event> {
        return apiClient.get<Event>(`${this.BASE_URL}/${id}`);
    }

    /**
     * Check if user has booked an event
     */
    static async isEventBooked(id: string): Promise<boolean> {
        return apiClient.get<boolean>(`${this.BASE_URL}/${id}/is-booked`);
    }

    /**
     * Create a new event
     */
    static async createEvent(data: EventCreate): Promise<Event> {
        return apiClient.post<Event>(this.BASE_URL, data);
    }

    /**
     * Update an existing event
     */
    static async updateEvent(id: string, data: EventUpdate): Promise<Event> {
        return apiClient.patch<Event>(`${this.BASE_URL}/${id}`, data);
    }

    /**
     * Delete an event
     */
    static async deleteEvent(id: string): Promise<void> {
        return apiClient.delete<void>(`${this.BASE_URL}/${id}`);
    }
} 