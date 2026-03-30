import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Login.css";
import { ClipLoader } from "react-spinners";
import BASE_URL from "../config";
import { handleApiError } from "../utils/apiErrorHandler";

interface LoginProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
}

// Definimos los tipos para los estados
interface LoginFormState {
  username: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  // Estado para los campos de entrada (usuario y contraseña)
  const [formData, setFormData] = useState<LoginFormState>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Manejador del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email: string = formData.username;
    const password: string = formData.password;

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
        email,
        password,
      });
      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("email", email);
      sessionStorage.setItem("logged_user", "true");
      setIsLoggedIn(true);
      navigate("/cases", { state: { email } });
    } catch (err) {
      //console.log(err);
      setErrorMessage(handleApiError(err));
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de cambio en los campos de formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 text-black ">
      <div className="login-container w-full max-w-md bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-2xl p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm block">
          <h2 className="text-2xl font-bold text-black mb-8">
            Home Owners' Area Login
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Please enter your registered email"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    onClick={() => navigate("/forget-password")}
                    className="text-xs text-black hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7C3.732 7.943 7.523 5 12 5c.95 0 1.865.134 2.738.384M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 15.232L20.485 20.485"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="h-3">
                {showError && <span className="error">{errorMessage}</span>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-amber-400 font-semibold py-3 rounded-lg transition-colors shadow-lg"
              >
                Sign in
              </button>
            </div>
          </form>
          {loading && (
            <div className="flex justify-center mt-4">
              <ClipLoader size={35} color={"#000000"} loading={loading} />
            </div>
          )}
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-black">
            Don't have an account?
            <a
              onClick={() => navigate("/register")}
              className="font-semibold hover:underline cursor-pointer"
            >
              Register
            </a>
          </p>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
export default Login;
