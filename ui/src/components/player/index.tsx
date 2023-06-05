import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import _ from "lodash";

export type PlayerInfoPropType = {
  play: () => Promise<void>,
  pause: () => Promise<void>,
  playing: boolean,
  duration: number
};

export type PlayerPropType = {
  mediaBlobUrl: string,
  render: (info: PlayerInfoPropType) => JSX.Element
};

const Player = ({ mediaBlobUrl, render }: PlayerPropType) => {

  const playerDomId = _.uniqueId("player-container");
  const [player, setPlayer] = useState<WaveSurfer | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    var wavesurfer = WaveSurfer.create({
      container: `#${playerDomId}`
    });

    wavesurfer.load(mediaBlobUrl);

    wavesurfer.on('ready', () => {
      setPlayerReady(true);
      setDuration(wavesurfer.getDuration());
    });

    wavesurfer.on('play', () => {
      setPlaying(true);
    });

    wavesurfer.on('paused', () => {
      setPlaying(false);
    });

    wavesurfer.on('finish', () => {
      setPlaying(false);
    });

    setPlayer(wavesurfer);

    return () => wavesurfer.destroy();
  }, [mediaBlobUrl]);

  return <>
    <div id={playerDomId} style={{ display: 'none' }}>player</div>
    {render({
      play: async () => {
        if (playerReady && player) {
          await player?.play();
        }
      },
      pause: async () => {
        if (playerReady && player) {
          await player?.play();
        }
      },
      playing,
      duration,
    })}
  </>;
};

export default Player;