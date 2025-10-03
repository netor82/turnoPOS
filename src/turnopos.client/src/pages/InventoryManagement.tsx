import React, { useState } from 'react';
import type Item from '../models/Item';
import EditItem from '../components/item/Edit';


const InventoryManagement: React.FC = () => {
    const [item, setItem] = useState<Item>({
        id: 0,
        isActive: true,
        isDirectory: true,
        name: '🏠',
        children: [],
        childrenLoaded: false
    });

    return (
        <div>
            <h1>Inventario</h1>
            <EditItem entity={item} onChanged={(e) => setItem(e) } onSave={(e) => setItem(e)} />
        </div>
    );
};

export default InventoryManagement;