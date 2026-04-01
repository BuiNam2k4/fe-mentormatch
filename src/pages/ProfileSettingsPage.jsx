import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import SettingsSidebar from "../components/profile/SettingsSidebar"
import BasicInfoForm from "../components/profile/BasicInfoForm"
import MentorSettingsForm from "../components/profile/MentorSettingsForm"
import MenteeSettingsForm from "../components/profile/MenteeSettingsForm"
import profileService from "../services/profileService"

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Protect route
  useEffect(() => {
    if (!user && !localStorage.getItem('mentormatch_user')) {
      navigate('/login')
    } else {
      fetchProfile()
    }
  }, [user, navigate])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const res = await profileService.getProfile()
      if (res.code === 1000) {
        setProfileData(res.result)
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu cấu hình:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh data handler after saving forms
  const handleProfileUpdate = () => {
    fetchProfile()
  }

  if (!user || isLoading) return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-[#372660] border-t-transparent rounded-full animate-spin"></div>
     </div>
  ); // Prevent flash / loading state

  const isMentor = user.role === "mentor" || profileData?.roles?.includes("ROLE_MENTOR")

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin tài khoản và sở thích của bạn.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 w-full min-w-0">
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <BasicInfoForm profile={profileData} onUpdate={handleProfileUpdate} />
              {isMentor && (
                 <MentorSettingsForm profile={profileData} onUpdate={handleProfileUpdate} />
              )}
              <MenteeSettingsForm profile={profileData} onUpdate={handleProfileUpdate} />
            </div>
          )}
          
          {activeTab !== "profile" && (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-100 shadow-sm animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Tính năng đang phát triển</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Khu vực cài đặt này hiện đang được hoàn thiện. Vui lòng quay lại sau!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
