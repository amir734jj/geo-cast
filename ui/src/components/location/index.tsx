import { Spinner } from "react-bootstrap";
import { useGeolocated } from "react-geolocated";
import { CoordinateType } from "../../types";
import { useEffect } from "react";
import React from "react";

export type LocationPropType = {
  render: () => React.JSX.Element,
  onload: (l: CoordinateType) => void,
  onNotAvailable: () => React.JSX.Element,
  onNotSupported: () => React.JSX.Element
}

const Location = ({ render, onload, onNotAvailable, onNotSupported }: LocationPropType) => {

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (isGeolocationAvailable && coords) {
      onload({ latitude: coords?.latitude!, longitude: coords?.longitude! });
    }
  }, [coords]);

  if (!isGeolocationAvailable) {
    return onNotAvailable();
  } else if (!isGeolocationEnabled) {
    return onNotSupported();
  } else if (!coords) {
    return <Spinner />;
  } else {
    return render();
  }
};

export default Location;