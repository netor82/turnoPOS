import React, { useEffect, useState } from 'react';
import type ItemSold from '../../models/ItemSold';
import orderService from '../../services/OrderService';
import {formatNumber, formatCurrency} from '../../utils/Formatter';

const SoldItems: React.FC = () => {
    const [items, setItems] = useState<ItemSold[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchSoldItems();
    }, []);

    const fetchSoldItems = () => {
        setLoading(true);
        orderService.getItemsSold()
            .then(data => {
                setItems(data);
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }

    const totalSold = () =>
        items.reduce((previous, current) => previous + current.total, 0);

    return (
        <div className="sold-items">
            <h2>Resumen de Items vendidos</h2>
            {loading ? <p>Loading...</p> : items.length === 0 ? <p>No sold items.</p> :
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatNumber(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>Total Vendido: <strong>{formatCurrency(totalSold())}</strong></p>
                </>
            }
        </div>
    );
}

export default SoldItems;