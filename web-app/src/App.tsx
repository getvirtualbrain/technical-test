import { ThemeProvider } from "./components/ThemeContext";
import PokemonApp from "./components/PokemonApp";


export default function App() {
  return (
    <>
      <ThemeProvider>
          <PokemonApp/>
      </ThemeProvider>
    </>
  );
}
