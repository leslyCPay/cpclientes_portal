import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { handleApiError } from "../utils/apiErrorHandler";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";

const ChangePass: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
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
        }
      );

      if (response.data.success) {
        setMessage("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage("Error changing password");
      }
    } catch (error) {
      setMessage(handleApiError(error));
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

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTogglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="cp-breadcrumbs">
        <nav
          className="flex bg-gray-50 text-tussock-600 border border-gray-200 py-3 px-5  dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                onClick={handleCasesClick}
                className="text-sm text-tussock-600 hover:text-tussock-900 inline-flex items-center dark:text-gray-400 dark:hover:text-white"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </a>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-tussock-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-tussock-400 ml-1 md:ml-2 text-sm font-medium dark:text-gray-500">
                  Change Password
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Change Password
          </h2>
          <form
            id="insured-change-pass"
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit}
          >
            <input
              id="username"
              type="hidden"
              name="username"
              value={email || ""}
              autoComplete="username"
            />
            <div className="relative">
              <label
                htmlFor="current-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="current-password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="••••••••"
                required
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                autoComplete="current-password"
              />
              <button
                className="absolute bottom-[3px] right-3 flex items-center text-sm  px-0 text-gray-600 bg-gray-50 border-right border-gray-300"
                type="button"
                onClick={handleTogglePassword}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            <PasswordStrengthChecker
              name="new_password"
              onPasswordChange={handlePasswordChange}
            />
            <div className="relative">
              <label
                htmlFor="confirm_password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                type={showPassword2 ? "text" : "password"}
                id="confirm_password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="confirm-password"
              />
              <button
                className="absolute bottom-[3px] right-3 flex items-center text-sm  px-0 text-gray-600 bg-gray-50 border-right border-gray-300"
                type="button"
                onClick={handleTogglePassword2}
              >
                <i
                  className={`fas ${showPassword2 ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-tussock-500 hover:bg-tussock-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              disabled={loading}
            >
              {loading ? "Loading..." : "Change Password"}
            </button>
          </form>
          {message && (
            <span
              key={timestamp}
              className="error text-md mt-5 block text-center"
            >
              {message}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
export default ChangePass;
