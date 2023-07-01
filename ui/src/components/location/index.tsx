import { useGeolocated } from "react-geolocated";
import { useEffect } from "react";
import {Coordinate} from "@geo-cast/lib/dto/board/common";

export type LocationPropType = {
  onload: (l: Coordinate) => void,
  onNotAvailable: () => void,
  onNotSupported: () => void
}

const Location = ({ onload, onNotAvailable, onNotSupported }: LocationPropType) => {

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (isGeolocationAvailable && coords) {
      onload({ latitude: coords.latitude!, longitude: coords!.longitude! });
    } else if (!isGeolocationAvailable) {
      onNotAvailable();
    } else if (!isGeolocationEnabled) {
      onNotSupported();
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  return <div style={{ display: "none"}}>location</div>;
};

export default Location;
