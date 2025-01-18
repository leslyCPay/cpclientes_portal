import axios, { AxiosError } from "axios";

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    // Characters to remove
    let charsToRemove: string = '{}[]"';

    function escapeRegExp(string: string): string {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // Function to remove specific characters from a string
    function removeChars(str: string, chars: string): string {
      let escapedChars = escapeRegExp(chars);
      let regex = new RegExp(`[${escapedChars}]`, "g");
      return str.replace(regex, "");
    }

    if (axiosError.response && axiosError.response.status === 422) {
      let result = removeChars(
        JSON.stringify(axiosError.response.data.errors),
        charsToRemove
      );
      console.log(result);
      return result;
    } else {
      return (
        "Error: " +
        (axiosError.response?.data.message || "Something went wrong")
      );
    }
  }
  return "An unknown error occurred";
};
