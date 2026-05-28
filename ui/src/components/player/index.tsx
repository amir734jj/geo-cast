import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import _ from "lodash";

export type PlayerInfoPropType = {
  playing: boolean,
  duration: number,
  currentTime: number,
};

export type EventType = 'ready' | 'pause' | 'finish' | 'play' | 'timeupdate';

export type PlayerPropType = {
  play: boolean,
  repeat?: boolean,
  mediaBlobUrl: string,
  onchange?: (info: Partial<PlayerInfoPropType>, event: EventType) => void,
  showWaveform?: boolean,
  waveformHeight?: number,
};

const Player = ({ mediaBlobUrl, onchange = () => {}, play, showWaveform = false, waveformHeight = 32 }: PlayerPropType) => {

  const playerDomId = useRef(_.uniqueId("player-container"));
  const [playerCtrl, setPlayerCtrl] = useState<WaveSurfer | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: `#${playerDomId.current}`,
      url: mediaBlobUrl,
      height: waveformHeight,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      cursorWidth: 1,
      waveColor: '#6c757d',
      progressColor: '#0d6efd',
      cursorColor: '#0d6efd',
    });

    wavesurfer.on('ready', () => {
      setPlayerReady(true);
      onchange({ duration: wavesurfer.getDuration(), playing: false }, 'ready');
    });

    wavesurfer.on('play', () => {
      setPlaying(true);
      onchange({ playing: true }, 'play');
    });

    wavesurfer.on('pause', () => {
      setPlaying(false);
      onchange({ playing: false }, 'pause');
    });

    wavesurfer.on('finish', () => {
      setPlaying(false);
      onchange({ playing: false, currentTime: 0 }, 'finish');
    });

    wavesurfer.on('timeupdate', (time: number) => {
      onchange({ currentTime: time }, 'timeupdate');
    });

    setPlayerCtrl(wavesurfer);

    return () =>  {
      wavesurfer.destroy();
    };
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (playerReady && playerCtrl) {
      if (play) {
        if (!playing) {
          playerCtrl.play();
        }
      } else if (playing) {
        playerCtrl.pause();
      }
    }
  }, [play, playerReady, playing, playerCtrl]);

  return <div id={playerDomId.current} style={showWaveform ? { marginBottom: '0.25rem' } : { display: 'none' }} />;
};

export default Player;
