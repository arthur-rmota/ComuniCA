import HomeHeader from '../components/home/HomeHeader';
import DailyMessage from '../components/home/DailyMessage';
import LearningSection from '../components/home/LearningSection';
import HomeSections from '../components/home/HomeSections';

function HomePage() {
  return (
    <main className="min-h-screen bg-app-background px-4 pb-28 pt-4">
      <HomeHeader />

      <DailyMessage />
      
      <LearningSection />

      <HomeSections />
    </main>
  );
}

export default HomePage;