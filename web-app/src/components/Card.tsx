import { useCallback, useState } from "react";
import { useTheme } from "./ThemeContext";

interface CardProps {
    pokemon: any;
}

function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number = 100
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
}

export const MiniCard: React.FC<CardProps> = ({ pokemon }) => {
    return <div className="bg-amber-300 rounded-2xl p-2 h-[40px] flex items-center">
        <img src={pokemon.imageUrl} alt={pokemon.name} style={{ height: '100%' }} />
        <div className="text-center ml-2">{pokemon.name}</div>
    </div>;
}

const Card: React.FC<CardProps> = ({ pokemon }) => {
    const { theme } = useTheme();
    if (!pokemon) {
        return null;
    }
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const onMouseMove = useCallback(
        throttle((e: React.MouseEvent<HTMLDivElement>) => {
          const card = e.currentTarget;
          const box = card.getBoundingClientRect();
          const x = e.clientX - box.left;
          const y = e.clientY - box.top;
          const centerX = box.width / 2;
          const centerY = box.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;
    
          setRotate({ x: rotateX, y: rotateY });
        }),
        []
    );

    const onMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };
    return (
        <div className={` bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300  p-1 rounded-2xl w-[250px] shadow-md outline-orange-400 hover:outline-dashed`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
            transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
          }}
        >
            <div className={`rounded-2xl bg-gradient-to-br from-black/10 via-white/70 to-black/10 `}>
                <div className="p-4 flex-col rounded-2xl">
                <div className='flex gap-3 justify-between'>
                    <div className='font-bold'>{pokemon.name}</div>
                    <div>HP: {pokemon.stats.HP}</div>
                    {pokemon.apiTypes.map((type) => (
                      <img className='self-end' src={type.image} alt={type.name} style={{ width: "20px"}} />
                    ))}
                </div>
                <img className={`${theme === "light" ? "bg-white" : "bg-blue-950"} outline outline-2 my-3`} src={pokemon.image} alt={pokemon.name} style={{ width: 'auto' }} />
                <div>Attack: {pokemon.stats.attack}</div>
                <div>Defense: {pokemon.stats.defense}</div>
                <div>Speed: {pokemon.stats.speed}</div>
                </div>
              </div>
        </div>
    )
}

export default Card;