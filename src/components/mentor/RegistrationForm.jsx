import React, { useState, useEffect } from "react"
import { UploadCloud, X, Info, CheckCircle2, ChevronDown, Check } from "lucide-react"
import profileService from "../../services/profileService"
import { skillService } from "../../services/skillService"
export default function RegistrationForm() {
  const [bio, setBio] = useState("")
  const [availableSkills, setAvailableSkills] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [skillSearchTerm, setSkillSearchTerm] = useState("")
  
  const [certificateFiles, setCertificateFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillService.getAllPublicSkills()
        if (res.code === 1000) {
          setAvailableSkills(res.result)
        }
      } catch (err) {
        console.error("Failed to load skills", err)
      }
    }
    fetchSkills()
  }, [])

  const toggleSkill = (skill) => {
    if (selectedSkills.some(s => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const removeSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setCertificateFiles((prev) => [...prev, ...newFiles])
    }
  }
  
  const removeFile = (indexToRemove) => {
    setCertificateFiles(certificateFiles.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (bio.length < 50) {
      setSubmitStatus('error')
      setErrorMessage('Giới thiệu bản thân quá ngắn. Vui lòng nhập tối thiểu 50 ký tự.')
      return;
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formData = new FormData()
      formData.append('bio', bio)
      
      selectedSkills.forEach(skill => {
        formData.append('skillIds', skill.id);
      });

      certificateFiles.forEach((file) => {
        formData.append('certificateFiles', file)
      })

      const res = await profileService.registerMentor(formData)
      if (res.code === 1000) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
        setErrorMessage(res.message || 'Có lỗi xảy ra khi nộp hồ sơ.')
      }
    } catch (error) {
      console.error("Registration error:", error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Không thể kết nối đến máy chủ.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Hồ sơ đã được gửi thành công!</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          Hồ sơ đăng ký Mentor của bạn đang được Ban quản trị phê duyệt. Chúng tôi sẽ phản hồi lại cho bạn trong thời gian sớm nhất, vui lòng quay lại sau!
        </p>
        <button 
          onClick={() => window.location.href = '/feed'}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
        >
          Quay lại Bảng tin
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt Hồ sơ Mentor</h1>
        <p className="text-slate-500 mt-1">Cập nhật thông tin chuyên môn của bạn để thu hút học viên phù hợp.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8 space-y-8">
          
          {submitStatus === 'error' && (
             <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
               {errorMessage}
             </div>
          )}

          {/* Bio Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Giới thiệu bản thân</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Chia sẻ về kinh nghiệm làm việc, phong cách giảng dạy và các dự án tiêu biểu của bạn..."
              className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#372660] resize-y text-slate-700 placeholder:text-slate-400"
            ></textarea>
            <p className="text-xs text-slate-400">Khuyên dùng: Tối thiểu 50 ký tự.</p>
          </div>

          {/* Skills Section */}
          <div className="space-y-3 relative">
            <label className="text-sm font-bold text-slate-700">Kỹ năng chuyên môn</label>
            <div 
              className="w-full min-h-[56px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center cursor-pointer relative focus-within:ring-1 focus-within:ring-[#372660]"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedSkills.map((skill) => (
                <span key={skill.id} className="px-3 py-1.5 bg-[#372660] text-white text-sm font-medium rounded-full flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {skill.name}
                  <button type="button" onClick={() => removeSkill(skill.id)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              <div className="flex-1 min-w-[120px] flex items-center justify-between ml-1 text-sm text-slate-400">
                {selectedSkills.length === 0 ? "Chọn kỹ năng..." : ""}
                <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 flex flex-col overflow-hidden">
                <div className="p-2 border-b border-slate-100 bg-white">
                  <input
                    type="text"
                    placeholder="Tìm kiếm kỹ năng..."
                    value={skillSearchTerm}
                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#372660]"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="overflow-y-auto">
                  {availableSkills.filter(s => s.name.toLowerCase().includes(skillSearchTerm.toLowerCase())).length === 0 ? (
                     <div className="px-4 py-4 text-sm text-slate-500 text-center">Không tìm thấy kỹ năng phù hợp</div>
                  ) : (
                    <div className="py-1">
                      {availableSkills.filter(s => s.name.toLowerCase().includes(skillSearchTerm.toLowerCase())).map(skill => {
                        const isSelected = selectedSkills.some(s => s.id === skill.id)
                        return (
                          <div 
                            key={skill.id}
                            onClick={() => toggleSkill(skill)}
                            className={`px-4 py-2.5 flex items-center justify-between text-sm cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-slate-50/80 font-medium' : ''}`}
                          >
                            <span className={isSelected ? 'text-[#372660]' : 'text-slate-700'}>{skill.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#372660]" />}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Certificates Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Chứng chỉ & Bằng cấp</label>
            
            {certificateFiles.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {certificateFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-sm text-slate-700 font-medium truncate">{file.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="w-full h-[160px] bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-[#372660]/40 transition-colors rounded-xl flex flex-col items-center justify-center cursor-pointer group">
              <input 
                type="file" 
                multiple 
                accept="image/*,.pdf" 
                onChange={handleFileChange}
                className="hidden" 
              />
              <div className="w-12 h-12 bg-[#372660]/10 text-[#372660] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 fill-current opacity-80" />
              </div>
              <p className="text-sm text-slate-600 font-medium mb-1">
                <span className="font-bold text-slate-800">Kéo thả chứng chỉ/Bằng cấp</span> vào đây hoặc click để chọn tệp
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, PDF (tối đa 10MB)</p>
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-200 flex justify-end gap-3">
          <button className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Hủy
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-[#372660] hover:bg-[#2b1d4c] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
               <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
               Đang xử lý...
              </>
            ) : "Nộp hồ sơ"}
          </button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-[#372660]/5 border border-[#372660]/10 rounded-xl p-5 flex gap-4">
        <div className="shrink-0 pt-0.5">
          <div className="w-6 h-6 rounded-full bg-[#372660] text-white flex items-center justify-center">
            <Info className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#372660] mb-1">Tại sao hồ sơ lại quan trọng?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Một hồ sơ đầy đủ giúp chúng tôi kết nối bạn với đúng học viên có nhu cầu. Các chứng chỉ giúp tăng mức độ tin cậy và chuyên nghiệp của bạn lên 40%.
          </p>
        </div>
      </div>
    </div>
  )
}
