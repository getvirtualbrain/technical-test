import React, { useEffect, useState } from 'react';
import { useTheme } from '../../atoms/ThemeContext';

type OwnProps = {
    onChange: (value: string) => void;
}

const PokemonSearchBar: React.FC<OwnProps> = ({ onChange }) => {
    const { theme } = useTheme();
    const [value, setValue] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value.trim());
        }, 300);

        return () => clearTimeout(timeout);
    }, [value, onChange]);

    return (
        <div className='flex items-center p-4 w-full grid'>
            <input className={`p-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-700'}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                placeholder="Search for a Pokemon by name" />
        </div>
    );
}

export default PokemonSearchBar;