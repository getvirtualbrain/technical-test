import { PokemonType } from "@shared/types";
import React from "react";

interface Props {
    types: PokemonType[];
    onTypeClick: (type: PokemonType) => void;
    selectedTypes: PokemonType[];
}

const PokemonTypes: React.FC<Props> = ({ types, onTypeClick, selectedTypes }) => {
    return (
        <div className="flex flex-wrap gap-2 px-4">
            {types.map((type) => {
                const isSelected = selectedTypes.some(selectedType => selectedType.name === type.name);
                return (
                    <button
                        key={type.name}
                        onClick={() => onTypeClick(type)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full shadow-sm border transition-colors duration-200 
              ${isSelected
                                ? "bg-amber-300 border-amber-400"
                                : "bg-amber-100 hover:bg-amber-200 border-amber-200"
                            }`}
                    >
                        <img src={type.image} alt={type.name} className="w-5 h-5" />
                        <span className="text-sm font-medium">{type.name}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default PokemonTypes;
