import { useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores";
import { logout as logoutAction } from "../../../actions";
import { Spinner } from "../../common";

const Logout = () => {
  const authContext = useAuthStore();
  const navigate = useNavigate();

  const doLogout = useCallback(async () => {
    try {
      await logoutAction();
    } catch {
      // ignore logout API errors
    } finally {
      authContext.logout();
      navigate("/");
    }
  }, [authContext, navigate]);

  useEffect(() => {
    doLogout();
  }, [doLogout]);

  return <Spinner />;
}

export default Logout;
