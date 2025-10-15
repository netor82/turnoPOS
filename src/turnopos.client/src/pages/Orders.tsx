import React, { useEffect, useState } from 'react';
import type Order from '../models/Order';
import { PaymentTypes } from '../models/Order';
import orderService from '../services/OrderService';
import { formatDate, formatCurrency } from '../utils/Formatter';
import SoldItems from '../components/order/SoldItems';

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showItemsSold, setShowItemsSold] = useState<boolean>(false);

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

    const handlePrint = (id: number) => {
        if (id) {
            orderService
                .print(id)
                .catch(e => console.error(e));
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
                        Orden: {order.id} del {formatDate(order.createdAt)}. Total: {formatCurrency(order.total)} - {PaymentTypes[order.paymentType-1]}&nbsp;
                        {order.status != STATUS_CANCELLED ? <button onClick={() => handleCancel(order.id)}>❌ Cancelar</button> : null}
                        {order.status != STATUS_CANCELLED ? <button onClick={() => handlePrint(order.id)}>🖨️ Imprimir</button> : null}
                        <a href={'./printOrder/' + order.id} target="_blank">🕶️ Ver</a>
                    </li>
                )}
            </ol>
            {showItemsSold ? <SoldItems /> : <button onClick={() => setShowItemsSold(true)}>Ver resumen de Items vendidos</button>}
        </>

    return loading ? 'Cargando...' : listOfOrders;
};

export default Orders;