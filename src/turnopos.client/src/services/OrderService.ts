import axios from 'axios';
import type Order from '../models/Order';

const API_BASE_URL = '/api/order';

class OrderService {
    /**
     * Get all orders
     * @returns Promise<Order[]>
     */
    static async getAll(): Promise<Order[]> {
        const response = await axios.get<Order[]>(API_BASE_URL);
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
}

export default OrderService;