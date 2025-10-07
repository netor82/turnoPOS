import React, { useState } from 'react';
import type Item from '../../models/Item';

export interface ChooseItemProps {
    items: Item[];
    selectDirectory?: boolean;
    onSelect: (x: Item) => void;
    onCancel: () => void;
}

const ChooseItem: React.FC<ChooseItemProps> = ({ items, onSelect, onCancel, selectDirectory }) => {
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
    const handleSelectDirectory = () => {
        if (selectedItem) {
            onSelect(selectedItem);
            setSelectedItem(null);
        }
    }

    const children = items.filter(i => i.parentId == selectedItem?.id && (!selectDirectory || i.isDirectory));

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

    const backButton = selectedItem == null ? <i></i> :
        (
            <button key="0-back" onClick={goBack} >
                <span className="item-picker-number">0</span>
                ⏮️Atrás
            </button>
        )
    const renderItemButton = (child: Item, index: number) =>
            <button key={child.id} onClick={() => handleSelectItem(child)} >
                <span className="item-picker-number">{index + 1}</span>
                <span className={'item-name' + (!child.isDirectory && !child.stock && ' strike' || '')}>{child.name}</span>
                <span className="item-picker-stock">{child.isDirectory ? '📁' : child.stock}</span>
            </button>;

    const renderSelectDiretoryButton =
        (selectDirectory && selectedItem && selectedItem.children && selectedItem.children.length < 9) ?
            <button onClick={() => handleSelectDirectory()}>
                Mover aquí
            </button>
            : null;
    ;


    return (
        <div onKeyUp={handleKeyUp} className="item-picker">
            <input autoFocus type="text" value={search} readOnly placeholder="Usar el teclado" />
            <span>{selectedItem?.name}</span>
            {backButton}
            {children.map((child, index) => renderItemButton(child, index))}
            {renderSelectDiretoryButton}
        </div>
    );
}


export default ChooseItem;