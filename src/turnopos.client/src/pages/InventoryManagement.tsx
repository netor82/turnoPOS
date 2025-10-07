import React, { useEffect, useState } from 'react';
import type Item from '../models/Item';
import inventoryService from '../services/InventoryService';
import EditItem from '../components/item/Edit';
import EditDirectory from '../components/item/EditDirectory';
import AddItem from '../components/item/Add';


const InventoryManagement: React.FC = () => {
    const [item, setItem] = useState<Item>({
        id: 0,
        isActive: true,
        isDirectory: true,
        name: '🏠',
        children: [],
        childrenLoaded: false
    });
    const [navigationStack, setNavigationStack] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!item.childrenLoaded && item.isDirectory) {
            setLoading(true);
            fetchItems();
        }
    }, [item.id]);

    const fetchItems = () => {
        inventoryService.getAll(item.id, true)
            .then(data => {
                console.log('Item Edit - fetchItems: children loaded for ', item.id);
                const newItem: Item = { ...item, childrenLoaded: true, children: data };
                setItem(newItem);
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    };

    const navigateToItem = (newItem: Item) => {
        setNavigationStack([...navigationStack, item]);
        setItem(newItem);
        console.log(`Agregué al stack a ${item.name}, item es ${newItem.name}`);
    }

    const navigateBackToItem = () => {
        const popItem = navigationStack[navigationStack.length - 1];
        setNavigationStack(navigationStack.slice(0, navigationStack.length - 1));
        setItem(popItem);
        console.log(`Saqué del stack a ${popItem.name}`);
    }

    const handleItemAdded = (itemAdded: Item) => {
        const newItem: Item = { ...item, children: item.children?.concat(itemAdded) };
        setItem(newItem);
    }

    const renderBreadcrum =
        (<div className="nav">
            {navigationStack.map((i, index) => index == navigationStack.length - 1 ?
                <a href="#" onClick={() => navigateBackToItem()}> {i.name} &gt;</a> :
                <span> {i.name} &gt;</span>)}
            <span> {item.name}</span>
        </div>);

    const renderItem = 
        loading ? <p>Loading...</p> :
        item.isDirectory
            ? <EditDirectory entity={item} onChanged={(e) => setItem(e)} onSave={(e) => setItem(e)} />
            : <EditItem entity={item} onChanged={(e) => setItem(e)} onSave={(e) => setItem(e)} />;

    const renderChildren = () => {
        if (!loading && item.childrenLoaded && item.children) {

            if (item.children.length === 0) {
                return <p>No hay elementos en este directorio.</p>;
            }
            return (
                <ol>
                    {item.children.map(child => (
                        <li key={child.id}>
                            <button onClick={() => navigateToItem(child)}>
                                {child.isDirectory ? '📁' : '📄'} {child.name}
                            </button>
                        </li>
                    ))}
                </ol>
            );
        }
        return null;
    }

    return (
        <div>
            <h1>Inventario</h1>
            {renderBreadcrum}
            {renderItem}
            {renderChildren()}
            {!loading && (<AddItem entity={item} onSave={handleItemAdded} />)}
        </div>
    );
};

export default InventoryManagement;