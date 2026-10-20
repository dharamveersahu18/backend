import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import WatchVideo from "./pages/WatchVideo";
import ChannelProfile from "./pages/ChannelProfile";
import CreatorStudio from "./pages/CreatorStudio";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Community from "./pages/Community";
import LikedVideos from "./pages/LikedVideos";
import History from "./pages/History";
import Subscriptions from "./pages/Subscriptions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Guest Route Guard (for login/register when already logged in)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:videoId" element={<WatchVideo />} />
              <Route path="/c/:username" element={<ChannelProfile />} />
              <Route path="/community" element={<Community />} />
              <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />

              {/* Protected Routes */}
              <Route
                path="/studio"
                element={
                  <ProtectedRoute>
                    <CreatorStudio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/playlists"
                element={
                  <ProtectedRoute>
                    <Playlists />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/liked-videos"
                element={
                  <ProtectedRoute>
                    <LikedVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute>
                    <Subscriptions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Auth / Guest Routes */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
