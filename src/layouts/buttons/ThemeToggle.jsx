import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import "./theme-toggle.scss";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeContext();

  const enabled = theme === "dark";

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="theme-toggle__wrapper">
      <FontAwesomeIcon
        icon={enabled ? faMoon : faSun}
        className="theme-toggle__icon"
      />
      <label className="theme-toggle">
        <input
          type="checkbox"
          onChange={handleToggle}
          checked={enabled}
          className="theme-toggle__input"
        />
        <span className="theme-toggle__slider"></span>
      </label>
    </div>
  );
}
