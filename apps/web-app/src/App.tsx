import PokemonApp from "./components/PokemonApp";
import {ThemeProvider} from "./components/ThemeContext";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <PokemonApp/>
      </ThemeProvider>
    </>
  );
}
