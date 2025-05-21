import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import {
  faCommentDots,
  faGear,
  faHome,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "../buttons/ThemeToggle";
import "./navbar.scss";

export default function Navbar({ unreadMessages }) {
  const { globalUser } = useAuthContext();
  const { theme } = useThemeContext();

  const location = useLocation();

  if (location.pathname === "/auth") {
    return null;
  }

  return (
    <header className={`nav nav--${theme}`}>
      <nav className={`navbar navbar--${theme}`}>
        <ThemeToggle />

        <NavItem to="/home" icon={faHome} />

        <div className="navbar__messages">
          <NavItem to="/messages" icon={faCommentDots} />
          <NotificationBadge unreadCount={unreadMessages} link="/messages" />
        </div>

        <NavItem to="/settings" icon={faGear} />

        {globalUser && <NavProfile />}
      </nav>
    </header>
  );
}

function NotificationBadge({ unreadCount, link }) {
  if (!unreadCount || unreadCount === 0) return;
  return (
    <NavLink to={link}>
      <div className="navbar__badge">{unreadCount}</div>
    </NavLink>
  );
}

function NavProfile() {
  return (
    <div className="navbar__profile">
      <NavItem to="/user" icon={faUser} />
      <LogoutButton />
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuthContext();

  const navigate = useNavigate();

  const handleClick = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <button type="button" onClick={handleClick} className="navbar__link">
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );
}

function NavItem({ to, icon }) {
  return (
    <NavLink to={to} className="navbar__link" aria-current="page">
      <FontAwesomeIcon icon={icon} />
    </NavLink>
  );
}
