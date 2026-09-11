import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Video,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Tv,
  PlusCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onToggleSidebar, onOpenUpload }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Left section: Menu & Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Tv className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-purple-200 to-purple-400 bg-clip-text text-transparent hidden sm:inline-block">
            VideoTube
          </span>
        </Link>
      </div>

      {/* Middle section: Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-xl flex items-center relative"
      >
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="Search videos, playlists, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-purple-500 rounded-full py-2 pl-4 pr-10 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                navigate("/");
              }}
              className="absolute right-12 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-4 bg-zinc-800 hover:bg-purple-600 text-zinc-300 hover:text-white rounded-full flex items-center justify-center transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Right section: Upload, Auth / User dropdown */}
      <div className="flex items-center gap-2.5 shrink-0">
        {isAuthenticated ? (
          <>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600/15 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* User Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-purple-500/40 hover:border-purple-500 focus:outline-none transition-all shadow-md"
              >
                <img
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  }
                  alt={user?.fullName || "User"}
                  className="w-full h-full object-cover"
                />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2.5 border-b border-zinc-800">
                      <p className="text-sm font-semibold text-zinc-100 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        @{user?.username}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={`/c/${user?.username}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition"
                      >
                        <User className="w-4 h-4 text-purple-400" />
                        Your Channel
                      </Link>
                      <Link
                        to="/studio"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        Creator Studio
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition"
                      >
                        <Settings className="w-4 h-4 text-teal-400" />
                        Settings
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition shadow-md shadow-purple-600/20"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
