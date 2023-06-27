import {ComposableMap, ZoomableGroup, Geographies, Geography, Marker} from "react-simple-maps";
import {Coordinate} from "@geo-cast/lib/dto/board/common";
import {useState} from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import {faPlus, faMinus, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useMapFocusStore} from "../../stores";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";


type CoordinateInfoType = Coordinate & { color?: string };

export type MapPropType = {
  coordinates: CoordinateInfoType[]
};

const Map = ({coordinates}: MapPropType) => {
  const [position, setPosition] = useState({coordinates: [0, 0], zoom: 1});
  const mapFocusContext = useMapFocusStore();

  const handleZoomIn = () => {
    if (position.zoom >= 5) return;
    setPosition((pos) => ({...pos, zoom: pos.zoom * 2}));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({...pos, zoom: pos.zoom / 2}));
  };

  const handleMoveEnd = (position: { coordinates: number[]; zoom: number; }) => {
    setPosition(position);
    mapFocusContext.setCoordinate({latitude: position.coordinates[1]!, longitude: position.coordinates[0]!});
  };

  return (
    <div>
      <ComposableMap projection="geoMercator">
        <ZoomableGroup
          zoom={position.zoom}
          // @ts-ignore
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
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
              <circle r={3} fill="darkgrey"/>
              <circle r="15%" fill={coordinate.color}>
                <animate attributeType="SVG" attributeName="r" begin="0s" dur="1.5s" repeatCount="indefinite" from="1%"
                         to="3%"/>
                <animate attributeType="CSS" attributeName="stroke-width" begin="0s" dur="1.5s" repeatCount="indefinite"
                         from="3%" to="0%"/>
                <animate attributeType="CSS" attributeName="opacity" begin="0s" dur="1.5s" repeatCount="indefinite"
                         from="1" to="0"/>
              </circle>
            </Marker>)
          }
        </ZoomableGroup>
      </ComposableMap>
      <div className="mt-3">
        <ButtonGroup aria-label="manual zoom">
          <Button onClick={handleZoomIn} variant="outline-secondary" disabled={position.zoom === 4} title="zoom in">
            <FontAwesomeIcon icon={faPlus}/>
          </Button>
          <Button onClick={handleZoomOut} variant="outline-secondary" disabled={position.zoom === 1} title="zoom out">
            <FontAwesomeIcon icon={faMinus}/>
          </Button>
          <Button onClick={() => mapFocusContext.clearCoordinates()} variant="outline-secondary"
                  disabled={!!mapFocusContext.coordinate} title="clear map coordinate">
            <FontAwesomeIcon icon={faRotateLeft}/>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Map;
