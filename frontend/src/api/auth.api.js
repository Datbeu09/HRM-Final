// src/api/auth.api.js
import axiosClient from "./axiosClient";

export const login = async (username, password) => {
  try {
    const response = await axiosClient.post("/auth/login", { username, password });

    if (!response.data?.success || !response.data?.data?.token) {
      throw new Error(response.data?.message || "Không nhận được token từ API");
    }

    return {
      token: response.data.data.token,
      user: response.data.data.user,
    };
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Đăng nhập thất bại";

    console.error("Error during login:", error);
    throw new Error(msg);
  }
};
