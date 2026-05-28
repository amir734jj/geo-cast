import { Container } from "react-bootstrap";
import { ReactChildrenArg } from "../../../types";

const Main = ({ children }: ReactChildrenArg) => {
  return <div className="mx-1 mt-2">
    <Container fluid className="px-md-4">
      {children}
    </Container>
  </div>;
};

export default Main;