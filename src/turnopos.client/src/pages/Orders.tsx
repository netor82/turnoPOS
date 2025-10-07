import React, { useEffect, useState } from 'react';
import type Order from '../models/Order';
import orderService from '../services/OrderService';
import { formatDate, formatCurrency } from '../utils/formatter';

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const STATUS_CANCELLED = 2;

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancel = (id: number) => {
        if (id) {
            setLoading(true);
            orderService
                .cancel(id)
                .catch(e => console.error(e))
                .finally(() => setLoading(false));
        }
    }

    const fetchOrders = () => {
        setLoading(true);
        orderService.getAll()
            .then(data => {
                setOrders(data);
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }

    const calculateTotal = () =>
        orders.reduce((previous, current) => current.status == STATUS_CANCELLED ? previous : previous + current.total, 0);

    const listOfOrders = !orders.length ? <p>No existen órdenes.</p> :
        <>
            <h1>Ventas</h1>
            Total en órdenes (excluye canceladas): <strong>{formatCurrency(calculateTotal())}</strong>

            <p>Si existen órdenes, aparecen las más recientes de primero.</p>
            <ol>
                {orders.map(order =>
                    <li key={order.id} className={order.status == STATUS_CANCELLED ? 'strike' : ''}>
                        {formatDate(order.createdAt)} - Total: {formatCurrency(order.total)}
                        {order.status != STATUS_CANCELLED ? <button onClick={() => handleCancel(order.id)}>❌ Cancelar</button> : null}
                        <a href={'./printOrder/' + order.id} target="_blank">🖨️ Imprimir</a>
                    </li>
                )}
            </ol>
        </>

    return loading ? 'Cargando...' : listOfOrders;
};

export default Orders;