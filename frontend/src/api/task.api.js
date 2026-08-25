import apiClient from "./axios.js";

// Tasks
export const getTasksApi = (projectId) => {
  return apiClient.get(`/tasks/${projectId}`);
};

export const createTaskApi = (projectId, formData) => {
  return apiClient.post(`/tasks/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getTaskByIdApi = (projectId, taskId) => {
  return apiClient.get(`/tasks/${projectId}/task/${taskId}`);
};

export const updateTaskApi = (projectId, taskId, taskData) => {
  return apiClient.put(`/tasks/${projectId}/task/${taskId}`, taskData);
};

export const deleteTaskApi = (projectId, taskId) => {
  return apiClient.delete(`/tasks/${projectId}/task/${taskId}`);
};

// Subtasks
export const createSubtaskApi = (projectId, taskId, title) => {
  return apiClient.post(`/tasks/${projectId}/task/${taskId}/subtasks`, {
    title,
  });
};

export const updateSubtaskApi = (projectId, taskId, subtaskId, subtaskData) => {
  return apiClient.put(
    `/tasks/${projectId}/task/${taskId}/subtasks/${subtaskId}`,
    subtaskData,
  );
};

export const deleteSubtaskApi = (projectId, taskId, subtaskId) => {
  return apiClient.delete(
    `/tasks/${projectId}/task/${taskId}/subtasks/${subtaskId}`,
  );
};
