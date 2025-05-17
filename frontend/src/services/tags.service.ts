import { apiClient } from '@/lib/api-client';
import { Tag, TagCreate, TagUpdate } from '@/types';

export class TagsService {
    private static BASE_URL = '/tags';

    /**
     * Get all tags
     */
    static async getTags(): Promise<Tag[]> {
        return apiClient.get<Tag[]>(this.BASE_URL);
    }

    /**
     * Get a single tag by ID
     */
    static async getTag(id: string): Promise<Tag> {
        return apiClient.get<Tag>(`${this.BASE_URL}/${id}`);
    }

    /**
     * Create a new tag (admin only)
     */
    static async createTag(data: TagCreate): Promise<Tag> {
        return apiClient.post<Tag>(this.BASE_URL, data);
    }

    /**
     * Update an existing tag (admin only)
     */
    static async updateTag(id: string, data: TagUpdate): Promise<Tag> {
        return apiClient.patch<Tag>(`${this.BASE_URL}/${id}`, data);
    }

    /**
     * Delete a tag (admin only)
     */
    static async deleteTag(id: string): Promise<void> {
        return apiClient.delete<void>(`${this.BASE_URL}/${id}`);
    }
} 