import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Camera, CheckCircle } from "lucide-react"
import { Input } from "../ui/input"
import profileService from "../../services/profileService"

export default function BasicInfoForm({ profile, onUpdate }) {
  const { user, updateAuthUser } = useAuth()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    avatarFile: null
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.fullName || profile.userName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar: profile.avatarUrl || `https://i.pravatar.cc/150?u=${profile.userName}`
      })
    }
  }, [profile])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        avatar: URL.createObjectURL(file), // Local preview url
        avatarFile: file // Actual File object
      })
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      let currentAvatarUrl = formData.avatar

      // Upload avatar if a new file was selected
      if (formData.avatarFile) {
        const avatarRes = await profileService.updateAvatar(formData.avatarFile)
        if (avatarRes.code === 1000) {
          currentAvatarUrl = avatarRes.result // The new cloud URL
          // Update the global context so Navbar avatar changes instantly
          if (updateAuthUser) {
             updateAuthUser({ avatar: currentAvatarUrl })
          }
        } else {
           setMessage({ type: 'error', text: avatarRes.message || 'Tải ảnh lên thất bại' })
           setIsSaving(false)
           return
        }
      }

      const result = await profileService.updateBasicProfile({
        fullName: formData.name,
        phone: formData.phone,
        avatarUrl: currentAvatarUrl
      })
      if (result.code === 1000) {
        setMessage({ type: 'success', text: 'Cập nhật thông tin cơ bản thành công!' })
        if (onUpdate) onUpdate()
      } else {
        setMessage({ type: 'error', text: result.message || 'Cập nhật thất bại' })
      }
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Lỗi máy chủ khi cập nhật thông tin' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
        Thông tin Cơ bản
      </h3>

      {message && (
        <div className={`mb-6 p-3 text-sm rounded-lg font-medium border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img 
              src={formData.avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
          </div>
          <span onClick={() => fileInputRef.current?.click()} className="text-xs font-semibold text-[#372660] cursor-pointer hover:underline">Thay đổi ảnh</span>
        </div>

        <form onSubmit={handleSave} className="flex-1 w-full space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Họ và Tên (*)</label>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200 focus-visible:ring-[#372660]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Số điện thoại</label>
              <Input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200 focus-visible:ring-[#372660]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              Email
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Kiểm tra
              </span>
            </label>
            <Input 
              name="email"
              value={formData.email}
              disabled
              className="bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">Để thay đổi email, vui lòng liên hệ CSKH.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="bg-[#372660] hover:bg-[#2b1d4c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
