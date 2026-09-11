import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  Tv2,
  History,
  ThumbsUp,
  ListVideo,
  MessageSquareQuote,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();

  const mainLinks = [
    { label: "Home", path: "/", icon: Home },
    { label: "Subscriptions", path: "/subscriptions", icon: Tv2, requiresAuth: true },
    { label: "Community", path: "/community", icon: MessageSquareQuote },
  ];

  const libraryLinks = [
    { label: "History", path: "/history", icon: History, requiresAuth: true },
    { label: "Liked Videos", path: "/liked-videos", icon: ThumbsUp, requiresAuth: true },
    { label: "Playlists", path: "/playlists", icon: ListVideo, requiresAuth: true },
  ];

  const studioLinks = [
    { label: "Creator Studio", path: "/studio", icon: LayoutDashboard, requiresAuth: true },
    { label: "Settings", path: "/settings", icon: Settings, requiresAuth: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 overflow-y-auto flex flex-col p-3 gap-6 ${
          isOpen ? "w-60 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        }`}
      >
        {/* Main Section */}
        <div className="flex flex-col gap-1">
          {mainLinks
            .filter((item) => !item.requiresAuth || isAuthenticated)
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-600/15 text-purple-400 font-semibold"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                    } ${!isOpen ? "md:justify-center md:px-0" : ""}`
                  }
                  title={item.label}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
        </div>

        {/* Library Section */}
        {isAuthenticated && (
          <div className="flex flex-col gap-1 border-t border-zinc-800/80 pt-4">
            {isOpen && (
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-1">
                Library
              </span>
            )}
            {libraryLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-600/15 text-purple-400 font-semibold"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                    } ${!isOpen ? "md:justify-center md:px-0" : ""}`
                  }
                  title={item.label}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Studio / Settings */}
        {isAuthenticated && (
          <div className="flex flex-col gap-1 border-t border-zinc-800/80 pt-4 mt-auto">
            {studioLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-600/15 text-purple-400 font-semibold"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                    } ${!isOpen ? "md:justify-center md:px-0" : ""}`
                  }
                  title={item.label}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
