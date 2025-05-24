import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import "./success-alert.scss";

export default function SuccessAlert({ message, link, icon, onClick }) {
  const { theme } = useThemeContext;

  return (
    <div className="success">
      <div className={`success__message success__message--${theme}`}>
        <FontAwesomeIcon icon={faCircleCheck} />
        <p>{message}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`success__button success__button--${theme}`}
        aria-label="continue"
      >
        <p>{link}</p>
        <FontAwesomeIcon icon={icon} />
      </button>
    </div>
  );
}
