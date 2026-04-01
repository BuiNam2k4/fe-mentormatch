import api from './api';

export const uploadService = {
  /**
   * Upload multiple files to Cloudinary via backend API
   * @param {File[]} files - Array of File objects to upload
   * @returns {Promise<Object>} API response with uploaded URLs in `result`
   */
  uploadFiles: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Convenience method to upload a single file
   * @param {File} file - File object to upload
   * @returns {Promise<string>} URL of the uploaded file
   */
  uploadSingleFile: async (file) => {
    const res = await uploadService.uploadFiles([file]);
    if (res.code === 1000 && res.result && res.result.length > 0) {
      return res.result[0];
    }
    throw new Error(res.message || 'Lỗi tải file');
  }
};

export default uploadService;
