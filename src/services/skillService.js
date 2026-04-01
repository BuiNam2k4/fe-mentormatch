import api from './api';

const getAllPublicSkills = async () => {
  const response = await api.get('/public/skills');
  return response;
}

export const skillService = {
  getAllPublicSkills
};
