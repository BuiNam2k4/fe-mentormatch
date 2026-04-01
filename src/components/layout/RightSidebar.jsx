import React, { useState, useEffect } from "react"
import { Star, UserCheck } from "lucide-react"
import { MOCK_TAGS } from "../../data/mockData"
import followService from "../../services/followService"

export default function RightSidebar() {
  const [following, setFollowing] = useState([])

  useEffect(() => {
    fetchFollowing()

    const handleFollowChange = () => {
      fetchFollowing()
    }

    window.addEventListener('followStatusChanged', handleFollowChange)

    return () => {
      window.removeEventListener('followStatusChanged', handleFollowChange)
    }
  }, [])

  const fetchFollowing = async () => {
    try {
      const res = await followService.getFollowing()
      if (res && res.code === 1000) {
        setFollowing(res.result || [])
      }
    } catch (err) {
      console.error("Failed to load following list", err)
    }
  }

  return (
    <div className="w-80 shrink-0 hidden lg:block space-y-6 sticky top-24">
      {/* Following List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#372660]" />
            Đang theo dõi
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full">
            {following.length}
          </span>
        </div>
        
        <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
          {following.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              Bạn chưa theo dõi ai.
            </p>
          ) : (
            following.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <img 
                  src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.userName)}`} 
                  alt={user.fullName} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.fullName || user.userName}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    @{user.userName}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Suggested Topics */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Chủ đề quan tâm</h3>
        <div className="flex flex-wrap gap-2">
          {MOCK_TAGS.map((tag) => (
            <a 
              key={tag} 
              href="#" 
              className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>

      {/* Mini Footer */}
      <div className="text-center space-y-3 pt-2">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600">Điều khoản</a>
          <a href="#" className="hover:text-slate-600">Bảo mật</a>
          <a href="#" className="hover:text-slate-600">Liên hệ</a>
        </div>
        <p className="text-[11px] text-slate-400">© 2024 MentorMatch Vietnam</p>
      </div>
    </div>
  )
}
