import {ReactMediaRecorder} from "react-media-recorder";
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMicrophone, faPlay, faPause, faCloudArrowUp} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from "react";
import Player, {PlayerInfoPropType} from "../player";
import {createPost, downloadBlob} from "../../actions";
import {AlertDismissible, Spinner} from "../common";
import {AxiosError} from "axios";
import {useLocationStore} from "../../stores";

const Recorder = () => {
  const locationContext = useLocationStore();
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<{ recording: boolean } & PlayerInfoPropType>({});
  const [uploading, setUploading] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);

  const uploadRecordingHandler = async () => {
    try {
      setUploading(true);
      const audioBlob = await downloadBlob(mediaBlobUrl!);

      await createPost({
        ...locationContext.coordinate!,
        duration: duration!,
        file: new File([audioBlob], 'voice.wav')
      });

      setUploading(false);
      setDuration(null);
      setMediaBlobUrl(null);
      setError(null);
    } catch (e) {
      setError((e as AxiosError).message);
    } finally {
      setUploading(false);
    }
  }

  if (uploading) {
    return <Spinner/>
  }

  return <>
    {error ? <AlertDismissible header='uploading recording failed' variant='danger' message={error}/> : null}
    <Row>
      <Col sm={12}>
        {mediaBlobUrl && board.duration && board.duration < 5 ?
          <AlertDismissible header='uploading recording failed' variant='danger'
                            message={'recording is too short to post (less than 5 seconds)'}/> : null}
        {mediaBlobUrl && board.duration && board.duration >= 30 ?
          <AlertDismissible header='uploading recording failed' variant='danger'
                            message={'recording is too long to post (more than 30 seconds)'}/> : null}
      </Col>
      <Col sm={12}>
        <ReactMediaRecorder
          render={({startRecording, stopRecording, mediaBlobUrl: inputMediaBlobUrl}) => {
            useEffect(() => {
              if (inputMediaBlobUrl) {
                setMediaBlobUrl(inputMediaBlobUrl);
              }
            }, [inputMediaBlobUrl]);

            return (
              <Container fluid={true} className="px-0">
                <ButtonGroup size="lg">
                  {board.recording ?
                    <Button variant="outline-danger" title="start-recording" onClick={() => {
                      setRecording(false);
                      stopRecording();
                    }}>
                      <FontAwesomeIcon icon={faMicrophone} beatFade/>
                    </Button> :
                    <Button
                      variant="outline-success"
                      disabled={board.playing || uploading}
                      title={board.recording ? "stop-recording" : "start-recording"}
                      onClick={() => {
                        setRecording(true);
                        startRecording();
                      }}>
                      <FontAwesomeIcon icon={faMicrophone}/>
                    </Button>}
                  {mediaBlobUrl ?
                    <Player
                      play={playing}
                      mediaBlobUrl={mediaBlobUrl}
                      onchange={(controls) => {
                        setDuration(controls.duration);
                        setPlaying(controls.playing);
                      }}/> : null}
                  {playing ? (
                    <Button variant="outline-secondary" title="pauseRecording"
                            disabled={recording} onClick={() => setPlaying(false)}>
                      <FontAwesomeIcon icon={faPause} beatFade/>
                    </Button>) : (
                    <Button
                      variant="outline-primary"
                      title="play-recording"
                      disabled={recording}
                      onClick={() => setPlaying(true)}>
                      <FontAwesomeIcon icon={faPlay}/>
                    </Button>
                  )}
                  {(mediaBlobUrl && duration) ?
                    <Button
                      variant="outline-dark" title="share"
                      disabled={!!(recording || playing || (duration && duration! < 5))}
                      onClick={async () => {
                        await uploadRecordingHandler();
                      }}>
                      <FontAwesomeIcon icon={faCloudArrowUp}/>
                    </Button> : null}
                </ButtonGroup>
                {board.duration ? <p>{board.duration.toFixed(2)} seconds</p> : null}
              </Container>
            );
          }}
        />
      </Col>
    </Row>
  </>
};

export default Recorder;
