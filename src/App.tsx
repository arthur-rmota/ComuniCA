import { Routes, Route } from "react-router";
import { ProfileProvider } from "./contexts/ProfileContext";
import HomePage from "./pages/HomePage";
import QuickPhrasesPage from "./pages/QuickPhrasesPage";
import AgendaPage from "./pages/AgendaPage";
import ProfilePage from "./pages/ProfilePage";
import BottomNavigation from "./components/layout/BottomNavigation";
import ManageProfilePage from "./pages/ManageProfilePage";
import ManageCategoriesPage from "./pages/ManageCategoriesPage";
import ManageQuickPhrasesPage from "./pages/ManageQuickPhrasesPage";
import RecoverPinPage from "./pages/RecoverPinPage";
import ManageCardsPage from "./pages/ManageCardsPage";
import CategoryCardsPage from "./pages/CategoryCardsPage";
import AboutPage from "./pages/AboutPage";
import EmergencyPage from "./pages/EmergencyPage";
import ManageEmergencyPhrasesPage from "./pages/ManageEmergencyPhrasesPage";
import RoutineSectionPage from "./pages/RoutineSectionPage";
import ManageRoutinePage from "./pages/ManageRoutinePage";
import ManageRoutineActivitiesPage from "./pages/ManageRoutineActivitiesPage";
import RoutineActivityPage from "./pages/RoutineActivityPage";

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
