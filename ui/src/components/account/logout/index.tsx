import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores";
import { logout as logoutAction } from "../../../actions";

const Logout = () => {
  const authContext = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await logoutAction();
      authContext.logout();
      navigate("/");
    })();
  }, []);

  return null;
};

export default Logout;
