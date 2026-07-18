import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import "./MainLayout.css";

function MainLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    useEffect(() => {
        setTimeout(() => {
            setMobileOpen(false);
        }, 0);
    }, [location.pathname, location.search]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setIsCollapsed(false);
            } else if (width >= 768 && width < 1024) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMobileOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className={`layout-container app-layout ${isCollapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-sidebar-active" : ""}`}>
            {mobileOpen && (
                <div className="sidebar-mobile-backdrop" onClick={() => setMobileOpen(false)} />
            )}
            
            <Sidebar 
                isCollapsed={isCollapsed} 
                toggleSidebar={toggleSidebar} 
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />
            
            <div className="layout-main">
                <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
                <main className="layout-content fade-in">
                    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading Page...</div>}>
                        {children || <Outlet />}
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
