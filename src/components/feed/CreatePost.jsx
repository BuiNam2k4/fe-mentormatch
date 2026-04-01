import React, { useState, useRef } from "react";
import { Image, Video, X, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
          Bạn có câu hỏi hay muốn mở lớp?
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Vui lòng đăng nhập để đăng bài viết và tương tác với cộng đồng.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#372660] hover:bg-[#2b1d4c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Bài viết không được để trống!");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let imageUrls = [];
      // 1. Upload files if any
      if (files.length > 0) {
        const uploadRes = await postService.uploadImages(files);
        if (uploadRes.code === 1000) {
          imageUrls = uploadRes.result;
        } else {
          throw new Error("Tải ảnh thất bại");
        }
      }

      // 2. Create Post
      const postRes = await postService.createPost(content, imageUrls);
      if (postRes.code === 1000) {
        // Reset form
        setContent("");
        setFiles([]);
        // Notify parent
        if (onPostCreated) {
          onPostCreated(postRes.result);
        }
      } else {
        throw new Error(postRes.message || "Tạo bài thất bại");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 relative">
      <div className="flex gap-4">
        <img
          src={
            user?.avatar || "https://ui-avatars.com/api/?name=" + user?.userName
          }
          alt="Avatar"
          onClick={() => navigate("/me")}
          className="w-10 h-10 rounded-full object-cover shrink-0 cursor-pointer hover:ring-2 hover:ring-[#372660]/30 transition-all"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            placeholder="Bạn đang tìm khóa học hay muốn mở lớp?"
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 resize-none h-24 disabled:opacity-50 placeholder:text-slate-400"
          ></textarea>
        </div>
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div className="flex gap-3 mt-3 pl-14 overflow-x-auto pb-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative shrink-0">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={() => removeFile(idx)}
                disabled={isSubmitting}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-red-500 disabled:opacity-50"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="mt-2 pl-14 text-red-500 text-sm">{error}</div>}

      <div className="flex items-center justify-between mt-4 pl-14">
        <div className="flex gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            <Image className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Ảnh</span>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="bg-[#372660] hover:bg-[#2b1d4c] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Đăng bài
        </button>
      </div>
    </div>
  );
}
