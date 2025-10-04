import React, { useState } from 'react';
import type Item from '../../models/Item';

export interface ChooseItemProps {
    items: Item[];
    onSelect: (x: Item) => void;
    onCancel: () => void;
}

const ChooseItem: React.FC<ChooseItemProps> = ({ items, onSelect, onCancel }) => {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [search, setSearch] = useState('');

    const handleSelectItem = (item: Item) => {
        if (!item.isDirectory) {
            onSelect(item);
            setSelectedItem(null);
        }
        else {
            setSelectedItem(item);
        }
    }
    const children = items.filter(i => i.parentId == selectedItem?.id);

    const handleKeyUp = (e: React.KeyboardEvent) => {
        const key = +e.key;
        setSearch('');
        if (!isNaN(key)) {

            if (key === 0) {
                goBack();
                return;
            }
            if (key > children.length) return;


            const newSelectedItem = children[key - 1];

            if (!newSelectedItem.isDirectory) {
                handleSelectItem(newSelectedItem);
            }
            else {
                setSelectedItem(newSelectedItem);
            }
        }
    };

    const goBack = () => {
        const newSelectedItem = items.find(i => i.id == selectedItem?.parentId);
        setSelectedItem(newSelectedItem || null);
        onCancel();
    }

    const backButton = selectedItem == null ? '' :
        (<button key="0-back" onClick={goBack} >0 - ⏮️Atrás</button>)


    return (
        <div onKeyUp={handleKeyUp}>
            <input autoFocus type="text" value={search} readOnly />
            <br />
            {backButton}
            {children.map((child, index) => (
                <button key={child.id} onClick={() => handleSelectItem(child)} >
                    {index + 1} - <strong className={(!child.isDirectory && !child.stock && 'strike') || ''}>{child.name}</strong>
                </button>
            ))}
        </div>
    );
}


export default ChooseItem;