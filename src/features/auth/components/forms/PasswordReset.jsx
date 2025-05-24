import { useEffect, useRef, useState } from "react";
import { isEmailValid } from "src/utils/form";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import Alert from "../alerts/Alert";
import { useAuthContext } from "../../context/AuthContext";

export default function PasswordReset({ isModalOpen, setSuccess }) {
  const { checkIfEmailExists, resetPassword } = useAuthContext();
  const { theme } = useThemeContext();

  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    handleModal();
  }, [isModalOpen]);

  const handleModal = () => {
    if (isModalOpen) resetValues();
  };

  const resetValues = () => {
    setError("");
    inputRef.current.value = "";
    inputRef.current.classList.remove("auth__input--invalid");
  };

  const handleChange = (e) => {
    e.target.classList.remove("auth__input--invalid");
  };

  const handleSubmit = async () => {
    if (!(await validateData())) return;

    const email = inputRef.current.value;

    await resetPassword(email);
    resetValues();
    setSuccess(true);
  };

  const validateData = async () => {
    const email = inputRef.current;

    if (!email.value) {
      setError("Please enter an email.");
      email.classList.add("auth__input--invalid");
      return false;
    }

    if (!isEmailValid(email.value)) {
      setError("Please enter a valid email.");
      email.classList.add("auth__input--invalid");
      return false;
    }

    if (!(await checkIfEmailExists(email.value))) {
      setError("This email does not exist.");
      email.classList.add("auth__input--invalid");
      return false;
    }

    return true;
  };

  return (
    <div className={`auth__form auth__form--reset auth__form--reset--${theme}`}>
      <h1 className={`auth__header auth__header--${theme}`}>
        Reset your password
      </h1>

      <div className="auth__group">
        <label
          htmlFor="reset-email"
          className={`auth__label auth__label--${theme}`}
        >
          Email
        </label>
        <input
          ref={inputRef}
          className={`auth__input auth__input--${theme}`}
          name="reset-email"
          type="reset-email"
          onChange={handleChange}
        />
      </div>

      <Alert message={error} />
      <button
        type="submit"
        onClick={handleSubmit}
        className={`auth__submit auth__submit--${theme}`}
        aria-label="reset password"
      >
        Submit
      </button>
    </div>
  );
}
