import React from 'react';
import type Item from '../../models/Item';

interface SummaryProps {
    items: Item[]
}
const InventorySummary: React.FC<SummaryProps> = ({ items }) => {
    const directoriesExcluded = items.filter(i => !i.isDirectory && i.isActive);
    directoriesExcluded.sort((a, b) => ('' + a.name).localeCompare(b.name));

    const renderItems =
        (
            <div className="space-top">
                <hr />
                <h3>Items activos</h3>
                <ol>
                    {directoriesExcluded.map(x =>
                        <li key={x.id}>{x.name} - {x.stock}</li>
                    )}
                </ol>
            </div>);
    return renderItems;
}

export default InventorySummary;