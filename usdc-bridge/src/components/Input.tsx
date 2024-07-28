import React from 'react';

export interface InputProps {
    id: string;
    name: string;
    label: string;
    [rest: string]: unknown;
}

export const Input: React.FC<InputProps> = ({ id, label, name, ...rest }) => {
    return (
        <label htmlFor={id}>
            <input
                className="border border-orange-300 rounded-sm w-full h-12 p-2" 
                id={id}
                type="text"
                name={name}
                placeholder={label}
                {...rest} />
        </label>
    );
};

