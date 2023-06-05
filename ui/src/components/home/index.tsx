import { Row, Col, Container } from "react-bootstrap";
import Map from '../map';
import Location from '../location';
import Recorder from "../recorder";
import { useAuthStore, useLocationStore } from "../../stores";
import { AlertDismissible } from "../common";

const MapChart = () => {
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
          Right
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Container className="mt-3">
            {
              authenticated ?
                <Location>
                  <Recorder location={locationContext.coordinate!} />
                </Location> :
                <AlertDismissible variant="info" header="recording not available" message="Recording feature is only available to authenticated users." />
            }
          </Container>
        </Col>
      </Row>


    </Container>
  );
};

export default MapChart;
