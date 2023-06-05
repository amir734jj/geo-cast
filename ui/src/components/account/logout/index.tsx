import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores";
import { Spinner } from "../../common";

const Logout = () => {
  const authContext = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    authContext.logout();
    navigate("/");
  }, [authContext])

  return <Spinner />;
}

export default Logout;
