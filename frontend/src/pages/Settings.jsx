import React, { useState } from "react";
import { User, Lock, Image as ImageIcon, Save, ShieldCheck } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await axiosInstance.patch("/users/update-account", {
        fullName,
        email,
      });
      updateUser(res.data.data);
      addToast("Account details updated successfully!", "success");
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      addToast("Uploading new avatar...", "info");
      const res = await axiosInstance.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ avatar: res.data.data.avatar });
      addToast("Avatar updated!", "success");
    } catch (error) {
      addToast("Failed to upload avatar", "error");
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      addToast("Uploading new cover banner...", "info");
      const res = await axiosInstance.patch("/users/cover-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ coverImage: res.data.data.coverImage });
      addToast("Cover image updated!", "success");
    } catch (error) {
      addToast("Failed to upload cover banner", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }

    try {
      setChangingPassword(true);
      await axiosInstance.post("/users/change-password", {
        oldPassword,
        newPassword,
      });
      addToast("Password changed successfully!", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Manage your account profile, channel branding, and security
        </p>
      </div>

      {/* Profile Branding Section */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col gap-6 shadow-md">
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-400" />
          Channel Branding
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              }
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700"
            />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-200">
                Channel Avatar
              </span>
              <label className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 cursor-pointer transition">
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cover Banner Upload */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-16 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-700 flex items-center justify-center">
              {user?.coverImage ? (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-500">No cover</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-200">
                Cover Banner
              </span>
              <label className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 cursor-pointer transition">
                Change Banner
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Section */}
      <form
        onSubmit={handleUpdateDetails}
        className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4 shadow-md"
      >
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Account Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updatingProfile}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {updatingProfile ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>

      {/* Security / Password Change */}
      <form
        onSubmit={handleChangePassword}
        className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4 shadow-md"
      >
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          Security & Password
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Old Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={changingPassword}
            className="flex items-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
