import React, { useState, useEffect, useRef } from "react";
import CountdownTimer from "./CountdownTimer";
import CloseButton from "./CloseButton";
import axios from "axios";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

interface ModalOTPProps {
  isOpen: boolean;
  message: string;
  otpSent: boolean;
  onClose: () => void;
  handleTimesUp: () => void;
  email: string;
}

const ModalOTP: React.FC<ModalOTPProps> = ({
  isOpen,
  message,
  otpSent,
  onClose,
  handleTimesUp,
  email,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string>("");
  const [otpResponse, setOtpResponse] = useState<string | null>(null);
  const [showRedirectButton, setShowRedirectButton] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const isEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/otp/verify`, {
        email,
        code: otp,
      });

      const result = response.data.user;

      if (!isEmpty(result)) {
        setOtpResponse("Registration successful!");
        setShowRedirectButton(true);
      } else {
        setOtpResponse("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpResponse("An error occurred. Please try again.");
    }
  };

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    //isOpen={isOpen} onRequestClose={onClose}
    <>
      {otpSent && isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div ref={modalRef} className="bg-white p-8 rounded w-96 text-center">
            <CloseButton onClick={onClose} />

            {otpResponse ? (
              <div className="pt-4">
                <p>{otpResponse}</p>
                {showRedirectButton && (
                  <button
                    className="mt-4 bg-tussock-500 hover:bg-tussock-700 text-white py-2 px-4 rounded"
                    onClick={handleRedirect}
                  >
                    Go to Login
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-lg text-gray-900 dark:text-white text-left">
                  {message}{" "}
                </p>
                <div className="pt-4">
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter OTP"
                    required
                    onChange={handleOtpChange}
                    maxLength={4}
                  />
                  <CountdownTimer
                    initialSeconds={180}
                    onTimesUp={handleTimesUp}
                  />
                  <button
                    className="mt-4 bg-tussock-500 hover:bg-tussock-700 text-white py-2 px-4 rounded"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOTP;
