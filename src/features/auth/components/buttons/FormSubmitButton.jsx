import { useThemeContext } from "src/features/theme/context/ThemeContext";

export default function FormSubmitButton({ label }) {
  const { theme } = useThemeContext();

  return (
    <button type="submit" className={`auth__submit auth__submit--${theme}`}>
      {label}
    </button>
  );
}
