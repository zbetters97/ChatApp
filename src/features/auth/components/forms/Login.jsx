import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmailValid } from "src/utils/form";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import Alert from "../alerts/Alert";
import FormInput from "../inputs/FormInput";
import GoogleLogin from "../buttons/GoogleLogin";
import FormSubmitButton from "../buttons/FormSubmitButton";
import FormSwitchButton from "../buttons/FormSwitchButton";
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
      <FormSubmitButton label="Log in" />

      <FormSwitchButton
        header="Don't have an account with us?"
        label="Sign up"
        direction="before"
        setIsSignup={setIsSignup}
      />

      <GoogleLogin />
    </form>
  );
}
