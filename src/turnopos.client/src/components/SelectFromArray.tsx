import React from "react";

type TypeWithIdAndName = {
    id: number;
    name: string;
}

interface SelectFromArrayProps {
    name: string;
    options: TypeWithIdAndName[];
    value: number | null | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
}

const SelectFromArray: React.FC<SelectFromArrayProps> = ({
    name, options, value,
    onChange, placeholder
}) => {


    const renderPlaceholder = placeholder ?
        (<option>{placeholder} </option>) : null;

    return (
        <select name={name} onChange={(e) => { onChange(+e.target.value) }}>
            {renderPlaceholder}
            {options.map((option) => (
                <option key={option.id} value={option.id} selected={option.id === value}>
                    {option.name}
                </option>
            ))}
        </select>
)
};

export default SelectFromArray;