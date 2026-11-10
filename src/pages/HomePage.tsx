import HomeHeader from '../components/home/HomeHeader';
import DailyMessage from '../components/home/DailyMessage';
import LearningSection from '../components/home/LearningSection';
import HomeSections from '../components/home/HomeSections';
import BottomNavigation from '../components/layout/BottomNavigation';

function HomePage() {
  return (
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <HomeHeader />

      <DailyMessage />
      
      <LearningSection />

      <HomeSections />
      <BottomNavigation />
    </main>
  );
}

export default HomePage;