import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface PasswordStrengthCheckerProps {
  name: string;
  onPasswordChange: (password: string) => void;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({
  onPasswordChange,
  name,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    onPasswordChange(pwd);

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

    const isStrongPassword = strongPasswordRegex.test(pwd);
    setErrorMessage(isStrongPassword ? "Strong Password" : "Weak Password");
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full">
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          New Password:
        </label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            className="ml-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-600"
            type="button"
            onClick={handleTogglePassword}
          >
            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </button>
        </div>
      </div>
      <div className="mb-4">
        <ul>
          <li>
            <i
              className={`fas ${
                password.length >= 7
                  ? "fa-check text-green-500"
                  : "fa-times text-red-500"
              }`}
            ></i>
            Minimum 7 characters
          </li>
          <li>
            <i
              className={`fas ${
                /[A-Z]/.test(password)
                  ? "fa-check text-green-500"
                  : "fa-times text-red-500"
              }`}
            ></i>
            At least one uppercase letter
          </li>
          <li>
            <i
              className={`fas ${
                /[a-z]/.test(password)
                  ? "fa-check text-green-500"
                  : "fa-times text-red-500"
              }`}
            ></i>
            At least one lowercase letter
          </li>
          <li>
            {" "}
            <i
              className={`fas ${
                /[0-9]/.test(password)
                  ? "fa-check text-green-500"
                  : "fa-times text-red-500"
              }`}
            ></i>{" "}
            At least one number (0-9){" "}
          </li>
          <li>
            <i
              className={`fas ${
                /[@$!%*?&]/.test(password)
                  ? "fa-check text-green-500"
                  : "fa-times text-red-500"
              }`}
            ></i>
            At least one symbol (@$!%*?&)
          </li>
        </ul>
      </div>
      <span
        className={`font-semibold ${
          errorMessage === "Strong Password" ? "text-green-500" : "text-red-500"
        }`}
      >
        {errorMessage}
      </span>
    </div>
  );
};

export default PasswordStrengthChecker;
