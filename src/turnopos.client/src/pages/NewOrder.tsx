import React, { useState } from 'react';

const NewOrder: React.FC = () => {
    const [customerName, setCustomerName] = useState('');
    const [orderItems, setOrderItems] = useState<string[]>([]);
    const [itemInput, setItemInput] = useState('');

    const handleAddItem = () => {
        if (itemInput.trim() !== '') {
            setOrderItems([...orderItems, itemInput.trim()]);
            setItemInput('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement order submission logic
        alert(`Order for ${customerName} with items: ${orderItems.join(', ')}`);
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
        console.log(e.key);
    };

    return (
        <div onKeyUp={handleKeyUp}>
            <h1>New Order</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="customerName">Customer Name:</label>
                    <input
                        id="customerName"
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="itemInput">Add Item:</label>
                    <input
                        id="itemInput"
                        type="text"
                        value={itemInput}
                        onChange={e => setItemInput(e.target.value)}
                    />
                    <button type="button" onClick={handleAddItem}>
                        Add
                    </button>
                </div>
                <div>
                    <h2>Order Items</h2>
                    <ul>
                        {orderItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
};

export default NewOrder;