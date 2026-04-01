import React, { useState, useEffect, useCallback } from "react"
import FilterSidebar from "../components/search/FilterSidebar"
import MentorListHeader from "../components/search/MentorListHeader"
import MentorSearchResultCard from "../components/search/MentorSearchResultCard"
import Pagination from "../components/search/Pagination"
import { userService } from "../services/userService"
import { Loader2, Search } from "lucide-react"

export default function FindMentorPage() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [debouncedKeyword, setDebouncedKeyword] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchKeyword])

  useEffect(() => {
    fetchMentors(debouncedKeyword)
  }, [debouncedKeyword])

  const fetchMentors = async (keyword) => {
    try {
      setLoading(true)
      const res = keyword
        ? await userService.searchMentors(keyword)
        : await userService.getMentors()

      if (res.code === 1000) {
        // Map backend UserProfileResponse to match MentorSearchResultCard props
        const mappedMentors = (res.result || []).map(user => ({
          id: user.id,
          name: user.fullName || user.userName,
          avatar: user.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName || user.userName),
          role: user.mentorProfile?.title || "Chuyên gia / Mentor",
          price: null, // Will be filled after fetching time slots
          rating: user.mentorProfile?.rating || 0,
          students: user.mentorProfile?.totalStudents || 0,
          yearOfExp: user.mentorProfile?.yearsOfExperience,
          tags: user.mentorProfile?.skills?.length > 0 ? user.mentorProfile.skills : ["Chưa cập nhật kỹ năng"],
          description: user.mentorProfile?.bio || "Chưa cập nhật thông tin giới thiệu.",
          responseTime: "Phản hồi trong 2h", // Placeholder
          availability: "Sẵn sàng", // Placeholder
          isOnline: user.isActive,
          isVerified: user.mentorProfile?.isVerified || false
        }))

        // Fetch time slots for each mentor in parallel to calculate average price
        const slotsPromises = mappedMentors.map(m =>
          userService.getMentorTimeSlots(m.id).catch(() => ({ code: 0, result: [] }))
        )
        const slotsResults = await Promise.all(slotsPromises)

        slotsResults.forEach((slotRes, index) => {
          if (slotRes.code === 1000 && slotRes.result && slotRes.result.length > 0) {
            const totalPrice = slotRes.result.reduce((sum, slot) => sum + (slot.price || 0), 0)
            const avgPrice = Math.round(totalPrice / slotRes.result.length)
            mappedMentors[index].price = avgPrice.toLocaleString('vi-VN') + 'đ'
          } else {
            mappedMentors[index].price = 'Liên hệ'
          }
        })

        setMentors(mappedMentors)
      }
    } catch (err) {
      console.error("Failed to load mentors", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSkillFilter = (skill) => {
    setSearchKeyword(skill)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="max-w-[1400px] mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên mentor, kỹ năng, công nghệ..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#372660] focus:border-[#372660] shadow-sm transition-all"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
            >
              Xóa
            </button>
          )}
        </div>
        {debouncedKeyword && (
          <p className="text-xs text-slate-500 mt-2 ml-1">
            Kết quả tìm kiếm cho: <span className="font-bold text-[#372660]">"{debouncedKeyword}"</span>
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-[1400px] mx-auto">
        
        {/* Left Sidebar - Filters */}
        <FilterSidebar onSkillClick={handleSkillFilter} />
        
        {/* Main Search Results Area */}
        <div className="flex-1 min-w-0">
          <MentorListHeader totalResults={mentors.length} />
          
          <div className="space-y-6">
            {loading ? (
               <div className="flex justify-center p-12">
                 <Loader2 className="w-8 h-8 animate-spin text-[#372660]" />
               </div>
            ) : mentors.length === 0 ? (
               <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm">
                 {debouncedKeyword 
                   ? `Không tìm thấy Mentor nào với từ khóa "${debouncedKeyword}"`
                   : "Không tìm thấy Mentor nào"}
               </div>
            ) : (
              mentors.map((mentor) => (
                <MentorSearchResultCard key={mentor.id} mentor={mentor} />
              ))
            )}
          </div>

          {!loading && mentors.length > 0 && <Pagination />}
        </div>
        
      </div>
    </div>
  )
}
