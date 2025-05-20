import { Link, NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faCommentDots,
  faEnvelope,
  faGear,
  faHome,
  faMessage,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import "./navbar.scss";

export default function Navbar({ unreadMessages }) {
  const { globalUser } = useAuthContext();

  const location = useLocation();

  if (location.pathname === "/auth") {
    return null;
  }

  return (
    <header className="nav">
      <nav className="navbar">
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
      <p className="navbar__badge">{unreadCount}</p>
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

  return (
    <button type="button" onClick={logout} className="navbar__link">
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
