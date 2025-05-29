import { useNavigate } from "react-router-dom";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../../context/AuthContext";

export default function GoogleLogin() {
  const { loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  async function handleGoogle() {
    if (await loginWithGoogle()) {
      navigate("/");
      window.location.reload();
    }
  }

  return (
    <button type="button" onClick={handleGoogle} className="auth__google">
      <FontAwesomeIcon icon={faGoogle} className="auth__google__icon" />
      <p>Log in with Google</p>
    </button>
  );
}
