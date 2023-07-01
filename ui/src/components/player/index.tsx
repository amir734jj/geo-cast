import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import _ from "lodash";

export type PlayerInfoPropType = {
  playing: boolean,
  duration: number
};

type EventType = 'ready' | 'pause' | 'finish' | 'play';

export type PlayerPropType = {
  play: boolean,
  repeat?: boolean,
  mediaBlobUrl: string,
  onchange?: (info: PlayerInfoPropType, event: EventType) => void
};

const Player = ({ mediaBlobUrl, onchange = () => {}, play }: PlayerPropType) => {

  const playerDomId = _.uniqueId("player-container");
  const [playerCtrl, setPlayerCtrlCtrl] = useState<WaveSurfer | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: `#${playerDomId}`
    });

    wavesurfer.load(mediaBlobUrl);

    wavesurfer.on('ready', () => {
      setPlayerReady(true);
      setDuration(wavesurfer.getDuration());
      onchange({ duration: wavesurfer.getDuration(), playing: false }, 'ready');
    });

    wavesurfer.on('play', () => {
      setPlaying(true);
      onchange({ duration, playing: true }, 'play');
    });

    wavesurfer.on('pause', () => {
      setPlaying(false);
      onchange({ duration, playing: false }, 'pause');
    });

    wavesurfer.on('finish', () => {
      setPlaying(false);
      onchange({ duration, playing: false }, 'finish');
    });

    setPlayerCtrlCtrl(wavesurfer);

    return () => wavesurfer.destroy();
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (playerReady && playerCtrl) {
      if (play) {
        playerCtrl.play();
      } else {
        if (playing) {
          playerCtrl.pause();
        }
      }
    }
  }, [play, playerReady, playing]);

  return <>
    <div id={playerDomId} style={{ display: 'none' }}>player</div>
  </>;
};

export default Player;
