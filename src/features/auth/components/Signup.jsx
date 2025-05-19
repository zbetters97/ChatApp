import { useRef, useState } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import Alert from "./Alert";

export default function Signup({ setIsSignup }) {
  const { signup } = useAuthContext();

  const [error, setError] = useState("");
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const displayname = formData.get("displayname");
    const email = formData.get("email");
    const password = formData.get("password");
    const repassword = formData.get("repassword");

    if (
      !validateData(
        firstname,
        lastname,
        displayname,
        email,
        password,
        repassword
      )
    ) {
      return;
    }

    if (
      await signup(firstname, lastname, displayname, email, password, setError)
    ) {
      setIsSignup(false);
    }
  };

  const validateData = (
    firstname,
    lastname,
    displayname,
    email,
    password,
    repassword
  ) => {
    if (!firstname || firstname === "") {
      setError("Please enter a first name.");
      return false;
    }

    if (!lastname || lastname === "") {
      setError("Please enter a last name.");
      return false;
    }

    if (!displayname || displayname === "") {
      setError("Please enter a display name.");
      return false;
    }

    if (!email || email === "") {
      setError("Please enter an email.");
      return false;
    }

    if (!password || password === "") {
      setError("Please enter a password.");
      return false;
    }

    if (!repassword || repassword === "") {
      setError("Please re-enter the password.");
      return false;
    }

    if (password !== repassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="auth__form auth__form--signup"
    >
      <FormInput id="firstname" label="First Name" type="text" />
      <FormInput id="lastname" label="Last Name" type="text" />
      <FormInput id="displayname" label="Display Name" type="text" />

      <FormInput id="email" label="Email" type="email" />

      <FormInput id="password" label="Password" type="password" />
      <FormInput id="repassword" label="Re-enter Password" type="password" />

      <Alert message={error} />
      <SubmitButton />

      <LoginButton setIsSignup={setIsSignup} />
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

function SubmitButton() {
  return (
    <button type="submit" className="auth__submit">
      Sign up
    </button>
  );
}

function LoginButton({ setIsSignup }) {
  return (
    <div className="auth__back">
      <p>Already have an account with us?</p>
      <button
        type="button"
        onClick={() => setIsSignup(false)}
        className="auth__back-button auth__back-button--after"
      >
        <p>Login</p>
        <FontAwesomeIcon
          icon={faArrowRight}
          className="auth__arrow auth__arrow--after"
        />
      </button>
    </div>
  );
}
