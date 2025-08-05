import { useTheme } from "./ThemeContext";
import ThemeSwitcher from "./ThemeSwitcher";

export function Header() {
    const { theme } = useTheme();

    return (
        <div className={`${theme === "light" ? "bg-amber-100 text-slate-700" : "bg-slate-800 text-white"} p-7 sticky top-0 z-10 shadow-lg w-full flex items-center justify-evenly`}>
            <div className="flex flex-col">
                <h1 className= "text-7xl text-center  font-thin ">PokeBattle</h1>
                <ThemeSwitcher/>
            </div>
        </div>
    );
}