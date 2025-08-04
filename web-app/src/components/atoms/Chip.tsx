import React from "react";

interface Props {
    onClick: () => void;
    isSelected: boolean;
    image?: string;
    imageAlt?: string;
    text: string;
}

const Chip: React.FC<Props> = ({ isSelected, onClick, image, imageAlt, text }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1 px-3 py-1 rounded-full shadow-sm border transition-colors duration-200 
              ${isSelected
                    ? "bg-amber-300 border-amber-400"
                    : "bg-amber-100 hover:bg-amber-200 border-amber-200"
                }`}
        >
            {image && (<img src={image} alt={imageAlt} className="w-5 h-5" />)}
            <span className="text-sm font-medium">{text}</span>
        </button>
    );
};

export default Chip;
