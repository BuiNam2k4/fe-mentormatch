import api from "./api";

const uploadImages = async (files) => {
  const formData = new FormData();
  // If multiple files
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  // Let Axios automatically set the Content-Type with the correct boundary for FormData
  // We must explicitly override to undefined because api.js defaults to application/json
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return response;
};

const createPost = async (content, imageUrls = []) => {
  const response = await api.post("/posts", {
    content,
    imageUrls,
  });
  return response;
};

const getAllPosts = async () => {
  const response = await api.get("/posts");
  return response;
};

const getMyPosts = async () => {
  const response = await api.get("/posts/me");
  return response;
};

const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response;
};

const updatePost = async (id, content, imageUrls = []) => {
  const response = await api.put(`/posts/${id}`, {
    content,
    imageUrls,
  });
  return response;
};

const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response;
};

export const postService = {
  uploadImages,
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
