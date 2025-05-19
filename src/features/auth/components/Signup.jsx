import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Signup({ setIsSignup }) {
  return (
    <form className="auth__form auth__form--signup">
      <FormInput
        id="firstname"
        label="First Name"
        type="text"
        placeholder="First name"
      />
      <FormInput label="Last Name" type="text" placeholder="Last name" />
      <FormInput label="Email" type="email" placeholder="Email" />
      <FormInput label="Password" type="password" placeholder="password" />
      <FormInput
        label="Re-enter Password"
        type="password"
        placeholder="password"
      />

      <SubmitButton />

      <LoginButton setIsSignup={setIsSignup} />
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
        className="auth__back-button"
      >
        <p>Login</p>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
}
