import axios from 'axios';
import type Order from '../models/Order';
import type ItemSold from '../models/ItemSold';

const API_BASE_URL = '/api/order';

class OrderService {
    /**
     * Get all orders
     * @returns Promise<Order[]>
     */
    static async getAll(date: Date): Promise<Order[]> {
        const response = await axios.get<Order[]>(`${API_BASE_URL}/?date=${date}`);
        return response.data;
    }

    static async getDates(): Promise<Date[]> {
        const response = await axios.get<Date[]>(`${API_BASE_URL}/dates`);
        return response.data;
    }

    /**
     * Get items from confirmed orders
     * @returns Promise<ItemSold[]>
     */
    static async getItemsSold(): Promise<ItemSold[]> {
        const response = await axios.get<ItemSold[]>(`${API_BASE_URL}/itemsSold`);
        return response.data;
    }

    /**
     * Get order by ID
     * @param id Order ID
     * @returns Promise<Order>
     */
    static async getById(id: number): Promise<Order> {
        const response = await axios.get<Order>(`${API_BASE_URL}/${id}`);
        return response.data;
    }

    /**
     * Create a new order
     * @param order Order data (without id)
     * @returns Promise<Order>
     */
    static async create(order: Omit<Order, 'id'>): Promise<Order> {
        const response = await axios.post<Order>(API_BASE_URL, order);
        return response.data;
    }

    /**
     * Cancel an order
     * @param id Order ID
     * @returns Promise<void>
     */
    static async cancel(id: number): Promise<void> {
        await axios.post(`${API_BASE_URL}/${id}/cancel`);
    }

    /**
     * Print to a physical printer
     * @param id Order ID
     * @returns Promise<void>
     */
    static async print(id: number): Promise<void> {
        await axios.get(`${API_BASE_URL}/${id}/print`);
    }
}

export default OrderService;