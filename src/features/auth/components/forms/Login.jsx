import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmailValid } from "src/utils/form";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import Alert from "../alerts/Alert";
import ForgotPasswordButton from "../buttons/ForgotPasswordButton";

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

    if (!validateData()) {
      return;
    }

    if (await login(email, password, setError)) {
      navigate("/");
    }
  };

  const validateData = () => {
    const email = formRef.current.elements.email;
    const password = formRef.current.elements.password;

    if (email.value === "") {
      setError("Please enter an email.");
      email.classList.add("auth__input--invalid");
      return false;
    }

    if (isEmailValid(email.value) === false) {
      setError("Please enter a valid email.");
      email.classList.add("auth__input--invalid");
      return false;
    }

    if (password.value === "") {
      setError("Please enter a password.");
      password.classList.add("auth__input--invalid");
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

      <ForgotPasswordButton setError={setError} />

      <Alert message={error} />
      <SubmitButton />

      <SignupButton setIsSignup={setIsSignup} />
    </form>
  );
}

function FormInput({ id, label, type }) {
  const handleChange = (e) => {
    e.target.classList.remove("auth__input--invalid");
  };

  return (
    <div className="auth__group">
      <label htmlFor={id} className="auth__label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        onChange={handleChange}
        className="auth__input"
      />
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
