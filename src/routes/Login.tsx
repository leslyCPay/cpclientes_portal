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

interface LoginFormState {
  username: string;
  password: string;
}

type Step = "credentials" | "otp";

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState<LoginFormState>({
    username: "",
    password: "",
  });
  const [otp, setOtp] = useState<string>("");
  const [step, setStep] = useState<Step>("credentials");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const navigate = useNavigate();

  const showErr = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  // Step 1: validate credentials → request OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/login/request-otp`, {
        email: formData.username,
        password: formData.password,
      });
      setStep("otp");
      startCooldown();
    } catch (err) {
      showErr(handleApiError(err));
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP → get token
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/login/verify-otp`, {
        email: formData.username,
        otp,
      });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("email", formData.username);
      sessionStorage.setItem("logged_user", "true");
      setIsLoggedIn(true);
      navigate("/cases", { state: { email: formData.username } });
    } catch (err) {
      showErr(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/login/request-otp`, {
        email: formData.username,
        password: formData.password,
      });
      startCooldown();
    } catch (err) {
      showErr(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
  };

  return (
    <div className="login flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 text-black">
      <div className="login-container w-full max-w-md bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl shadow-2xl p-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm block">
          <h2 className="text-2xl font-bold text-black mb-8">
            Home Owners' Area Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* ── STEP 1: Credentials ── */}
          {step === "credentials" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Email address
                </label>
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

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <a
                    onClick={() => navigate("/forget-password")}
                    className="text-xs text-black hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </a>
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
                    onClick={() => setShowPassword(!showPassword)}
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

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-amber-400 font-semibold py-3 rounded-lg transition-colors shadow-lg"
              >
                Continue
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-black font-medium">
                  Check your email
                </p>
                <p className="text-xs text-black/70 mt-1">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold">{formData.username}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-center text-xl tracking-[0.5em] font-mono"
                />
                <div className="h-3">
                  {showError && <span className="error">{errorMessage}</span>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-amber-400 font-semibold py-3 rounded-lg transition-colors shadow-lg"
              >
                Verify & Sign in
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="text-black/70 hover:text-black underline"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-black font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend code"}
                </button>
              </div>
            </form>
          )}

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
