import { ReactMediaRecorder } from "react-media-recorder";
import { CoordinateType } from "../../types";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPlay, faPause, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import Player from "../player";
import { createPost, downloadBlob } from "../../actions";

export type RecorderPropType = {
  location: CoordinateType
}

const Recorder = (arg: RecorderPropType) => {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  return <ReactMediaRecorder
    render={({ startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {
      return (
        <Container>
          <ButtonGroup size="lg" >
            {recording ?
              <Button variant="outline-danger" title="startRecording" onClick={() => {
                setRecording(false);
                stopRecording();
              }}>
                <FontAwesomeIcon icon={faMicrophone} beatFade />
              </Button> :
              <Button variant="outline-success" disabled={playing || uploading} title="stopRecording" onClick={() => {
                setRecording(true);
                startRecording();
              }}>
                <FontAwesomeIcon icon={faMicrophone} />
              </Button>}
            {mediaBlobUrl ? <Player mediaBlobUrl={mediaBlobUrl} render={(controls) => {

              setDuration(controls.duration);
              setPlaying(controls.playing);

              return controls.playing ? (<Button variant="outline-secondary" title="pauseRecording" disabled={recording} onClick={async () => {
                await controls.pause();
              }}>
                <FontAwesomeIcon icon={faPause} beatFade />
              </Button>) : (<Button variant="outline-primary" title="playRecording" disabled={recording} onClick={async () => {
                await controls.play();
              }}>
                <FontAwesomeIcon icon={faPlay} />
              </Button>
              );
            }} /> : null}
            {mediaBlobUrl ? <Button variant="outline-dark" title="share" disabled={recording || playing} onClick={async () => {
              setUploading(true);
              const audioBlob = await downloadBlob(mediaBlobUrl, 'voice.wav');

              await createPost({
                ...arg.location,
                duration: duration!,
                file: audioBlob
              });

              clearBlobUrl();
              setUploading(false);
              setDuration(null);
            }}>
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </Button> : null}
          </ButtonGroup>
          {duration ? <p>{duration} seconds</p> : null}
        </Container>
      );
    }}
  />
};

export default Recorder;