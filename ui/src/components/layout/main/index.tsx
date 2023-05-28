import { Container } from "react-bootstrap";
import { ReactChildrenArg } from "../../../types/react.children";

const Main = ({ children } : ReactChildrenArg) => {
  return <div className="mt-4">
  <Container>
    {children}
  </Container>
</div>;
};

export default Main