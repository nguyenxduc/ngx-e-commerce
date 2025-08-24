import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    console.log("Toggle sidebar called, current state:", isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Navbar */}
        <AdminNavbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-base-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-base-300 dark:bg-gray-800 bg-opacity-75 z-40 lg:hidden pointer-events-auto"
          onClick={() => setIsSidebarOpen(false)}
          style={{ top: "64px" }} // Start below navbar
        />
      )}
    </div>
  );
};

export default AdminLayout;
