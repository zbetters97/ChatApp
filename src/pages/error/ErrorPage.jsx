import { Link, useRouteError } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import {
  faExclamationTriangle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./error-page.scss";

export default function ErrorPage({ is404 }) {
  const { theme } = useThemeContext();

  const error = useRouteError();

  const errorMessage = is404
    ? "404 - Page Not Found"
    : "Oops! Something went wrong :(";

  return (
    <section className={`error error--${theme}`}>
      <FontAwesomeIcon icon={faExclamationTriangle} className="error__icon" />

      <h1 className={`error__header error__header--${theme}`}>
        {errorMessage}
      </h1>

      {error && (
        <p className={`error__message error__message--${theme}`}>
          "{error.message}"
        </p>
      )}

      <Link to="/home" className="error__button">
        <FontAwesomeIcon icon={faHome} />
        Go to home
      </Link>
    </section>
  );
}
