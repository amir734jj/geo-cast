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
  }

  useEffect(() => {
    animateIcon();
  }, []);

  return (
    <Container className='my-4 mx-auto px-3'>
      <Row>
        <Col xs={12} md={8}>
          <h3>Mission</h3>
          <p>
            The mission of this website is to quickly hear what people in a region are talking about
            at any given time, and enable people to engage in a conversation using their geological location.
          </p>

          <h3>Open</h3>
          <p>
            This website is completely <a href="https://github.com/amir734jj/geo-cast">open source</a>. We welcome any contribution.
          </p>

          <h3>Privacy</h3>
          <p>
            The audio files will never be sold to third party and they are stored in Azure Blob storage.
          </p>

          <h3>Author</h3>
          <p>
            Seyedamirhossein Hesamian (<a href="mailto:hesamian@uwm.edu">hesamian@uwm.edu</a>)
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