import { ComposableMap, ZoomableGroup, Geographies, Geography, Marker } from "react-simple-maps";
import { CoordinateType } from "../../types";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";


type CoordinateInfoType = CoordinateType & { color?: string };

export type MapPropType = {
  coordinates: CoordinateInfoType[]
};

const Map = ({ coordinates }: MapPropType) => {

  return (
    <ComposableMap projection="geoMercator">
      <ZoomableGroup center={[0, 0]} zoom={1} color="red">
        <Geographies
          geography={geoUrl}
          fill="lightgrey"
          stroke="DarkMagenta">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} style={{
                default: { outline: "none" },
                hover: { outline: "none" },
                pressed: { outline: "none" },
              }} />
            ))
          }
        </Geographies>
        {
          coordinates.map((coordinate, index) => <Marker coordinates={[coordinate.longitude, coordinate.latitude]} key={index}>
            <circle r={3} fill="darkgrey" />
            <circle r="15%" fill="#f70d1a">
              <animate attributeType="SVG" attributeName="r" begin="0s" dur="1.5s" repeatCount="indefinite" from="1%" to="3%" />
              <animate attributeType="CSS" attributeName="stroke-width" begin="0s" dur="1.5s" repeatCount="indefinite" from="3%" to="0%" />
              <animate attributeType="CSS" attributeName="opacity" begin="0s" dur="1.5s" repeatCount="indefinite" from="1" to="0" />
            </circle>
          </Marker>)
        }
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default Map;