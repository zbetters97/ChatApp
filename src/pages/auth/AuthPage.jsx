import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "src/features/auth/components/forms/Login";
import Signup from "src/features/auth/components/forms/Signup";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useThemeContext } from "src/features/theme/context/ThemeContext";
import "./auth-page.scss";

export default function AuthPage() {
  const { globalUser, loadingUser } = useAuthContext();
  const { theme } = useThemeContext();

  const [loading, setLoading] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      if (loadingUser) {
        return;
      }

      if (globalUser) {
        navigate("/messages");
      }

      setLoading(false);
    };

    fetchUser();
  }, [globalUser, loadingUser]);

  if (loading) {
    return null;
  }

  return (
    <section className={`auth auth--${theme}`}>
      <div className={`auth__container auth__container--${theme}`}>
        <Header isSignup={isSignup} />

        {isSignup ? (
          <Signup setIsSignup={setIsSignup} />
        ) : (
          <Login setIsSignup={setIsSignup} />
        )}
      </div>
    </section>
  );
}

function Header({ isSignup }) {
  return (
    <h2 className="auth__header">
      {isSignup ? "Sign up for an account" : "Log in to your account"}
    </h2>
  );
}
