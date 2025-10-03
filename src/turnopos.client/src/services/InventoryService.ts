import axios from 'axios';
import type Item from '../models/Item';

const API_BASE_URL = '/inventory';

class InventoryService {
    static async getAll(parentId: number | null, includeAll: boolean = false): Promise<Item[]> {
        const response = await axios.get<Item[]>(`${API_BASE_URL}?parentId=${parentId || ''}&includeAll=${includeAll}`);
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
}

export default InventoryService;