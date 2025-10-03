import React, { useState, useEffect } from 'react';
import type Department from '../../models/Department';
import type EntityProps from '../../models/EditEntityProps';
import departmentService from '../../services/DepartmentService';


const Edit: React.FC<EntityProps<Department>> = ({ entity, onChanged }) => {
    const [name, setName] = useState(entity.name);
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        setName(entity.name);
    }, [entity]);

    const handleSave = async () => {
        const newValue: Department = { ...entity, name };
        await departmentService.update(newValue)
            .then(() => {
                console.log('new value', newValue);
                if (onChanged) onChanged(newValue);
            })
            .catch((e) => console.error(e));
        setEditMode(false);
    };

    const handleCancel = () => {
        reset();
        setEditMode(false);
    };

    const reset = () => {
        setName(entity.name);
    };

    const renderView = (
        <span><strong>{entity.name}</strong> <button onClick={() => setEditMode(true)}>📝</button></span>
    );

    const renderForm = (
        <form
            onSubmit={e => {
                e.preventDefault();
                handleSave();
            }}
        >
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

    return editMode ? renderForm : renderView;
};

export default Edit;