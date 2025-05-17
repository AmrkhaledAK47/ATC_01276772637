import { apiClient } from '@/lib/api-client';
import { Category, CategoryCreate, CategoryUpdate } from '@/types';

export class CategoriesService {
    private static BASE_URL = '/categories';

    /**
     * Get all categories
     */
    static async getCategories(): Promise<Category[]> {
        return apiClient.get<Category[]>(this.BASE_URL);
    }

    /**
     * Get a single category by ID
     */
    static async getCategory(id: string): Promise<Category> {
        return apiClient.get<Category>(`${this.BASE_URL}/${id}`);
    }

    /**
     * Create a new category (admin only)
     */
    static async createCategory(data: CategoryCreate): Promise<Category> {
        return apiClient.post<Category>(this.BASE_URL, data);
    }

    /**
     * Update an existing category (admin only)
     */
    static async updateCategory(id: string, data: CategoryUpdate): Promise<Category> {
        return apiClient.patch<Category>(`${this.BASE_URL}/${id}`, data);
    }

    /**
     * Delete a category (admin only)
     */
    static async deleteCategory(id: string): Promise<void> {
        return apiClient.delete<void>(`${this.BASE_URL}/${id}`);
    }
} 