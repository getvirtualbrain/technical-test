import { useState } from "react";
import SearchBar from "./SearchBar";
import { useTheme } from "./ThemeContext";
import ThemeSwitcher from "./ThemeSwitcher";
import Types from "./Types";

type HeaderProps = {
  name: string;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setName: (value: string) => void;
  refetch: () => void;
};

export function Header({
  name,
  setName,
  refetch,
  selectedTypes,
  setSelectedTypes,
}: HeaderProps) {
  const { theme } = useTheme();

  const [isTypesVisible, setIsTypesVisible] = useState(false);

  return (
    <div
      className={`${
        theme === "light"
          ? "bg-amber-100 text-slate-700"
          : "bg-slate-800 text-white"
      } p-7 sticky top-0 z-10 shadow-lg w-full flex items-center justify-evenly`}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-7xl text-center  font-thin ">PokeBattle</h1>
        <div className="flex items-center gap-4 mt-4">
          <SearchBar
            placeholder="Rechercher un pokemon..."
            value={name}
            onChange={(value) => setName(value)}
            onSubmit={() => refetch()}
          />
          <button
            className={`px-4 py-2 rounded-md text-white ${
              theme === "light" ? "bg-blue-500" : "bg-blue-700"
            }`}
            onClick={() => setIsTypesVisible(!isTypesVisible)}
          >
            Filtrer
          </button>
        </div>
        {isTypesVisible && (
          <Types
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />
        )}
        <ThemeSwitcher />
      </div>
    </div>
  );
}
