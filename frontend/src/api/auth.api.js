import apiClient from "./axios.js";

export const registerUserApi = (userData) => {
  return apiClient.post("/auth/register", userData);
};

export const loginUserApi = (credentials) => {
  return apiClient.post("/auth/login", credentials);
};

export const logoutUserApi = () => {
  return apiClient.post("/auth/logout");
};

export const getCurrentUserApi = () => {
  return apiClient.get("/auth/current-user");
};

export const verifyEmailApi = (token) => {
  return apiClient.get(`/auth/verify-email/${token}`);
};

export const resendVerificationEmailApi = () => {
  return apiClient.post("/auth/resend-email-verification");
};

export const forgotPasswordApi = (email) => {
  return apiClient.post("/auth/forgot-password", { email });
};

export const resetPasswordApi = (token, newPassword) => {
  return apiClient.post(`/auth/reset-password/${token}`, { newPassword });
};

export const changePasswordApi = (oldPassword, newPassword) => {
  return apiClient.post("/auth/change-password", { oldPassword, newPassword });
};
