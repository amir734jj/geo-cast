import {useEffect, useState} from 'react';
import { redirect } from "react-router-dom";
import useAuthStore from "../../../stores/auth.store";
import {Spinner} from "../../common";

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);
  const authContext = useAuthStore();

  useEffect(() => {
    authContext.logout();
    setLoggedOut(true);
  }, [authContext])

  if (loggedOut) {
    return redirect("/");
  } else {
    return <Spinner />
  }
}

export default Logout;
