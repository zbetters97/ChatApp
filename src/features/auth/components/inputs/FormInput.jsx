import { useThemeContext } from "src/features/theme/context/ThemeContext";

export default function FormInput({ id, label, type }) {
  const { theme } = useThemeContext();

  const handleChange = (e) => {
    e.target.classList.remove("auth__input--invalid");
  };

  return (
    <div className="auth__group">
      <label htmlFor={id} className={`auth__label auth__label--${theme}`}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        onChange={handleChange}
        className={`auth__input auth__input--${theme}`}
      />
    </div>
  );
}
