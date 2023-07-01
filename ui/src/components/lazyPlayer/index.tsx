import {useEffect, useState} from "react";
import Player, {PlayerPropType} from "../player";

const LazyPlayer = (props: PlayerPropType & { play?: boolean }) => {

  const [playRequested, setPlayRequested] = useState(false);

  useEffect(() => {
    if (props.play && !playRequested) {
      setPlayRequested(true);
    }
  }, [props.play])

  return <>
    {playRequested ? <Player {...props} /> : null}
  </>;
};

export default LazyPlayer;
