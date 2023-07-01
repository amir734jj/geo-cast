import {ComposableMap, ZoomableGroup, Geographies, Geography, Marker} from "react-simple-maps";
import {Coordinate} from "@geo-cast/lib/dto/board/common";
import {useState} from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {faPlus, faMinus, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useMapFocusStore} from "../../stores";
import _ from "lodash";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";


type CoordinateInfoType = Coordinate & { color?: string };

export type MapPropType = {
  coordinates: CoordinateInfoType[]
};

const minZoom = 1;
const maxZoom = 8;
const defaultPosition = {coordinates: [0, 0], zoom: 1};

const Map = ({coordinates}: MapPropType) => {
  const [position, setPosition] = useState(defaultPosition);
  const mapFocusContext = useMapFocusStore();

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

  const handleMoveEnd = (position: { coordinates: number[]; zoom: number; }) => {
    setPosition(position);
    mapFocusContext.setCoordinate({latitude: position.coordinates[1]!, longitude: position.coordinates[0]!});
  };

  const graphDot = (coordinate: CoordinateInfoType) => {
    const ratio = maxZoom + 1 - position.zoom;

    return (<>
      <circle r={ratio} fill="darkgrey"/>
      <circle r={3 * ratio} fill={coordinate.color}>
        <animate attributeType="SVG" attributeName="r" begin="0s" dur="1.5s" repeatCount="indefinite" from={1}
                 to={3 * ratio}/>
        <animate attributeType="CSS" attributeName="stroke-width" begin="0s" dur="1.5s" repeatCount="indefinite"
                 from={3 * ratio} to={0}/>
        <animate attributeType="CSS" attributeName="opacity" begin="0s" dur="1.5s" repeatCount="indefinite"
                 from={3 * ratio} to={0}/>
      </circle>
    </>);
  }

  return (
    <div>
      <ComposableMap projection="geoMercator">
        <ZoomableGroup
          zoom={position.zoom}
          // @ts-ignore
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          maxZoom={maxZoom}
          minZoom={minZoom}
          color="red">
          <Geographies
            geography={geoUrl}
            fill="lightgrey"
            stroke="DarkMagenta">
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
      <div className="mt-3">
        <ButtonGroup aria-label="manual zoom">
          <Button onClick={handleZoomIn} variant="outline-secondary" disabled={position.zoom === maxZoom}
                  title="zoom in">
            <FontAwesomeIcon icon={faPlus}/>
          </Button>
          <Button onClick={handleZoomOut} variant="outline-secondary" disabled={position.zoom === minZoom}
                  title="zoom out">
            <FontAwesomeIcon icon={faMinus}/>
          </Button>
          <Button
            onClick={() => {
              setPosition(defaultPosition);
              mapFocusContext.clearCoordinates()
            }} variant="outline-secondary"
            disabled={!mapFocusContext.coordinate && _.eq(defaultPosition, position)}
            title="clear map coordinate">
            <FontAwesomeIcon icon={faRotateLeft}/>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Map;
