import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { useAuthStore, useThemeStore } from "../../../stores";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { isAdmin } from '@geo-cast/lib/utils';

const Header = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'light'} data-bs-theme={theme} expand="lg" collapseOnSelect>
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
            <LinkContainer to="/stats">
              <Nav.Link>Stats</Nav.Link>
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
                {isAdmin(authContext.auth?.roles) ?
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
          <Button
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
            size="sm"
            className="ms-2"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;