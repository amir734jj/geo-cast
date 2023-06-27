import React, { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import _ from "lodash";

export type PlayerControlsPropType = {
  play: () => Promise<void>,
  pause: () => Promise<void>
};

export type PlayerInfoPropType = {
  playing: boolean,
  duration: number
};

export type PlayerPropType = {
  mediaBlobUrl: string,
  render: (info: PlayerControlsPropType & PlayerInfoPropType) => React.JSX.Element,
  onchange?: (info: PlayerInfoPropType) => void
};

const Player = ({ mediaBlobUrl, render, onchange = () => ({}) }: PlayerPropType) => {

  const playerDomId = _.uniqueId("player-container");
  const [player, setPlayer] = useState<WaveSurfer | null>(null);
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

  useEffect(() => {
    onchange({ duration, playing });
  }, [duration, playing]);

  return <>
    <div id={playerDomId} style={{ display: 'none' }}>player</div>
    {playerReady ? render({
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
      duration,
      playing
    }) : null}
  </>;
};

export default Player;
