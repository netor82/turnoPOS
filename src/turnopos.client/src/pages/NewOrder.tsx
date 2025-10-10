import React, { useEffect, useState } from 'react';
import type OrderLine from '../models/OrderLine';
import type Item from '../models/Item';
import inventoryService from '../services/InventoryService';
import orderService from '../services/OrderService';
import ChooseItem from '../components/order/ChooseItem';
import { formatCurrency } from '../utils/Formatter';

const STATUS_SELECT_ITEM = 1;
const STATUS_SET_QUANTITY = 2;
const STATUS_VIEW_ORDER = 3;


const NewOrder: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
    const [status, setStatus] = useState(STATUS_SELECT_ITEM);
    const [item, setItem] = useState<Item | undefined>();
    const [quantity, setQuantity] = useState(0);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [amountReceived, setAmountReceived] = useState<number>(0);

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
        if (orderId) {
            orderService
                .cancel(orderId)
                .catch(e => console.error(e))
                .finally(() => reset());
        }
    }

    const handleSave = () => {
        orderService.create({ orderLines, total: totalAmount, status: 1 })
            .then(data => {
                setOrderId(data.id);
                setStatus(STATUS_VIEW_ORDER);
            })
            .catch(e => console.error(e));
    }

    const handleRemoveLine = (item: OrderLine) => {
        setOrderLines(orderLines.filter(x => x != item));
    }

    const handleAddLineSubmit = () => {
        if (!quantity) {
            reset();
            return;
        }

        if (item) {

            const existingLineIndex = orderLines.findIndex(line => line.itemId === item.id);
            const price = item.price || 0;

            if (existingLineIndex !== -1) {
                // Update existing line
                const updatedLines = [...orderLines];
                const existingLine = updatedLines[existingLineIndex];
                const price = item.price || 0;
                updatedLines[existingLineIndex] = {
                    ...existingLine,
                    quantity,
                    total: price * quantity
                };
                setOrderLines(updatedLines);
            }
            else {
                const newOrderLine: OrderLine = {
                    itemId: item.id,
                    price: price,
                    quantity,
                    total: price * quantity
                };
                setOrderLines([...orderLines, newOrderLine]);
            }

            setQuantity(0);
            setStatus(STATUS_SELECT_ITEM);
        }
    };

    const handlePrint = () => {
        if (orderId) {
            orderService
                .print(orderId)
                .catch(e => console.error(e));
        }
    }

    const reset = () => {
        setOrderLines([]);
        setStatus(STATUS_SELECT_ITEM);
        setItem(undefined);
        setQuantity(0);
        setOrderId(null);
    }

    const newLineForm =
        <form action={handleAddLineSubmit}>
            <h3>{item?.name}</h3>
            <div>
                <p>Si deja la cantidad en cero, no se añade el elemento.</p>
                <label htmlFor="quantity">Cantidad: </label>
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

    const renderCancelForm =
        <div>
            <button onClick={handleCancel}>Cancelar Orden</button>
            <button onClick={handlePrint}>🖨️ Imprimir</button>
            <button onClick={reset}>Nueva Orden</button>
        </div>;

    const renderSaveForm = status != STATUS_VIEW_ORDER && orderLines.length > 0 ?
        <div>
            <button onClick={handleSave}>Guardar Orden</button>
            <button onClick={reset}>Reset</button>
        </div> : null;

    const getItem = (id: number) => items.find(i => i.id == id);

    const totalAmount =
        orderLines.reduce((previous, current) => previous + current.total, 0);

    const renderCalculateChange = status != STATUS_VIEW_ORDER ? null :
        <div className="space-top">
            <hr />
            <h2>Calculadora de cambio</h2>
            Monto recibido: <input type="number" step="100" autoFocus min="0" name="recibido" value={amountReceived} onChange={(e) => setAmountReceived(+e.target.value)} />
            <br />
            {[1000, 5000, 10000, 15000, 20000].map(x => <button key={x} onClick={() => setAmountReceived(x)}>{formatCurrency(x)}</button>)}
            <p>
                Cambio: {formatCurrency(amountReceived - totalAmount)}
            </p>
        </div>;

    return (
        <div>
            <h1>Nueva Orden</h1>
            {status == STATUS_SELECT_ITEM ? (
                <ChooseItem items={items} onSelect={handleItemSelected} onCancel={() => { }} />
            ) : status == STATUS_SET_QUANTITY ? newLineForm : renderCancelForm}
            <div>
                <h2>Items en la orden</h2>
                <ul>
                    {orderLines.map((line, idx) => (
                        <li key={idx}>
                            {status != STATUS_VIEW_ORDER ? <button onClick={() => handleRemoveLine(line)}>❌</button> : null}
                            {getItem(line.itemId)?.name} - {line.quantity} x {formatCurrency(line.price)} = {formatCurrency(line.total)}</li>
                    ))}
                </ul>
                <strong>Total: </strong>{formatCurrency(totalAmount)}
            </div>
            {renderSaveForm}
            {renderCalculateChange}
        </div>
    );
};

export default NewOrder;