import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router";
import QuickPhrasesPage from "./pages/QuickPhrasesPage";
import FavoritesPage from "./pages/FavoritesPage";
import AgendaPage from "./pages/AgendaPage";
import ProfilePage from "./pages/ProfilePage";
import BottomNavigation from "./components/layout/BottomNavigation";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rapidos" element={<QuickPhrasesPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>

      <BottomNavigation />
    </>
  );
}

export default App;
