import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import "./theme-toggle.scss";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeContext();

  const enabled = theme === "dark";

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="theme-toggle">
      <input
        type="checkbox"
        id="switch-button"
        onChange={handleToggle}
        checked={enabled}
        className="theme-toggle__input"
      />
      <label htmlFor="switch-button" className="theme-toggle__label">
        <FontAwesomeIcon icon={faSun} className="theme-toggle__sun" />
        <FontAwesomeIcon icon={faMoon} className="theme-toggle__moon" />
      </label>
    </div>
  );
}
