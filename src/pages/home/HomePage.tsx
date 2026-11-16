
import HomeHeader from "../../components/home/HomeHeader";
import DailyMessage from "../../components/home/DailyMessage";
import HomeSections from "../../components/home/HomeSections";

function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-24 h-48 w-48 rounded-full bg-[#FFF0BB]/40"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <HomeHeader />
        <DailyMessage />
        <HomeSections />
      </div>
    </main>
  );
}

export default HomePage;
