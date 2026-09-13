import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f4f6f9]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header />

        <section className="w-full px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1500px]">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainLayout;