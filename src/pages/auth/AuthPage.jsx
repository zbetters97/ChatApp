import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "src/features/auth/components/forms/Login";
import Signup from "src/features/auth/components/forms/Signup";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import "./auth-page.scss";

export default function AuthPage() {
  const { globalUser, loadingUser } = useAuthContext();

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
        navigate("/home");
      }

      setLoading(false);
    };

    fetchUser();
  }, [globalUser, loadingUser]);

  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <section className="auth">
      <div className="auth__container">
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
