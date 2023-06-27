import {useEffect, useState} from "react";
import Player, {PlayerPropType} from "../player";

const LazyPlayer = (props: PlayerPropType) => {

  const [playRequested, setPlayRequested] = useState(false);

  const renderProxy = {
    play: async () => {
      setPlayRequested(true);
    },
    pause: async () => {
    },
    playing: false,
    duration: 0
  };

  return <>
    {playRequested ? <Player {...props} render={controls => {
      useEffect(() => {
        controls.play();
      }, []);
      return props.render(controls);
    }} /> : null}
    {props.render(renderProxy)}
  </>;
};

export default LazyPlayer;
