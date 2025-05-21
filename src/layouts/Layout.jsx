import { Outlet } from "react-router-dom";
import { useThemeContext } from "src/features/theme/context/ThemeContext.js";
import "./layout.scss";

export default function Layout() {
  const { theme } = useThemeContext();

  return (
    <div className={`wrapper wrapper--${theme}`}>
      <main className={`main main--${theme}`}>
        <Outlet />
      </main>
    </div>
  );
}
