import axios from 'axios';
import type Item from '../models/Item';

const API_BASE_URL = '/api/inventory';

class InventoryService {
    /**
     * 
     * @param parentId: if 0 it will bring root items, if null it will bring all the items, else filtered by parentId
     * @param includeInactive: include both active and inactive
     * @returns
     */
    static async getAll(parentId: number | null, includeInactive: boolean = false): Promise<Item[]> {
        const resultingParentId = parentId == null ? '' : parentId.toString();
        const response = await axios.get<Item[]>(`${API_BASE_URL}?parentId=${resultingParentId}&includeAll=${includeInactive}`);
        return response.data;
    }

    static async getById(id: number): Promise<Item> {
        const response = await axios.get<Item>(`${API_BASE_URL}/${id}`);
        return response.data;
    }

    static async create(item: Omit<Item, 'id'>): Promise<Item> {
        const response = await axios.post<Item>(API_BASE_URL, item);
        return response.data;
    }

    static async update(item: Partial<Item>): Promise<Item> {
        const response = await axios.put<Item>(`${API_BASE_URL}`, item);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await axios.delete(`${API_BASE_URL}/${id}`);
    }

    static async printVertical(text: string): Promise<boolean> {
        await axios.get(`${API_BASE_URL}/printVertical/${text}`);
        return true;
    }
}

export default InventoryService;