import { Spinner } from 'react-bootstrap';

const spinner = () => (
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
);

export default spinner;
