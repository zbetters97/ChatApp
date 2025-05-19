import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login({ setIsSignup }) {
  return (
    <form className="auth__form auth__form--login">
      <FormInput label="Email" type="email" placeholder="Email" />
      <FormInput label="Password" type="password" placeholder="password" />

      <ResetPassword />

      <SubmitButton />

      <SignupButton setIsSignup={setIsSignup} />
    </form>
  );
}

function FormInput({ id, label, type, placeholder }) {
  return (
    <div className="auth__group">
      <label htmlFor={id} className="auth__label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="auth__input"
      />
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
        className="auth__back-button"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Sign up</p>
      </button>
    </div>
  );
}
