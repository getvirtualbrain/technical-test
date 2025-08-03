import { ThemeProvider } from "./components/atoms/ThemeContext";
import PokemonApp from "./components/molecules/pokemon/PokemonApp";


export default function App() {
  return (
    <>
      <ThemeProvider>
        <PokemonApp />
      </ThemeProvider>
    </>
  );
}
