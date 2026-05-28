import {ComposableMap, ZoomableGroup, Geographies, Geography, Marker} from "react-simple-maps";
import {Coordinate} from "@geo-cast/lib/dto/board/common";
import {useState} from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {faPlus, faMinus, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useMapFocusStore, useThemeStore} from "../../stores";
import _ from "lodash";
import worldCountries from './world-countries.json';

type CoordinateInfoType = Coordinate & { color?: string };

export type MapPropType = {
  coordinates: CoordinateInfoType[]
};

const minZoom = 1;
const maxZoom = 8;
const defaultPosition: { coordinates: [number, number]; zoom: number } = {coordinates: [0, 0], zoom: 1};
const usStatesUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const Map = ({coordinates}: MapPropType) => {
  const [position, setPosition] = useState(defaultPosition);
  const mapFocusContext = useMapFocusStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleZoomIn = () => {
    if (position.zoom >= maxZoom) {
      return;
    }
    setPosition((pos) => ({...pos, zoom: pos.zoom * 2}));
  };

  const handleZoomOut = () => {
    if (position.zoom <= minZoom) {
      return;
    }
    setPosition((pos) => ({...pos, zoom: pos.zoom / 2}));
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number; }) => {
    setPosition(position);
    mapFocusContext.setCoordinate({latitude: position.coordinates[1]!, longitude: position.coordinates[0]!});
  };

  const graphDot = (coordinate: CoordinateInfoType) => {
    const ratio = (maxZoom + 1 - position.zoom) / 2;

    return (<>
      <circle r={ratio * 0.5} fill="darkgrey"/>
      <circle r={ratio} fill={coordinate.color}>
        <animate attributeType="SVG" attributeName="r" begin="0s" dur="1.5s" repeatCount="indefinite" from={0.5}
                 to={ratio}/>
        <animate attributeType="CSS" attributeName="stroke-width" begin="0s" dur="1.5s" repeatCount="indefinite"
                 from={ratio} to={0}/>
        <animate attributeType="CSS" attributeName="opacity" begin="0s" dur="1.5s" repeatCount="indefinite"
                 from={1} to={0}/>
      </circle>
    </>);
  };

  return (
    <div style={{position: 'relative'}}>
      <ComposableMap projection="geoMercator" style={{backgroundColor: isDark ? '#1a2744' : '#d4e6f1'}}>
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          maxZoom={maxZoom}
          minZoom={minZoom}
          color="red">
          <Geographies
            geography={worldCountries}
            fill={isDark ? '#4a6274' : 'lightgrey'}
            stroke={isDark ? '#7fb3d3' : 'DarkMagenta'}>
            {({geographies}) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} style={{
                  default: {outline: "none"},
                  hover: {outline: "none"},
                  pressed: {outline: "none"},
                }}/>
              ))
            }
          </Geographies>
          <Geographies
            geography={usStatesUrl}
            fill="none"
            stroke={isDark ? '#7fb3d3' : 'DarkMagenta'}
            strokeWidth={0.4}>
            {({geographies}) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} style={{
                  default: {outline: "none"},
                  hover: {outline: "none"},
                  pressed: {outline: "none"},
                }}/>
              ))
            }
          </Geographies>
          {
            coordinates.map((coordinate, index) => <Marker
              coordinates={[coordinate.longitude, coordinate.latitude]}
              key={index}>
              {graphDot(coordinate)}
            </Marker>)
          }
        </ZoomableGroup>
      </ComposableMap>
      <div style={{position: 'absolute', bottom: '0.5rem', left: '0.5rem'}}>
        <ButtonGroup aria-label="manual zoom">
          <Button onClick={handleZoomIn} variant="outline-secondary" disabled={position.zoom === maxZoom}
                  title="zoom-in">
            <FontAwesomeIcon icon={faPlus}/>
          </Button>
          <Button onClick={handleZoomOut} variant="outline-secondary" disabled={position.zoom === minZoom}
                  title="zoom-out">
            <FontAwesomeIcon icon={faMinus}/>
          </Button>
          <Button
            onClick={() => {
              setPosition(defaultPosition);
              mapFocusContext.clearCoordinates();
            }} variant="outline-secondary"
            disabled={!mapFocusContext.coordinate && _.eq(defaultPosition, position)}
            title="clear-map-coordinate">
            <FontAwesomeIcon icon={faRotateLeft}/>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Map;
