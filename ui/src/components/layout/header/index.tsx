import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import { useAuthStore } from "../../../stores";

const Header = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;

  return (
    <Navbar bg="light" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand href="/">GEO-CAST</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/home">
              <Nav.Link>Board</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            {!authenticated ?
              <>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </>
              :
              <>
                {authContext.auth?.roles?.some(r => r.name === 'admin') ?
                  <LinkContainer to="/manage">
                    <Nav.Link>Manage</Nav.Link>
                  </LinkContainer> : null}
                <LinkContainer to="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/logout">
                  <Nav.Link>Logout</Nav.Link>
                </LinkContainer>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Header;