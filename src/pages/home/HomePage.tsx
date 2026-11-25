import HomeHeader from "../../components/home/HomeHeader";
import DailyMessage from "../../components/home/DailyMessage";
import HomeSections from "../../components/home/HomeSections";
import MessageShortcut from "../../components/home/MessageShortcut";

function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4 md:px-6 md:pt-6 xl:px-8 xl:pb-8 xl:pt-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-24 h-48 w-48 rounded-full bg-[#FFF0BB]/40"
      />

      <div className="app-page-container">
        <HomeHeader />

        <div className="md:grid md:grid-cols-2 md:gap-4 md:[&>*]:my-0">
          <DailyMessage />
          <MessageShortcut />
        </div>

        <HomeSections />
      </div>
    </main>
  );
}

export default HomePage;
