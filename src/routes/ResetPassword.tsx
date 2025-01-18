import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { handleApiError } from "../utils/apiErrorHandler";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const emailFromURL = searchParams.get("email");
    if (emailFromURL) {
      setEmail(emailFromURL);
    }

    const tokenFromURL = location.pathname
      .split("/password-reset/")[1]
      ?.split("?")[0];
    if (tokenFromURL) {
      setToken(tokenFromURL);
    }
  }, [location, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/reset-password`, {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      console.log(response);

      if (response.data.success) {
        setMessage("Password reset successfully.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setMessage("Error resetting password.");
      }
    } catch (error) {
      setMessage(handleApiError(error));
    } finally {
      setLoading(false);
      setTimestamp(Date.now());
    }
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Reset Password
          </h2>
          <form
            id="insured-reset-pass"
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit}
          >
            <input
              id="username"
              type="hidden"
              name="username"
              value={email}
              autoComplete="username"
            />
            <PasswordStrengthChecker
              name="password"
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
                type={showPassword ? "text" : "password"}
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
                onClick={handleTogglePassword}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-tussock-500 hover:bg-tussock-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              disabled={loading}
            >
              {loading ? "Loading..." : "Reset password"}
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

export default ResetPassword;
