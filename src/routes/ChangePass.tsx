import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { handleApiError } from "../utils/apiErrorHandler";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { Eye, EyeOff, ArrowLeft, Home, ChevronRight } from "lucide-react";

const ChangePass: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const email = localStorage.getItem("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${BASE_URL}/api/change-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setMessage("Password changed successfully");
        setMessageType("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage("Error changing password");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(handleApiError(error));
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimestamp(Date.now());
    }
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
  };

  const handleCasesClick = () => {
    navigate("/cases");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex flex-col">
      {/* Breadcrumbs */}
      {/*     <div className="flex items-center gap-2 text-sm px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={handleCasesClick}
          className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">Change Password</span>
      </div> */}

      {/* Centered form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={handleCasesClick}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </button>

          {/* Card */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-2xl p-8">
            {/* Card header strip */}

            <h2 className="text-2xl font-bold text-black mb-4">
              Change Password
            </h2>
            {/*  <p className="text-black/60 text-sm mt-1">
                Update your account credentials below
              </p> */}

            {/* Card body */}
            <div className="p-2">
              <form
                id="insured-change-pass"
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                {/* Hidden username for password managers */}
                <input
                  id="username"
                  type="hidden"
                  name="username"
                  value={email || ""}
                  autoComplete="username"
                />

                {/* Current Password */}
                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="current-password"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black pr-12"
                      placeholder="Enter current password"
                      required
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      value={currentPassword}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password — keeps PasswordStrengthChecker */}
                <PasswordStrengthChecker
                  name="new_password"
                  onPasswordChange={handlePasswordChange}
                />

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword2 ? "text" : "password"}
                      id="confirm_password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="confirm-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword2 ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-900 text-amber-400 font-semibold py-3 rounded-lg transition-colors shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </form>

              {/* Feedback message */}
              {message && (
                <div
                  key={timestamp}
                  className={`mt-5 px-4 py-3 rounded-lg text-sm text-center font-medium ${
                    messageType === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
