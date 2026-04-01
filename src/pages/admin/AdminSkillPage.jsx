import React, { useState, useEffect } from 'react';
import adminSkillService from '../../services/adminSkillService';
import { Plus, Edit2, Trash2, X, Check, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';

export default function AdminSkillPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await adminSkillService.getAllSkills();
      if (res.code === 1000) {
        setSkills(res.result);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Không thể tải danh sách kỹ năng' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill = null) => {
    setEditingSkill(skill);
    setSkillForm({ name: skill ? skill.name : '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setSkillForm({ name: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        const res = await adminSkillService.updateSkill(editingSkill.id, skillForm);
        if (res.code === 1000) {
          setMessage({ type: 'success', text: 'Cập nhật kỹ năng thành công' });
        }
      } else {
        const res = await adminSkillService.createSkill(skillForm);
        if (res.code === 1000) {
          setMessage({ type: 'success', text: 'Thêm kỹ năng thành công' });
        }
      }
      fetchSkills();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kỹ năng này?')) return;
    try {
      const res = await adminSkillService.deleteSkill(id);
      if (res.code === 1000) {
        setMessage({ type: 'success', text: 'Xóa kỹ năng thành công' });
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Không thể xóa kỹ năng đang được sử dụng' });
    }
  };

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý kỹ năng</h1>
          <p className="text-slate-500">Thêm, sửa, xóa các kỹ năng chuyên môn trên hệ thống</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#372660] hover:bg-[#2b1d4c] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-semibold shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Thêm kỹ năng
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Tìm kiếm kỹ năng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Tên kỹ năng</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-400">Đang tải...</td>
                </tr>
              ) : filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-400">Không tìm thấy kỹ năng nào</td>
                </tr>
              ) : (
                filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">#{skill.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{skill.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(skill)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(skill.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingSkill ? 'Cập nhật kỹ năng' : 'Thêm kỹ năng mới'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tên kỹ năng (*)</label>
                <Input 
                  required
                  placeholder="VD: Java, React, Figma..."
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="bg-slate-50"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#372660] text-white font-bold rounded-xl hover:bg-[#2b1d4c] transition-all"
                >
                  {editingSkill ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
