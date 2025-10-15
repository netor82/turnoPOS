import type OrderLine from './OrderLine'
export default interface Order {
    id: number;
    orderLines: OrderLine[];
    total: number;
    createdAt?: Date;
    status: number;
    paymentType: number;
}

export const PaymentTypes = ['Efectivo', 'Tarjeta', 'Transferencia', 'Sinpe', 'Otro'];
