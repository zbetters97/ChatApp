import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import "./home-page.scss";

export default function Home() {
  const { globalUser, loadingUser } = useAuthContext();

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      if (loadingUser) {
        return;
      }

      if (!globalUser) {
        navigate("/authenticate");
      }

      setLoading(false);
    };

    fetchUser();
  }, [globalUser, loadingUser]);

  if (loading) {
    return <section>Loading...</section>;
  }

  return <section>Home</section>;
}
