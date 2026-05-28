import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Error = () => {
  const location = useLocation();
  return <Container>
    <h3>Route not found</h3>
    <code>Path: {location.pathname}</code>
  </Container>;
};

export default Error;