import { Pokemon } from '@shared/types';
import React from 'react';
import { useTheme } from '../../atoms/ThemeContext';
import PokemonList from './PokemonList';


type OwnProps = {
    selectedPokemons: Pokemon[];
}

const PokemonSelection: React.FC<OwnProps> = ({ selectedPokemons }) => {
    const { theme } = useTheme();

    return (
        <PokemonList pokemons={selectedPokemons} onPokemonClick={() => { }} />
    );
}

export default PokemonSelection;