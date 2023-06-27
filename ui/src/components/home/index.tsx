import {Row, Col, Container} from "react-bootstrap";
import Map from '../map';
import Location from '../location';
import Recorder from "../recorder";
import {useAuthStore, useLocationStore, usePostsStore} from "../../stores";
import {AlertDismissible} from "../common";
import Posts from "../posts";
import _ from "lodash";

const Board = () => {
  const authContext = useAuthStore();
  const authenticated = !!authContext?.auth;
  const locationContext = useLocationStore();
  const {posts} = usePostsStore();

  const coordinates = _.flatten(posts).filter(_.identity).map(({ latitude, longitude}) => ({latitude, longitude, color: "lightyellow"}));
  if (locationContext.coordinate) {
    coordinates.push({ ...locationContext.coordinate, color: 'red'});
  }

  return (
    <Container>
      <Row>
        <Col sm={12} md={6} lg={8}>
          <Map coordinates={coordinates}/>
        </Col>
        <Col sm={12} md={6} lg={4}>
          <Row>
            <Col sm={12}>
              <Container className="mt-1 mb-3 p-0">
                {
                  authenticated ?
                    <Location
                      onload={location => locationContext.setCoordinate(location)}
                      onNotSupported={() => <AlertDismissible variant="danger" header="recording not possible"
                                                              message="Your browser does not support Geolocation."/>}
                      onNotAvailable={() => <AlertDismissible variant="danger" header="recording not possible"
                                                              message="Geolocation is not enabled. Please try again by refreshing the page."/>}
                      render={() => <Recorder/>}/> :
                    <AlertDismissible variant="info" header="recording not available"
                                      message="Recording feature is only available to authenticated users."/>
                }
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
