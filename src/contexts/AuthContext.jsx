import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import profileService from "../services/profileService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("mentormatch_user");
      if (storedUser) {
        let parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch up-to-date profile to get real integer ID and current info
        try {
          const res = await profileService.getProfile();
          if (res && res.code === 1000 && res.result) {
            parsedUser = {
              ...parsedUser,
              id: res.result.id,
              name: res.result.fullName || parsedUser.name,
              avatar: res.result.avatarUrl || parsedUser.avatar,
              email: res.result.email || parsedUser.email,
              role: parsedUser.userName?.toLowerCase().includes("admin")
                ? "admin"
                : parsedUser.userName?.toLowerCase().includes("mentor") ||
                    ["nam", "nam2", "nam3"].includes(
                      parsedUser.userName?.toLowerCase(),
                    ) ||
                    res.result.roles?.includes("ROLE_MENTOR")
                  ? "mentor"
                  : "mentee",
            };
            setUser(parsedUser);
            localStorage.setItem(
              "mentormatch_user",
              JSON.stringify(parsedUser),
            );
          }
        } catch (err) {
          console.error("Could not fetch fresh profile on load", err);
        }
      }
    };
    initAuth();
  }, []);

  const login = async (userName, password) => {
    try {
      const response = await authService.login(userName, password);
      if (
        response &&
        response.code === 1000 &&
        response.result &&
        response.result.authenticated
      ) {
        // Extract basic data (since the API returns `token` and `authenticated` inside `result`)
        const token = response.result.token;
        let role = "mentee";

        // Temporary role guess, will be overridden by profile pull below
        if (userName.toLowerCase().includes("admin")) {
          role = "admin";
        } else if (userName.toLowerCase().includes("mentor")) {
          role = "mentor";
        } else if (
          userName.toLowerCase() === "nam2" ||
          userName.toLowerCase() === "nam"
        ) {
          role = "mentor";
        }

        let userData = {
          id: userName, // Temporary string ID
          name: userName, // Use username as name for now
          userName: userName,
          role: role,
          avatar: `https://i.pravatar.cc/150?u=${userName}`,
          token: token,
        };

        // Set immediately to allow requests within the same tick to pick up the token
        setUser(userData);
        localStorage.setItem("mentormatch_user", JSON.stringify(userData));

        // Fetch real ID right after login using the newly saved token
        try {
          const profileRes = await profileService.getProfile();
          if (profileRes && profileRes.code === 1000 && profileRes.result) {
            userData = {
              ...userData,
              id: profileRes.result.id,
              name: profileRes.result.fullName || userData.name,
              avatar: profileRes.result.avatarUrl || userData.avatar,
              email: profileRes.result.email || userData.email,
              role: userData.userName?.toLowerCase().includes("admin")
                ? "admin"
                : userData.userName?.toLowerCase().includes("mentor") ||
                    ["nam", "nam2", "nam3"].includes(
                      userData.userName?.toLowerCase(),
                    ) ||
                    profileRes.result.roles?.includes("ROLE_MENTOR")
                  ? "mentor"
                  : "mentee",
            };
            setUser(userData);
            localStorage.setItem("mentormatch_user", JSON.stringify(userData));
          }
        } catch (e) {
          console.error("Could not fetch profile during login", e);
        }

        return { success: true };
      }
      return {
        success: false,
        message: response?.message || "Xác thực thất bại",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Sai tài khoản hoặc mật khẩu",
      };
    }
  };

  const register = async (userName, email, password) => {
    try {
      const response = await authService.register(userName, email, password);
      if (response && response.code === 1000) {
        return { success: true };
      }
      return {
        success: false,
        message: response?.message || "Đăng ký thất bại",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi đăng ký tài khoản",
      };
    }
  };

  const logout = async () => {
    let tokenToRevoke = user?.token;

    if (!tokenToRevoke) {
      const storedUser = localStorage.getItem("mentormatch_user");
      if (storedUser) {
        try {
          tokenToRevoke = JSON.parse(storedUser)?.token;
        } catch (e) {
          console.error("Could not parse stored user during logout", e);
        }
      }
    }

    // Clear local auth state first so logout feels immediate for users.
    setUser(null);
    localStorage.removeItem("mentormatch_user");

    if (!tokenToRevoke) return;

    try {
      await authService.logout(tokenToRevoke);
    } catch (error) {
      console.error("Logout API error:", error);
    }
  };

  const updateAuthUser = (updates) => {
    if (user) {
      const newUser = { ...user, ...updates };
      setUser(newUser);
      localStorage.setItem("mentormatch_user", JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
