import apiClient from "./axios.js";

export const getProjectsApi = () => {
  return apiClient.get("/projects");
};

export const createProjectApi = (projectData) => {
  return apiClient.post("/projects", projectData);
};

export const getProjectByIdApi = (projectId) => {
  return apiClient.get(`/projects/${projectId}`);
};

export const updateProjectApi = (projectId, projectData) => {
  return apiClient.put(`/projects/${projectId}`, projectData);
};

export const deleteProjectApi = (projectId) => {
  return apiClient.delete(`/projects/${projectId}`);
};

export const getProjectMembersApi = (projectId) => {
  return apiClient.get(`/projects/${projectId}/members`);
};

export const addMemberToProjectApi = (projectId, memberData) => {
  return apiClient.post(`/projects/${projectId}/members`, memberData);
};

export const updateMemberRoleApi = (projectId, userId, role) => {
  return apiClient.put(`/projects/${projectId}/members/${userId}`, { role });
};

export const deleteMemberFromProjectApi = (projectId, userId) => {
  return apiClient.delete(`/projects/${projectId}/members/${userId}`);
};
