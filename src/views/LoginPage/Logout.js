import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function Logout() {
  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem("token");
    history.push("/login");
  }, []);

  return "Logout";
}
