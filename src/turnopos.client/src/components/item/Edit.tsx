import React, { useState, useEffect, useContext } from 'react';
import type Item from '../../models/Item';
import type EntityProps from '../../models/EditEntityProps'
import AddItem from './Add';
import inventoryService from '../../services/InventoryService';
import DepartmentContext from '../../contexts/DepartmentsContext';
import SelectFromArray from '../SelectFromArray';

const EditItem: React.FC<EntityProps<Item>> = ({ entity, onSave, onCancel }) => {
    const [item, setItem] = useState<Item>(entity);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [name, setName] = useState(entity.name || '');
    const [description, setDescription] = useState(entity.description || '');
    const [price, setPrice] = useState(entity.price || 0);
    const [stock, setStock] = useState(entity.stock || 0);
    const [departmentId, setDepartmentId] = useState(entity.departmentId);
    const [loading, setLoading] = useState<boolean>(false);
    const departments = useContext(DepartmentContext);

    useEffect(() => {
        if (item.id == 0)
            fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        const data = await inventoryService.getAll(item.id, true);
        const newItem: Item = { ...item, childrenLoaded: true, children: data };
        setItem(newItem);

        setLoading(false);
    };

    const handleSave = async () => {
        const newValue: Item = { ...item, name, description, price, stock, departmentId };
        await inventoryService.update(newValue)
            .then(() => {
                console.log('new value', newValue);
                setItem(newValue);
                if (onSave) onSave(newValue);
            })
            .catch((e) => console.error(e));
        setEditMode(false);
    };

    const handleCancel = () => {
        reset();
        setEditMode(false);
        if (onCancel) onCancel(item.id);
    };

    const handleItemAdded = (itemAdded: Item) => {
        const newItem: Item = { ...item, children: item.children?.concat(itemAdded) };
        setItem(newItem);
    }

    const reset = () => {
        setName(item.name);
        setDescription(item.description || '');
        setPrice(item.price || 0);
        setStock(item.stock || 0);
        setDepartmentId(item.departmentId);
    };

    const getDepartmentName = () => {
        if (!departmentId) return '-';
        const department = departments.find(d => d.id === departmentId);
        return department ? department.name : '-';
    }

    const renderItemForm = (
        <form
            onSubmit={e => {
                e.preventDefault();
                handleSave();
            }}
        >
            <div>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <div>
                    <label htmlFor="description">Descripción:</label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="price">Precio:</label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        min={0}
                        step={0.01}
                    />
                </div>
                <div>
                    <label htmlFor="stock">Cantidad en inventario:</label>
                    <input
                        id="stock"
                        type="number"
                        value={stock}
                        onChange={e => setStock(Number(e.target.value))}
                        min={0}
                        step={1}
                    />
                </div>
                <div>
                    <label htmlFor="department">De venta en:</label>
                    <SelectFromArray name="department" options={departments} value={item.departmentId}
                        placeholder='Seleccione un valor' onChange={(id) => {
                            console.log('selected value:', id);
                            setDepartmentId(id);
                        }} />
                </div>
            </div>
            <div>
                <button type="submit" formAction={handleSave}>Save</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>

    );

    const renderItemView = (
        <div>
            <span><strong>{item.name}</strong> <button onClick={() => setEditMode(true)}>📝</button></span>
            {item.description}
            <ul>
                <li>Precio: {item.price}</li>
                <li>Cantidad en inventario: {item.stock}</li>
                <li>De venta en: {getDepartmentName()}</li>
                <li>Descripción: {item.description}</li>
            </ul>
        </div>
    );

    const renderDirectoryView = (
        <span><strong>{item.name}</strong>
            {item.id ? (<button onClick={() => setEditMode(true)}>📝</button>) : ''}
        </span>
    );

    const renderDirectoryForm = (
        <form>
            <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
        </form>
    );

    const renderChildren = (item: Item) => {
        if (loading) return (<p>Loading...</p>);

        if (item.childrenLoaded && !item.children?.length) return (<p>Sin hijos</p>);

        if (!item.isDirectory) return '';

        if (!item.childrenLoaded) return (<input type="button" value="Cargar hijos" onClick={fetchItems} />);

        return (
            <div className="item-children">
                {item.children && item.children.map(item => (
                    <EditItem key={item.id} entity={item} />
                ))}
            </div>
        );
    }

    return (
        <div className="edit-item">
            {!item.isDirectory && editMode && renderItemForm}
            {!item.isDirectory && !editMode && renderItemView}
            {item.isDirectory && !editMode && renderDirectoryView}
            {item.isDirectory && editMode && renderDirectoryForm}
            {renderChildren(item)}
            {!loading && (<AddItem entity={item} onSave={handleItemAdded}/>)}
        </div>
    );
};

export default EditItem;