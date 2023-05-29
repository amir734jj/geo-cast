import {
  Route,
  Routes,
} from "react-router-dom";

import Home from "./components/home";
import Error from "./components/error";
import About from "./components/about";
import { Login, Logout, Register } from "./components/account";
import useAuthStore from "./stores/auth.store";
import Profile from "./components/profile";

const Router = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="home" element={<Home />} />
      {
        authenticated ?
          <>
            <Route path="/logout" element={<Logout />} />,
            <Route path="/profile" element={<Profile />} />
          </> :
          <>
            <Route path="/login" element={<Login />} />,
            <Route path="/register" element={<Register />} />
          </>
      }
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Router;