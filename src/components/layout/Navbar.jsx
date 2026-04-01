import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleOpenMyProfile = () => {
    navigate("/me");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 w-64 shrink-0">
          <div className="flex items-center gap-1 text-primary">
            <a href="/">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
              <span className="text-xl font-bold">MentorMatch</span>
            </a>
          </div>
        </div>

        {/* Global Search is removed */}

        {/* Actions & Profile */}
        <div className="flex items-center justify-end gap-3 md:gap-5 w-64 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            title="Chế độ giao diện"
            className="h-10 w-10 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {user && <NotificationDropdown />}

          {user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenMyProfile}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden md:block hover:text-[#372660]"
                title="Trang cá nhân"
              >
                {user.name}
              </button>
              <button
                type="button"
                onClick={handleOpenMyProfile}
                className="relative group cursor-pointer"
                title="Trang cá nhân"
              >
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="h-9 w-9 rounded-full ring-2 ring-transparent transition-all group-hover:ring-[#372660] object-cover"
                />
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="text-slate-400 hover:text-red-600 rounded-full"
                title="Đăng xuất"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </Button>
            </div>
          ) : (
            <Button
              className="bg-[#372660] hover:bg-[#2b1d4c] text-white px-5 rounded-full text-sm font-medium transition-colors"
              onClick={() => (window.location.href = "/login")}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
