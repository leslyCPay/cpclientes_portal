import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import Modal from "react-modal";
import ModalOTP from "../components/ModalOTP";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { handleApiError } from "../utils/apiErrorHandler";

Modal.setAppElement("#root");

const Register: React.FC = () => {
  const initialFormData = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password: password });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    /* setOtpSent(true);
    setModalMessage("OTP has been sent to your email.");
    setModalIsOpen(true); */

    try {
      const response = await axios.post(
        `${BASE_URL}/api/validate-user`,
        formData
      );

      if (response.data == "otp.sent") {
        setOtpSent(true);
        const text = `To complete the registration process, an OTP has been sent to ${formData.email} , please input it here:`;
        setModalMessage(text);
      } else {
        setModalMessage("Email is not registered in our Database.");
      }

      setModalIsOpen(true);
    } catch (error) {
      //setErrorMessage("Email is not registered in our Database.");
      setErrorMessage(handleApiError(error));
      setFormData(initialFormData);
    } finally {
      setLoading(false);
    }
  };

  const handleTimesUp = () => {
    setErrorMessage("OTP expired. Please request a new one.");
    setOtpSent(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData(initialFormData);
    if (modalMessage === "Email is not registered in our Database.") {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!modalIsOpen) {
      closeModal();
    }
  }, [modalIsOpen]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex-col items-center justify-center px-6 py-8 mx-auto ml:h-screen lg:py-0 block">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 m-auto">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div>
                <label
                  htmlFor="first-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  id="first-name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="John"
                  required
                  autoComplete="firstname"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  id="last-name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 autocomplete"
                  placeholder="Doe"
                  required
                  autoComplete="lastname"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="+1896523648"
                  required
                  autoComplete="phone"
                  onChange={handleChange}
                />
              </div>

              {/* <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  autoComplete="password"
                  onChange={handleChange}
                />
              </div> */}
              <PasswordStrengthChecker
                name="password"
                onPasswordChange={handlePasswordChange}
              />
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  autoComplete="password"
                  onChange={handleChange}
                />
              </div>
              {/* <div className="flex items-start">
                                <div className="flex items-center h-5">}
                                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                </div>
                            </div> */}

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                className="w-full text-white bg-tussock-500 hover:bg-black-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? "Loading..." : "Create an account"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <a
                  onClick={() => navigate("/login")}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ModalOTP
        isOpen={modalIsOpen}
        message={modalMessage}
        otpSent={otpSent}
        onClose={closeModal}
        handleTimesUp={handleTimesUp}
        email={formData.email}
      />
    </section>
  );
};
export default Register;
