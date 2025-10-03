import React, { useEffect } from "react";
import type EntityProps from '../../models/EditEntityProps'
import type Item from '../../models/Item';
import InventoryService from '../../services/InventoryService';


const Add: React.FC<EntityProps<Item>> = ({ entity, onSave }) => {
    const [canAdd, setCanAdd] = React.useState(false);

    useEffect(() => {
        setCanAdd(entity.isDirectory 
            && entity.childrenLoaded
            && entity.children != null
            && entity.children.filter(x => x.isActive).length < 9);

    }, [entity]);

    const submit = (formData: FormData) => {
        const name = (formData.get("name") as string).trim();
        const isDirectory = formData.get("isDirectory") === "on";
        if (name) {
            const item = { name, isDirectory, parentId: entity.id || null } as Item;
            InventoryService.create(item)
                .then((newItem) => {
                    if (onSave) onSave(newItem);
                    console.log(`Created item: ${newItem.id}, name: ${newItem.name}, parent: ${newItem.parentId}"`);
                })
                .catch(reason => {
                    console.error("Error creating item:", reason);
                });
        }
    };


    return (
        <div>
            {!canAdd ? `` : (
                <form action={submit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del producto o categoría"
                    />
                    <label>
                        <input type="checkbox" name="isDirectory" />
                        Es categoría
                    </label>
                    <button type="submit">+</button>
                </form>
            )}
        </div >
    );
};

export default Add;