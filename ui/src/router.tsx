import {
  Route,
  Routes,
} from "react-router-dom";

import Home from "./components/home";
import Error from "./components/error";
import About from "./components/about";
import Login from "./components/account/login";
import Logout from "./components/account/logout";
import Register from "./components/account/register";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="home" element={<Home />} />

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="*" element={<Error />} />
  </Routes>
);

export default Router;