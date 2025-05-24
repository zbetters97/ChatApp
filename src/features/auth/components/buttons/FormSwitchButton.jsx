import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function FormSwitchButton({
  header,
  label,
  direction,
  setIsSignup,
}) {
  const { theme } = useThemeContext();

  return (
    <div className={`auth__back auth__back--${theme}`}>
      <p>{header}</p>
      <button
        type="button"
        onClick={() => setIsSignup((prev) => !prev)}
        className={`auth__back-button auth__back-button--${theme} auth__back-button--${direction}`}
      >
        {direction === "before" && (
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="auth__arrow auth__arrow--before"
          />
        )}
        <p>{label}</p>
        {direction === "after" && (
          <FontAwesomeIcon
            icon={faArrowRight}
            className="auth__arrow auth__arrow--after"
          />
        )}
      </button>
    </div>
  );
}
