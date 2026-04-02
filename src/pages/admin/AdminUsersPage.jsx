import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ShieldOff,
  ShieldCheck,
  UserCog,
  X,
} from "lucide-react";
import adminService from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";

const ROLE_OPTIONS = [
  {
    value: "ROLE_ADMIN",
    label: "Admin",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    value: "ROLE_MENTOR",
    label: "Mentor",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    value: "ROLE_MENTEE",
    label: "Mentee",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const roleLabelMap = {
  ROLE_ADMIN: "Admin",
  ROLE_MENTOR: "Mentor",
  ROLE_MENTEE: "Mentee",
};

const roleBadgeMap = {
  ROLE_ADMIN: "bg-rose-50 text-rose-700 border-rose-200",
  ROLE_MENTOR: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ROLE_MENTEE: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function extractRoleNames(userItem) {
  if (!userItem?.roles) return [];
  return userItem.roles.map((role) => role.name);
}

export default function AdminUsersPage() {
  const { user: authUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [message, setMessage] = useState(null);
  const [savingUserId, setSavingUserId] = useState(null);

  const [roleEditorUser, setRoleEditorUser] = useState(null);
  const [roleDraft, setRoleDraft] = useState([]);

  const fetchUsers = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await adminService.getUsers();
      if (res.code === 1000) {
        setUsers(res.result || []);
      } else {
        throw new Error(res.message || "Không thể tải danh sách người dùng");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Không thể tải danh sách người dùng",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users
      .filter((userItem) => {
        if (!normalizedSearch) return true;

        const haystacks = [
          userItem.fullName,
          userItem.userName,
          userItem.email,
          userItem.phone,
        ]
          .filter(Boolean)
          .map((value) => value.toLowerCase());

        return haystacks.some((value) => value.includes(normalizedSearch));
      })
      .filter((userItem) => {
        if (statusFilter === "ALL") return true;
        if (statusFilter === "ACTIVE") return userItem.isActive;
        if (statusFilter === "BLOCKED") return !userItem.isActive;
        return true;
      })
      .filter((userItem) => {
        if (roleFilter === "ALL") return true;
        const roles = extractRoleNames(userItem);
        return roles.includes(roleFilter);
      });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const updateUserInState = (updatedUser) => {
    setUsers((prev) =>
      prev.map((item) => (item.id === updatedUser.id ? updatedUser : item)),
    );
  };

  const handleToggleStatus = async (userItem) => {
    const nextActiveState = !userItem.isActive;

    if (authUser?.id === userItem.id && !nextActiveState) {
      setMessage({
        type: "error",
        text: "Bạn không thể tự chặn tài khoản admin hiện tại.",
      });
      return;
    }

    const actionLabel = nextActiveState ? "mở chặn" : "chặn";
    if (
      !window.confirm(
        `Bạn có chắc muốn ${actionLabel} người dùng ${userItem.userName}?`,
      )
    ) {
      return;
    }

    setSavingUserId(userItem.id);
    try {
      const res = await adminService.updateUser(userItem.id, {
        isActive: nextActiveState,
      });
      if (res.code === 1000 && res.result) {
        updateUserInState(res.result);
        setMessage({
          type: "success",
          text: `Đã ${actionLabel} người dùng ${userItem.userName}.`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Cập nhật trạng thái người dùng thất bại.",
      });
    } finally {
      setSavingUserId(null);
    }
  };

  const openRoleEditor = (userItem) => {
    setRoleEditorUser(userItem);
    setRoleDraft(extractRoleNames(userItem));
  };

  const handleRoleToggle = (roleName) => {
    setRoleDraft((prev) => {
      if (prev.includes(roleName)) {
        return prev.filter((item) => item !== roleName);
      }
      return [...prev, roleName];
    });
  };

  const handleSaveRoles = async () => {
    if (!roleEditorUser) return;

    if (roleDraft.length === 0) {
      setMessage({
        type: "error",
        text: "Người dùng phải có ít nhất một role.",
      });
      return;
    }

    if (
      authUser?.id === roleEditorUser.id &&
      !roleDraft.includes("ROLE_ADMIN")
    ) {
      setMessage({
        type: "error",
        text: "Bạn không thể tự gỡ quyền admin của chính mình.",
      });
      return;
    }

    setSavingUserId(roleEditorUser.id);
    try {
      const res = await adminService.updateUser(roleEditorUser.id, {
        roles: roleDraft,
      });
      if (res.code === 1000 && res.result) {
        updateUserInState(res.result);
        setMessage({
          type: "success",
          text: `Đã cập nhật role cho ${roleEditorUser.userName}.`,
        });
        setRoleEditorUser(null);
        setRoleDraft([]);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Cập nhật role thất bại.",
      });
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem danh sách tài khoản, chỉnh role và chặn/mở chặn người dùng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers({ showLoading: false })}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium border flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="p-1 rounded-md hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, username, email, số điện thoại"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#372660]/20 focus:border-[#372660]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#372660]/20 focus:border-[#372660]"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="BLOCKED">Đã chặn</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#372660]/20 focus:border-[#372660]"
          >
            <option value="ALL">Tất cả role</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-5 py-3">Người dùng</th>
                <th className="px-5 py-3">Liên hệ</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-400 text-sm"
                  >
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-400 text-sm"
                  >
                    Không có người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((userItem) => {
                  const roleNames = extractRoleNames(userItem);

                  return (
                    <tr key={userItem.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={
                              userItem.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.fullName || userItem.userName)}`
                            }
                            alt={userItem.fullName || userItem.userName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {userItem.fullName || "Chưa cập nhật tên"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              @{userItem.userName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <p className="text-sm text-slate-700">
                          {userItem.email || "-"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {userItem.phone || "Chưa có SĐT"}
                        </p>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {roleNames.length > 0 ? (
                            roleNames.map((role) => (
                              <span
                                key={`${userItem.id}-${role}`}
                                className={`px-2 py-1 rounded-full text-[11px] font-bold border ${roleBadgeMap[role] || "bg-slate-50 text-slate-700 border-slate-200"}`}
                              >
                                {roleLabelMap[role] || role}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">
                              Không có role
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            userItem.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {userItem.isActive ? "Đang hoạt động" : "Đã chặn"}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openRoleEditor(userItem)}
                            disabled={savingUserId === userItem.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60"
                          >
                            <UserCog className="w-3.5 h-3.5" />
                            Sửa role
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(userItem)}
                            disabled={savingUserId === userItem.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-60 ${
                              userItem.isActive
                                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            }`}
                          >
                            {userItem.isActive ? (
                              <>
                                <ShieldOff className="w-3.5 h-3.5" />
                                Chặn
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Mở chặn
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Đang tải danh sách người dùng...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Không có người dùng phù hợp.
            </div>
          ) : (
            filteredUsers.map((userItem) => {
              const roleNames = extractRoleNames(userItem);

              return (
                <div key={userItem.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        userItem.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.fullName || userItem.userName)}`
                      }
                      alt={userItem.fullName || userItem.userName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {userItem.fullName || "Chưa cập nhật tên"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        @{userItem.userName}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold border ${
                        userItem.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {userItem.isActive ? "Hoạt động" : "Đã chặn"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Email: {userItem.email || "-"}</p>
                    <p>SĐT: {userItem.phone || "Chưa có"}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {roleNames.length > 0 ? (
                      roleNames.map((role) => (
                        <span
                          key={`${userItem.id}-mobile-${role}`}
                          className={`px-2 py-1 rounded-full text-[11px] font-bold border ${roleBadgeMap[role] || "bg-slate-50 text-slate-700 border-slate-200"}`}
                        >
                          {roleLabelMap[role] || role}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">
                        Không có role
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openRoleEditor(userItem)}
                      disabled={savingUserId === userItem.id}
                      className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      Sửa role
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(userItem)}
                      disabled={savingUserId === userItem.id}
                      className={`flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold border ${
                        userItem.isActive
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {userItem.isActive ? (
                        <>
                          <ShieldOff className="w-3.5 h-3.5" />
                          Chặn
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Mở chặn
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {roleEditorUser && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setRoleEditorUser(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Cập nhật role
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Người dùng:{" "}
                  <span className="font-semibold">
                    @{roleEditorUser.userName}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRoleEditorUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              {ROLE_OPTIONS.map((role) => {
                const checked = roleDraft.includes(role.value);
                return (
                  <label
                    key={role.value}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? "border-[#372660] bg-[#372660]/5"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {role.label}
                      </p>
                      <p className="text-xs text-slate-500">{role.value}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleRoleToggle(role.value)}
                      className="w-4 h-4 accent-[#372660]"
                    />
                  </label>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRoleEditorUser(null)}
                className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveRoles}
                disabled={savingUserId === roleEditorUser.id}
                className="h-10 px-4 rounded-lg bg-[#372660] text-white text-sm font-semibold hover:bg-[#2b1d4c] disabled:opacity-60 inline-flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${savingUserId === roleEditorUser.id ? "animate-spin" : "hidden"}`}
                />
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Lưu role
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
