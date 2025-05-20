import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";

export default function Navbar({ unreadMessages }) {
  const { globalUser } = useAuthContext();

  return (
    <header className="nav">
      <nav className="navbar">
        <div className="navbar__messages">
          <NavItem link="/messages" icon={faEnvelope} />
          <NotificationBadge unreadCount={unreadMessages} link="/messages" />
        </div>

        {globalUser ? (
          <div>
            <p>{globalUser.displayname}</p>
            <LogoutButton />{" "}
          </div>
        ) : (
          <LoginButton />
        )}
      </nav>
    </header>
  );
}

function NavItem({ link, icon }) {
  return (
    <NavLink to={link} className="navbar__link" aria-current="page">
      <FontAwesomeIcon icon={icon} />
    </NavLink>
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

function LoginButton() {
  return (
    <Link to="/authenticate" className="navbar__login">
      LOG IN
    </Link>
  );
}

function LogoutButton() {
  const { logout } = useAuthContext();

  return (
    <button type="button" onClick={logout}>
      Log out
    </button>
  );
}
