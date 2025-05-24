import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import "./alert.scss";

export default function Alert({ message }) {
  const { theme } = useThemeContext();

  return (
    <div
      className={`alert alert--${theme}`}
      aria-expanded={message ? "true" : "false"}
    >
      <FontAwesomeIcon icon={faCircleExclamation} className="alert__icon" />
      <p>{message}</p>
    </div>
  );
}
