import { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";

function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  // Track window width and auto-collapse
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 768) {
        setIsCollapsed(false);
        setMobileOpen(false);
      } else if (width < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ESC to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isMobile = windowWidth < 768;
  const sidebarWidth = isCollapsed ? 72 : 240;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main area pushed by sidebar */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : `${sidebarWidth}px` }}
      >
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            {children || <Outlet />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
