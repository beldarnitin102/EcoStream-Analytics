import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header />

        <section className="content">
          {children}
        </section>
      </main>
    </div>
  );
}

export default MainLayout;