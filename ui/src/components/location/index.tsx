import { Spinner } from "react-bootstrap";
import { AlertDismissible } from "../common";
import { useGeolocated } from "react-geolocated";
import { ReactChildrenArg } from "../../types";
import { Container } from "react-bootstrap";
import { useLocationStore } from "../../stores";
import { useEffect } from "react";

const Location = ({ children }: ReactChildrenArg) => {
  const locationContext = useLocationStore();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (isGeolocationAvailable && coords) {
      locationContext.setCoordinate({ latitude: coords?.latitude!, longitude: coords?.longitude! })
    }
  }, [coords])

  return (!isGeolocationAvailable ? (
    <AlertDismissible variant="danger" header="recording not possible" message="Your browser does not support Geolocation." />
  ) : !isGeolocationEnabled ? (
    <AlertDismissible variant="danger" header="recording not possible" message="Geolocation is not enabled. Please try again by refreshing the page." />
  ) : coords ? <Container>{children}</Container> : (
    <Spinner />
  ));
};

export default Location;