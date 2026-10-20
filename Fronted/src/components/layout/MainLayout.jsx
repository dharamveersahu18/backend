import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UploadVideoModal from "../video/UploadVideoModal";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100 flex flex-col">
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenUpload={() => setUploadModalOpen(true)}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
            sidebarOpen ? "md:ml-60" : "md:ml-20"
          } min-h-[calc(100vh-3.5rem)]`}
        >
          <Outlet />
        </main>
      </div>

      <UploadVideoModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
