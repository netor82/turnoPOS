import React, { useEffect, useState } from 'react';
import type Item from '../models/Item';
import inventoryService from '../services/InventoryService';
import EditItem from '../components/item/Edit';
import EditDirectory from '../components/item/EditDirectory';
import AddItem from '../components/item/Add';
import ChooseItem from '../components/order/ChooseItem';
import InventorySummary from '../components/item/InventorySummary';


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
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [newParent, setNewParent] = useState<Item | null>(null);
    const [moveToItems, setMoveToItems] = useState<Item[]>([]);
    const [showSummary, setShowSummary] = useState<boolean>(false);

    useEffect(() => {
        if (!item.childrenLoaded && item.isDirectory) {
            setLoading(true);
            fetchItems();
        }
    }, [item]);

    const fetchItems = () => {
        inventoryService.getAll(item.id, true)
            .then(data => {
                console.log(`Item Edit - fetchItems: children loaded for ${item.id}-${item.name}`);
                const newItem: Item = { ...item, childrenLoaded: true, children: data };
                setItem(newItem);
            })
            .then(() => fetchItemsForMoving())
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    };

    const fetchItemsForMoving = () => {
        inventoryService.getAll(null, true)
            .then(data => setMoveToItems(data))
            .catch(e => console.error(e));
    }

    const navigateToItem = (newItem: Item) => {
        setNavigationStack([...navigationStack, item]);
        setItem(newItem);
        setShowSummary(false);
    }

    const navigateBackToItem = (index: number) => {
        const selectedItem = navigationStack[index];
        setNavigationStack(navigationStack.slice(0, index));
        setItem(selectedItem);
        resetMoving();
    }

    const handleItemAdded = (itemAdded: Item) => {
        const newItem: Item = { ...item, children: item.children?.concat(itemAdded) };
        setItem(newItem);
    }

    const handleMoveItem = () => {
        resetMoving();
        if (newParent && newParent.id != item.parentId) {

            if (newParent.id == item.id) {
                alert('No puede incluir a un directorio dentro de sí mismo');
                return;
            }

            inventoryService.update({ ...item, parentId: newParent.id })
                .then(() => {
                    // utilitary function to calculate new navigation
                    const findParentOf = (i: Item) => moveToItems.find(x => x.id == i.parentId);

                    // calculate new navigation
                    const newNavigationStack: Item[] = [];
                    for (let foundParent = findParentOf(newParent); foundParent; foundParent = findParentOf(foundParent)) {
                        newNavigationStack.unshift(foundParent);
                    }
                    newNavigationStack.unshift(navigationStack[0]); // always add the 🏠


                    setNavigationStack(newNavigationStack);
                    setItem(newParent);
                    fetchItemsForMoving();
                })
                .catch(e => console.error(e));
        }
    }

    const resetMoving = () => {
        setNewParent(null);
        setIsMoving(false);
        setShowSummary(false);
    }

    const renderBreadcrum =
        (<div className="nav">
            {navigationStack.map((i, index) =>
                <a href="#" onClick={() => navigateBackToItem(index)}> {i.name} &gt;</a>)}
            <span> {item.name}</span>
        </div>);

    const renderMoveToButton =
        !item.id || isMoving ? null :
            (<p className=""><hr /><button onClick={() => setIsMoving(true)}>↗️ Mover a otro lugar</button></p>);

    const renderItem =
        loading ? <p>Cargando...</p> :
            item.isDirectory
                ? <EditDirectory entity={item} onChanged={(e) => setItem(e)} onSave={(e) => setItem(e)} />
                : <EditItem entity={item} onChanged={(e) => setItem(e)} onSave={(e) => setItem(e)} />;

    const renderChildren = () => {
        if (!loading && item.childrenLoaded && item.children) {

            if (item.children.length === 0) {
                return <p>No hay elementos en esta categoría.</p>;
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

    const renderMovingControls =
        !newParent ?
            <ChooseItem selectDirectory={true} onCancel={resetMoving}
                onSelect={newParent => setNewParent(newParent)}
                items={moveToItems}
            />
            : <>
                Mover a {newParent.name}
                <hr />
                <button onClick={handleMoveItem}>Save</button>
                <button onClick={resetMoving}>Cancel</button>
            </>;

    const renderInventorySummary = showSummary ?
        <InventorySummary items={moveToItems} /> :
        <p><hr/><button onClick={() => setShowSummary(true)}>Ver Resumen</button></p>;

    return (
        <div>
            <h1>Inventario</h1>
            {renderBreadcrum}
            {renderMoveToButton}
            {isMoving ? renderMovingControls :
                <>
                    {renderItem}
                    {renderChildren()}
                    {!loading && (<AddItem entity={item} onSave={handleItemAdded} />)}
                </>
            }
            {renderInventorySummary}
        </div>
    );
};

export default InventoryManagement;