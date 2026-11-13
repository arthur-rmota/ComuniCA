import { Routes, Route } from "react-router";
import { ProfileProvider } from "./contexts/ProfileContext";
import HomePage from "./pages/home/HomePage";
import QuickPhrasesPage from "./pages/phrases/QuickPhrasesPage";
import AgendaPage from "./pages/routine/AgendaPage";
import ProfilePage from "./pages/profile/ProfilePage";
import BottomNavigation from "./components/layout/BottomNavigation";
import ManageProfilePage from "./pages/profile/ManageProfilePage";
import ManageCategoriesPage from "./pages/categories/ManageCategoriesPage";
import ManageQuickPhrasesPage from "./pages/phrases/ManageQuickPhrasesPage";
import RecoverPinPage from "./pages/profile/RecoverPinPage";
import ManageCardsPage from "./pages/categories/ManageCardsPage";
import CategoryCardsPage from "./pages/categories/CategoryCardsPage";
import AboutPage from "./pages/about/AboutPage";
import EmergencyPage from "./pages/emergency/EmergencyPage";
import ManageEmergencyPhrasesPage from "./pages/emergency/ManageEmergencyPhrasesPage";
import RoutineSectionPage from "./pages/routine/RoutineSectionPage";
import ManageRoutinePage from "./pages/routine/ManageRoutinePage";
import ManageRoutineActivitiesPage from "./pages/routine/ManageRoutineActivitiesPage";
import RoutineActivityPage from "./pages/routine/RoutineActivityPage";

function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rapidos" element={<QuickPhrasesPage />} />
        <Route path="/rapidos/gerenciar" element={<ManageQuickPhrasesPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/rotina/:sectionId" element={<RoutineSectionPage />} />
        <Route path="/emergencia" element={<EmergencyPage />} />
        <Route path="/emergencia/gerenciar" element={<ManageEmergencyPhrasesPage />}/>
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/perfil/gerenciar" element={<ManageProfilePage />} />
        <Route path="/perfil/categorias" element={<ManageCategoriesPage />} />
        <Route path="/perfil/recuperar-pin" element={<RecoverPinPage />} />
        <Route path="/perfil/categorias/:categoryId/cartoes" element={<ManageCardsPage />} />
        <Route path="/categorias/:categoryId" element={<CategoryCardsPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/rotina/gerenciar" element={<ManageRoutinePage />} />
        <Route path="/rotina/gerenciar/:sectionId/atividades" element={<ManageRoutineActivitiesPage />} />
        <Route path="/rotina/:sectionId/atividades/:activityId" element={<RoutineActivityPage />} />
      </Routes>

      <BottomNavigation />
    </ProfileProvider>
  );
}

export default App;
