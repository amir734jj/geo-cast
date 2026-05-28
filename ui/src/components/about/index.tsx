import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTowerCell } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from 'react';

const About = () => {
  const [fade, setFade] = useState(true);

  const animateIcon = () => {
    setFade(true);

    setTimeout(() => {
      setFade(false);
    }, 1000);
  };

  useEffect(() => {
    animateIcon();
  }, []);

  return (
    <Container className='my-4 mx-auto px-3'>
      <Row>
        <Col xs={12} md={8}>
          <h3>Mission</h3>
          <p>
            Hear what people around you are talking about, right now.
            Record a short audio clip tied to your location and listen to what others have shared nearby.
          </p>

          <h3>Open Source</h3>
          <p>
            Fully <a href="https://github.com/amir734jj/geo-cast">open source</a>. No tracking, no ads. Contributions welcome.
          </p>

          <h3>Privacy</h3>
          <p>
            Your recordings are never sold or shared with third parties.
            Location coordinates displayed on the map are slightly randomized to protect your exact position.
          </p>

          <h3>Author</h3>
          <p>
            Amir Hesamian (<a href="mailto:hesamian@uwm.edu">hesamian@uwm.edu</a>)
          </p>
        </Col>
        <Col xs={12} md={4}>
          <div className='d-flex align-items-center justify-content-center mt-5'>
            <span className="fa-layers fa-fw mx-auto">
              <FontAwesomeIcon icon={faTowerCell} size="5x" color='grey' pulse={fade} onMouseOver={() => animateIcon()} />
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;