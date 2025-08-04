import { PokemonType } from "@shared/types";
import React from "react";
import Chip from "../../atoms/Chip";


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
                    <Chip
                        key={type.name}
                        isSelected={isSelected}
                        onClick={() => onTypeClick(type)}
                        image={type.image}
                        imageAlt={type.name}
                        text={type.name} />
                )
            })}
        </div>
    );
};

export default PokemonTypes;
