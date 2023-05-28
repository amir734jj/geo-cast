import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import useAuthStore from "../../../stores/auth.store";

const Header = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">GEO-CAST</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/home">
              <Nav.Link>Board</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav className="ml-auto">
            {!authenticated ? (
              <>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <>
                <LinkContainer to="/manage">
                  <Nav.Link>Manage</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/logout">
                  <Nav.Link>Logout</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Header;