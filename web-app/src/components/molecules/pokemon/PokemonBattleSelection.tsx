import { Pokemon } from '@shared/types';
import React from 'react';
import { useTheme } from '../../atoms/ThemeContext';
import PokemonList from './PokemonList';


type OwnProps = {
    selectedPokemons: Pokemon[];
    onPokemonClick: (pokemon: Pokemon) => void;
}

const PokemonBattleSelection: React.FC<OwnProps> = ({ selectedPokemons, onPokemonClick }) => {
    const { theme } = useTheme();

    if (selectedPokemons.length === 0) { return null }

    return (
        <div className='flex flex-col items-center py-8'>
            <h2 className={`text-2xl ${theme === 'light' ? 'text-black' : 'text-white'}`}>Your selected pokemons for battle</h2>
            <PokemonList selectable pokemons={selectedPokemons} onPokemonClick={onPokemonClick} />
        </div>
    );
}

export default PokemonBattleSelection;