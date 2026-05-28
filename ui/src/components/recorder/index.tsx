import { useReactMediaRecorder } from "react-media-recorder";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faPlay,
  faPause,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import Player, { PlayerInfoPropType } from "../player";
import { createPost, downloadBlob } from "../../actions";
import { AlertDismissible, Spinner } from "../common";
import { AxiosError } from "axios";
import { useLocationStore } from "../../stores";
import { DateTime } from "luxon";
import ms from "ms";
import { MIN_RECORDING_DURATION, MAX_RECORDING_DURATION } from '@geo-cast/lib/constants';

type BoardType = {
  play: boolean;
  recording: boolean;
  error: string | null;
  upload: boolean;
  mediaBlobUrl: string | null;
  playerInfo: Partial<PlayerInfoPropType>;
  recordingStartedAt?: Date;
  recordingDuration?: number;
};

const Recorder = () => {
  const locationContext = useLocationStore();
  const [board, setBoard] = useState<BoardType>({
    play: false,
    recording: false,
    error: null,
    upload: false,
    mediaBlobUrl: null,
    playerInfo: {},
  });
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
    {
      video: false,
    }
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (board.recording && board.recordingStartedAt) {
      interval = setInterval(() => {
        const elapsed = DateTime.now().diff(DateTime.fromJSDate(board.recordingStartedAt!), "seconds").seconds;
        setBoard((x) => ({ ...x, recordingDuration: elapsed }));
      }, ms("50ms"));
    }

    return () => clearInterval(interval);
  }, [board.recording, board.recordingStartedAt]);

  const uploadRecordingHandler = async () => {
    try {
      setBoard((x) => ({
        ...x,
        upload: true,
      }));
      const audioBlob = await downloadBlob(mediaBlobUrl!);

      await createPost({
        ...locationContext.coordinate!,
        duration: board.playerInfo.duration!,
        file: new File([audioBlob], "voice.wav"),
      });

      setBoard((x) => ({
        ...x,
        upload: false,
        recordingDuration: undefined,
        mediaBlobUrl: null,
        error: null,
      }));
    } catch (e) {
      setBoard((x) => ({
        ...x,
        error: (e as AxiosError).message,
      }));
    } finally {
      setBoard((x) => ({
        ...x,
        upload: false,
      }));
    }
  };

  const recordingIsValid = () => {
    if (mediaBlobUrl && board.playerInfo.duration && (board.playerInfo.duration < MIN_RECORDING_DURATION || board.playerInfo.duration > MAX_RECORDING_DURATION)) {
      return false;
    }

    return true;
  };

  if (board.upload) {
    return <Spinner />;
  }

  return (
    <Fragment>
      {board.error ? (
        <AlertDismissible
          dismissible={false}
          header="uploading recording failed"
          variant="danger"
          message={board.error}
        />
      ) : null}
      <Row>
        <Col sm={12}>
          {mediaBlobUrl &&
          board.playerInfo.duration &&
          board.playerInfo?.duration < MIN_RECORDING_DURATION ? (
            <AlertDismissible
              dismissible={false}
              header="uploading recording failed"
              variant="danger"
              message={`recording is too short to post (less than ${MIN_RECORDING_DURATION} seconds)`}
            />
          ) : null}
          {mediaBlobUrl &&
          board.playerInfo.duration &&
          board.playerInfo?.duration >= MAX_RECORDING_DURATION ? (
            <AlertDismissible
              dismissible={false}
              header="uploading recording failed"
              variant="danger"
              message={`recording is too long to post (more than ${MAX_RECORDING_DURATION} seconds)`}
            />
          ) : null}
        </Col>
        <Col sm={12}>
          <Container fluid={true} className="px-0">
            <ButtonGroup size="lg">
              {board.recording ? (
                <Button
                  variant="outline-danger"
                  title="stop-recording"
                  onClick={() => {
                    setBoard((board) => ({
                      ...board,
                      recording: false,
                      recordingStartedAt: undefined,
                    }));
                    stopRecording();
                  }}
                >
                  <FontAwesomeIcon icon={faMicrophone} beatFade />
                </Button>
              ) : (
                <Button
                  variant="outline-success"
                  disabled={board.playerInfo.playing || board.upload}
                  title={"start-recording"}
                  onClick={() => {
                    setBoard((board) => ({
                      ...board,
                      recording: true,
                      recordingStartedAt: new Date(),
                    }));
                    startRecording();
                  }}
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                </Button>
              )}
              {mediaBlobUrl ? (
                <Player
                  play={board.play}
                  mediaBlobUrl={mediaBlobUrl}
                  onchange={(info, event) => {
                    setBoard((board) => ({
                      ...board,
                      play: event === "finish" ? false : board.play,
                      playerInfo: {
                        ...board.playerInfo,
                        ...info,
                      },
                    }));
                  }}
                />
              ) : null}
              {mediaBlobUrl ? (
                board.playerInfo.playing ? (
                  <Button
                    variant="outline-secondary"
                    title="pause-recording"
                    disabled={board.recording}
                    onClick={() => setBoard((x) => ({ ...x, play: false }))}
                  >
                    <FontAwesomeIcon icon={faPause} beatFade />
                  </Button>
                ) : (
                  <Button
                    variant="outline-primary"
                    title="play-recording"
                    disabled={board.recording}
                    onClick={() =>
                      setBoard((board) => ({ ...board, play: true }))
                    }
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </Button>
                )
              ) : null}
              {mediaBlobUrl && board.playerInfo.duration ? (
                <Button
                  variant="outline-success"
                  title="share"
                  disabled={!recordingIsValid() || board.upload}
                  onClick={async () => {
                    await uploadRecordingHandler();
                  }}
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </Button>
              ) : null}
            </ButtonGroup>
            { board.recording ? <p>
              {(board.recordingDuration ?? 0).toFixed(2)} seconds
              {(board.recordingDuration ?? 0) >= MAX_RECORDING_DURATION - 5 ? <span className="text-danger ms-2">(max {MAX_RECORDING_DURATION} seconds)</span> : null}
            </p> : (board.playerInfo.duration ?? board.recordingDuration) ? (
              <p>{Number(board.playerInfo.duration ?? board.recordingDuration).toFixed(2)} seconds</p>
            ) : null}
          </Container>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Recorder;
