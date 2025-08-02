import { PokemonType } from "@shared/types";
import React from "react";

interface Props {
    types: PokemonType[];
}

const PokemonTypeChips: React.FC<Props> = ({ types }) => {
    return (
        <div className="flex flex-wrap gap-2 px-4">
            {types.map((type) => (
                <div
                    key={type.name}
                    className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border border-amber-200 
                     px-3 py-1 rounded-full shadow-sm cursor-default transition-colors duration-200"
                >
                    <img src={type.image} alt={type.name} className="w-5 h-5" />
                    <span className="text-sm font-medium">{type.name}</span>
                </div>
            ))}
        </div>
    );
};

export default PokemonTypeChips;
