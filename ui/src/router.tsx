import {
  Route,
  Routes,
} from "react-router-dom";

import Home from "./components/home";
import Error from "./components/error";
import About from "./components/about";
import { Login, Logout, Register } from "./components/account";
import { useAuthStore } from "./stores";
import Profile from "./components/profile";
import Manage from "./components/manage";
import PublicProfile from "./components/publicProfile";

const Router = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;
  const admin = authContext?.auth && authContext.auth.roles.filter(x => x.name === 'admin').length;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="home" element={<Home />} />
      {
        authenticated ?
          <>
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="/profile" element={<Profile />} />
          </> :
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
      }
      {
        authenticated && admin ?
          <>
            <Route path="/manage" element={<Manage />} />
          </> : null
      }
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Router;
