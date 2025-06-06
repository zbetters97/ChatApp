import { useEffect, useState } from "react";
import Modal from "src/features/modal/Modal";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import SuccessAlert from "../alerts/SuccessAlert";
import PasswordReset from "../forms/PasswordReset";

export default function ForgotPasswordButton({ setError }) {
  const { theme } = useThemeContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("lock-scroll");
    }

    return () => {
      setSuccess(false);
      setError("");
    };
  }, [isModalOpen]);

  return (
    <div>
      {success ? (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <SuccessAlert
            message="Reset email sent!"
            link="Go to login"
            icon={faArrowRight}
            onClick={() => setIsModalOpen(false)}
          />
        </Modal>
      ) : (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <PasswordReset isModalOpen={isModalOpen} setSuccess={setSuccess} />
        </Modal>
      )}

      <div className={`auth__reset auth__reset--${theme}`}>
        <p>Forgot password?</p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`auth__highlight auth__highlight--${theme}`}
          aria-label="go to reset password"
        >
          Click here
        </button>
      </div>
    </div>
  );
}
