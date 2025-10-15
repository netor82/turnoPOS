import React, { useState, useContext } from 'react';
import type Item from '../../models/Item';
import type EntityProps from '../../models/EditEntityProps'
import inventoryService from '../../services/InventoryService';
import DepartmentContext from '../../contexts/DepartmentsContext';
import SelectFromArray from '../SelectFromArray';
import { formatCurrency, formatNumber } from '../../utils/Formatter'

const EditItem: React.FC<EntityProps<Item>> = ({ entity, onSave, onCancel }) => {
    const itemForPrint = (item: Item) => `${item.name} ${formatCurrency(item.price || 0)}`;

    const [item, setItem] = useState<Item>(entity);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [name, setName] = useState(entity.name || '');
    const [description, setDescription] = useState(entity.description || '');
    const [price, setPrice] = useState(entity.price || 0);
    const [stock, setStock] = useState(entity.stock || 0);
    const [departmentId, setDepartmentId] = useState(entity.departmentId);
    const departments = useContext(DepartmentContext);
    const [printText, setPrintText] = useState<string>(itemForPrint(item));

    const handleSave = async () => {
        const newValue: Item = { ...item, name, description, price, stock, departmentId };
        await inventoryService.update(newValue)
            .then(() => {
                console.log('new value', newValue);
                setItem(newValue);
                setPrintText(itemForPrint(newValue));
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

    const handlePrintLabel = () => {
        inventoryService.printVertical(printText)
            .catch(e => console.error('Error al enviar a imprimir: ' + e.message));
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
            <hr />
            <div className="edit-item-fields">
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
                        step={10}
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
            <hr />
            <div>
                <button type="submit" formAction={handleSave}>Save</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>

    );

    const renderItemView = (
        <p>
            <h3>{item.name} <button onClick={() => setEditMode(true)}>📝</button></h3>
            {item.description}
            <ul>
                <li>Precio: <strong>{formatCurrency(item.price || 0)}</strong></li>
                <li>Cantidad en inventario: {formatNumber(item.stock || 0)}</li>
                <li>De venta en: {getDepartmentName()}</li>
                <li>Descripción: {item.description}</li>
            </ul>
            <div>
                <input type="text" value={printText} onChange={(e) => setPrintText(e.target.value)} placeholder="Texto para imprimir" />
                <button onClick={() => handlePrintLabel()}>
                    🖨️ Imprimir etiqueta
                </button>
            </div>
        </p>
    );

    return (
        <div className="edit-item">
            {editMode ? renderItemForm : renderItemView}
        </div>
    );
};

export default EditItem;