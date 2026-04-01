import React, { useState, useEffect } from "react"
import api from "../../services/api"

export default function FilterSidebar({ onSkillClick }) {
  const [skills, setSkills] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/public/skills')
        if (res.code === 1000) {
          setSkills(res.result || [])
        }
      } catch (err) {
        console.error("Failed to load skills", err)
      }
    }
    fetchSkills()
  }, [])

  const handleSkillToggle = (skillName) => {
    const isSelected = selectedSkills.includes(skillName)
    if (isSelected) {
      setSelectedSkills(prev => prev.filter(s => s !== skillName))
    } else {
      setSelectedSkills(prev => [...prev, skillName])
    }
    if (onSkillClick) {
      onSkillClick(isSelected ? "" : skillName)
    }
  }

  const handleClearAll = () => {
    setSelectedSkills([])
    if (onSkillClick) onSkillClick("")
  }

  return (
    <div className="w-64 shrink-0 hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 p-5 sticky top-24 self-start">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#372660]">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <h3 className="font-bold text-slate-800">Bộ lọc nâng cao</h3>
        </div>
        <button onClick={handleClearAll} className="text-xs text-slate-500 hover:text-[#372660]">Xóa tất cả</button>
      </div>

      {/* Skills Filter */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Kỹ Năng</h4>
        <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
          {skills.length === 0 ? (
            <p className="text-xs text-slate-400">Đang tải kỹ năng...</p>
          ) : (
            skills.map((skill) => (
              <label key={skill.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-4 h-4 rounded border border-slate-300 checked:bg-[#372660] checked:border-[#372660] cursor-pointer transition-colors"
                    checked={selectedSkills.includes(skill.name)}
                    onChange={() => handleSkillToggle(skill.name)}
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm text-slate-700 group-hover:text-slate-900">{skill.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Đánh Giá</h4>
        <div className="space-y-2.5">
          {[4.0, 5.0].map((rating, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="rating"
                  className="peer appearance-none w-4 h-4 rounded-full border border-slate-300 checked:border-[#372660] cursor-pointer transition-colors"
                  defaultChecked={index === 0}
                />
                <div className="absolute w-2 h-2 rounded-full bg-[#372660] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
              </div>
              <span className="text-sm text-slate-700 group-hover:text-slate-900 flex items-center gap-1.5">
                {rating.toFixed(1)}+ 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#EAB308" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Trạng Thái</h4>
        <div className="space-y-2.5">
          {["Đang online", "Lịch trống tuần này"].map((status, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="peer appearance-none w-4 h-4 rounded border border-slate-300 checked:bg-[#372660] checked:border-[#372660] cursor-pointer transition-colors"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm text-slate-700 group-hover:text-slate-900">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
