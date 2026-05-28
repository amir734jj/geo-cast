import {Row, Col, Container} from "react-bootstrap";
import Map from '../map';
import Location from '../location';
import {useAuthStore, useLocationStore, usePostsStore} from "../../stores";
import {AlertDismissible, Spinner} from "../common";
import Posts from "../posts";
import _ from "lodash";
import {useState} from "react";
import Recorder from "../recorder";

const Board = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;
  const locationContext = useLocationStore();
  const {posts} = usePostsStore();

  const coordinates = _.flatten(posts).filter(_.identity).map(({latitude, longitude}) => ({
    latitude,
    longitude,
    color: "lightyellow"
  }));

  if (locationContext.coordinate) {
    coordinates.push({...locationContext.coordinate, color: 'red'});
  }

  const [locationStatus, setLocationStatus] = useState<'not-available' | 'not-supported' | 'not-ready' | 'ready'>('not-ready');
  let location = null;
  if (authenticated) {
    switch (locationStatus) {
      case "not-available":
        location = <AlertDismissible
          variant="danger"
          header="recording not possible"
          message="Geolocation is not enabled. Please try again by refreshing the page."/>;
        break;
      case "not-supported":
        location = <AlertDismissible
          variant="danger"
          header="recording not possible"
          message="Your browser does not support Geolocation."/>;
        break;
      case "not-ready":
        location = <Spinner/>;
        break;
      default:
        break;
    }
  }

  return (
    <Container fluid className="px-0">
      <Row>
        <Col sm={12} md={6} lg={8}>
          <Map coordinates={coordinates}/>
        </Col>
        <Col sm={12} md={6} lg={4}>
          <Row>
            <Col sm={12}>
              <Container className="mt-1 mb-3 p-0">
                {authenticated ?
                  <Location
                    onNotAvailable={() => setLocationStatus('not-available')}
                    onNotSupported={() => setLocationStatus("not-supported")}
                    onload={location => {
                      setLocationStatus("ready");
                      locationContext.setCoordinate(location);
                    }}/> :
                  <AlertDismissible
                    variant="info"
                    header="recording not available"
                    message="Recording feature is only available to authenticated users."/>}
                {location}
                {authenticated && locationStatus === "ready" ? <Recorder/> : null}
              </Container>
            </Col>
          </Row>
          <Col sm={12}>
            <Posts/>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default Board;
