import React, { useState, useEffect } from 'react';
import { GraduationCap, Target, Sparkles, Save, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import profileService from '../../services/profileService';

export default function MenteeSettingsForm({ profile, onUpdate }) {
  const [form, setForm] = useState({
    currentEducation: '',
    learningGoals: '',
    interests: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile?.menteeProfile) {
      setForm({
        currentEducation: profile.menteeProfile.currentEducation || '',
        learningGoals: profile.menteeProfile.learningGoals || '',
        interests: profile.menteeProfile.interests || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await profileService.updateMenteeProfile(form);
      if (res.code === 1000) {
        setMessage({ type: 'success', text: 'Cập nhật hồ sơ học viên thành công!' });
        onUpdate?.();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Có lỗi xảy ra khi lưu' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-6 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Hồ sơ Học viên</h2>
            <p className="text-xs text-slate-500 mt-0.5">Cập nhật thông tin để Mentor hiểu bạn hơn</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {message && (
          <div className={`p-3 rounded-xl text-sm font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Current Education */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            Trình độ học vấn hiện tại
          </label>
          <Input
            placeholder="VD: Sinh viên năm 3 - Đại học Bách Khoa TPHCM, ngành CNTT"
            value={form.currentEducation}
            onChange={(e) => setForm({ ...form, currentEducation: e.target.value })}
            className="bg-slate-50"
          />
          <p className="text-[10px] text-slate-400">Trường, ngành học, năm học hiện tại của bạn</p>
        </div>

        {/* Learning Goals */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            Mục tiêu học tập
          </label>
          <textarea
            rows={3}
            placeholder="VD: Muốn học thêm về System Design, chuẩn bị phỏng vấn Senior Backend..."
            value={form.learningGoals}
            onChange={(e) => setForm({ ...form, learningGoals: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#372660] resize-none"
          />
          <p className="text-[10px] text-slate-400">Mô tả mục tiêu cụ thể giúp Mentor đưa ra lời khuyên phù hợp hơn</p>
        </div>

        {/* Interests */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            Sở thích / Lĩnh vực quan tâm
          </label>
          <Input
            placeholder="VD: Web Development, AI/ML, Mobile Apps, DevOps..."
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            className="bg-slate-50"
          />
          <p className="text-[10px] text-slate-400">Các lĩnh vực công nghệ hoặc kỹ năng bạn muốn phát triển</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#372660] text-white text-sm font-bold rounded-xl hover:bg-[#2b1d4c] transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang lưu...' : 'Lưu hồ sơ học viên'}
          </button>
        </div>
      </div>
    </div>
  );
}
