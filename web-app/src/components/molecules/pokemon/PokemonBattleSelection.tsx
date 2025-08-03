import { Pokemon } from '@shared/types';
import React from 'react';
import { useTheme } from '../../atoms/ThemeContext';
import PokemonCard from './PokemonCard';


type OwnProps = {
    selectedPokemons: Pokemon[];
    isFighting: boolean;
    onPokemonClick: (pokemon: Pokemon) => void;
    onFightClick: () => void;
}

const PokemonBattleSelection: React.FC<OwnProps> = ({ selectedPokemons, onPokemonClick }) => {
    const { theme } = useTheme();

    if (selectedPokemons.length === 0) { return null }

    return (
        <div className='flex flex-col items-center py-8'>
            <h1 className={`text-2xl py-8 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Your selected pokemons for battle</h1>
            <div className={`p-4 grid grid-cols-1 sm:grid-cols-2 gap-10 place-items-center ${theme === 'light' ? '' : 'bg-slate-800'}`}>
                {selectedPokemons.map((p) => (
                    <PokemonCard pokemon={p} key={p.id} onClick={() => onPokemonClick(p)} selectable />
                ))}
            </div>
        </div >
    );
}

export default PokemonBattleSelection;