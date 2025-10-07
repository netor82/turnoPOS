import React, { useState } from 'react';
import type Item from '../../models/Item';
import type EntityProps from '../../models/EditEntityProps'
import inventoryService from '../../services/InventoryService';

const EditDirectory: React.FC<EntityProps<Item>> = ({ entity, onSave, onCancel }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [name, setName] = useState(entity.name);
    const [isActive, setActive] = useState(entity.isActive);


    const handleSave = async () => {
        const newValue: Item = { ...entity, name, isActive };
        await inventoryService.update(newValue)
            .then(() => {
                console.log('new value', newValue);
                if (onSave) onSave(newValue);
            })
            .catch((e) => console.error(e));
        setEditMode(false);
    };

    const handleCancel = () => {
        reset();
        setEditMode(false);
        if (onCancel) onCancel(entity.id);
    };

    const reset = () => {
        setName(entity.name);
        setActive(entity.isActive);
    };

    const renderDirectoryView = (
        <span>
            <strong>{entity.name}</strong>
            &nbsp;
            {entity.id ? (<button onClick={() => setEditMode(true)}>📝 Editar</button>) : ''}
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
            <button type="submit" formAction={handleSave}>Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
    );

    return editMode ? renderDirectoryForm : renderDirectoryView;
};

export default EditDirectory