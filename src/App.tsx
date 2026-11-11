import { Routes, Route } from "react-router";
import { ProfileProvider } from "./contexts/ProfileContext";
import HomePage from "./pages/HomePage";
import QuickPhrasesPage from "./pages/QuickPhrasesPage";
import FavoritesPage from "./pages/FavoritesPage";
import AgendaPage from "./pages/AgendaPage";
import ProfilePage from "./pages/ProfilePage";
import BottomNavigation from "./components/layout/BottomNavigation";
import ManageProfilePage from "./pages/ManageProfilePage";
import ManageCategoriesPage from "./pages/ManageCategoriesPage";
import ManageQuickPhrasesPage from "./pages/ManageQuickPhrasesPage";
import RecoverPinPage from "./pages/RecoverPinPage";

function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rapidos" element={<QuickPhrasesPage />} />
        <Route path="/rapidos/gerenciar" element={<ManageQuickPhrasesPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/perfil/gerenciar" element={<ManageProfilePage />} />
        <Route path="/perfil/categorias" element={<ManageCategoriesPage />} />
        <Route path="/perfil/recuperar-pin" element={<RecoverPinPage />} />
      </Routes>

      <BottomNavigation />
    </ProfileProvider>
  );
}

export default App;
