import axios, { AxiosError } from "axios";

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response && axiosError.response.status === 422) {
      return JSON.stringify(axiosError.response.data.errors);
    } else {
      return (
        "Error: " +
        (axiosError.response?.data.message || "Something went wrong")
      );
    }
  }
  return "An unknown error occurred";
};
