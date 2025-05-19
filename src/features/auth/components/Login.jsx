import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import Alert from "./Alert";

export default function Login({ setIsSignup }) {
  const { login } = useAuthContext();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const email = formData.get("email");
    const password = formData.get("password");

    if (!validateData(email, password)) {
      return;
    }

    if (await login(email, password, setError)) {
      navigate("/");
    }
  };

  const validateData = (email, password) => {
    if (!email || email === "") {
      setError("Please enter an email.");
      return false;
    }

    if (!password || password === "") {
      setError("Please enter a password.");
      return false;
    }

    return true;
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="auth__form auth__form--login"
    >
      <FormInput id="email" label="Email" type="email" />
      <FormInput id="password" label="Password" type="password" />

      <ResetPassword />

      <Alert message={error} />
      <SubmitButton />

      <SignupButton setIsSignup={setIsSignup} />
    </form>
  );
}

function FormInput({ id, label, type }) {
  return (
    <div className="auth__group">
      <label htmlFor={id} className="auth__label">
        {label}
      </label>
      <input id={id} name={id} type={type} className="auth__input" />
    </div>
  );
}

function ResetPassword() {
  return (
    <div className="auth__reset">
      <p>Forgot password?</p>

      <button type="button" className="auth__highlight">
        Click here
      </button>
    </div>
  );
}

function SubmitButton() {
  return (
    <button type="submit" className="auth__submit">
      Log in
    </button>
  );
}

function SignupButton({ setIsSignup }) {
  return (
    <div className="auth__back">
      <p>Don't have an account with us?</p>
      <button
        type="button"
        onClick={() => setIsSignup(true)}
        className="auth__back-button auth__back-button--before"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="auth__arrow auth__arrow--before"
        />
        <p>Sign up</p>
      </button>
    </div>
  );
}
