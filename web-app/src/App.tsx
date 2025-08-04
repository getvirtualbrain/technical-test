import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Fight from "./pages/Fight";
import PokemonApp from "./pages/PokemonApp";
import { queryClient } from "./queryClients";

function FightRouteElement() {
  const location = useLocation();
  return <Fight key={location.state?.key} />;
}

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PokemonApp />} />
              <Route path="/fight" element={<FightRouteElement />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
