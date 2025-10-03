import React, { useEffect, useState } from 'react';
import type OrderLine from '../models/OrderLine';
import type Item from '../models/Item';
import inventoryService from '../services/InventoryService';
import ChooseItem from '../components/order/ChooseItem';

const STATUS_SELECT_ITEM = 1;
const STATUS_SET_QUANTITY = 2;


const NewOrder: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
    const [status, setStatus] = useState(STATUS_SELECT_ITEM);
    const [item, setItem] = useState<Item | undefined>();
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        inventoryService.getAll(null, false)
            .then(data => {
                setItems(data);
                console.log('NewOrder: Items loaded');
            })
    }, []);

    const handleItemSelected = (selected: Item) => {
        setItem(selected);
        setStatus(STATUS_SET_QUANTITY);
    };

    const handleCancel = () => {
        reset();
    }

    const handleAddLineSubmit = () => {
        if (!quantity) {
            reset();
            return;
        }

        if (item) {
            const price = item.price || 0;
            const newOrderLine: OrderLine = {
                itemId: item.id,
                price: price,
                quantity,
                total: price * quantity,
                item
            };

            setOrderLines([...orderLines, newOrderLine]);
            setQuantity(0);
            setStatus(STATUS_SELECT_ITEM);
        }
    };

    const reset = () => {
        setItem(undefined);
        setQuantity(0);
        setStatus(STATUS_SELECT_ITEM);
    }

    const newLineForm =
        <form action={handleAddLineSubmit}>
            {item?.name}
            <div>
                <label htmlFor="quantity">Cantidad:</label>
                <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(+e.target.value)}
                    required
                    autoFocus
                    min="0"
                />
                <button type="submit">➕</button>
            </div>
        </form>;

    const calculateTotal = () =>
        orderLines.reduce((previous, current) => previous + current.total, 0);


    return (
        <div>
            <h1>New Order</h1>
            {status == STATUS_SELECT_ITEM ? (
                <ChooseItem items={items} onSelect={handleItemSelected} onCancel={handleCancel} />
            ) : newLineForm}
            <div>
                <h2>Order Items</h2>
                <ul>
                    {orderLines.map((line, idx) => (
                        <li key={idx}>{line.item?.name} - {line.quantity} x {line.price} = {line.total}</li>
                    ))}
                </ul>
                <strong>Total: </strong>{calculateTotal()}
            </div>
        </div>
    );
};

export default NewOrder;