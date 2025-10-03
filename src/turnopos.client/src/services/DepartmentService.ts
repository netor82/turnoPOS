import axios from 'axios';
import type Department from '../models/Department';

const API_BASE_URL = '/department';

class DepartmentService {
    static async getAll(): Promise<Department[]> {
        const response = await axios.get<Department[]>(API_BASE_URL);
        return response.data;
    }

    static async getById(id: number): Promise<Department> {
        const response = await axios.get<Department>(`${API_BASE_URL}/${id}`);
        return response.data;
    }

    static async create(department: Omit<Department, 'id'>): Promise<Department> {
        const response = await axios.post<Department>(API_BASE_URL, department);
        return response.data;
    }

    static async update(department: Department): Promise<void> {
        await axios.put(API_BASE_URL, department);
    }
}

export default DepartmentService;