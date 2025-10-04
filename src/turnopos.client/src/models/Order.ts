import type OrderLine from './OrderLine'
export default interface Order {
    id: number;
    orderLines: OrderLine[];
    total: number;
    createdAt?: Date;
    status: number;
}
