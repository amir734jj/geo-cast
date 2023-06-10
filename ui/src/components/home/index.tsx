import { Row, Col, Container } from "react-bootstrap";
import Map from '../map';
import Location from '../location';
import Recorder from "../recorder";
import { useAuthStore, useLocationStore } from "../../stores";
import { AlertDismissible } from "../common";
import Posts from "../posts";

const Board = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;
  const locationContext = useLocationStore();

  return (
    <Container>
      <Row>
        <Col sm={12} md={10} lg={8}>
          <Map coordinates={locationContext.coordinate ? [{ ...locationContext.coordinate!, color: 'red' }] : []} />
        </Col>
        <Col sm={12} md={2} lg={4}>
          <Posts />
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Container className="mt-3">
            {
              authenticated ?
                <Location
                  onload={location => locationContext.setCoordinate(location)}
                  onNotSupported={() => <AlertDismissible variant="danger" header="recording not possible" message="Your browser does not support Geolocation." />}
                  onNotAvailable={() => <AlertDismissible variant="danger" header="recording not possible" message="Geolocation is not enabled. Please try again by refreshing the page." />}
                  render={() => <Recorder />} /> :
                <AlertDismissible variant="info" header="recording not available" message="Recording feature is only available to authenticated users." />
            }
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Board;
