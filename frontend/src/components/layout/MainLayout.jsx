import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#f4f6f9]">
      
      {/* Sidebar Container */}
      <div
        className={`
          hidden shrink-0 overflow-hidden
          transition-[width] duration-300 ease-in-out
          lg:block
          ${sidebarOpen ? "lg:w-[250px]" : "lg:w-0"}
        `}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <Header onMainHubClick={toggleSidebar} />

        <section className="w-full px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1500px]">
            {children}
          </div>
        </section>
      </main>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
      </div>
    </div>
  );
}

export default MainLayout;