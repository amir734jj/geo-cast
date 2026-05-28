import {useEffect, useState} from 'react';
import {Table, Container} from 'react-bootstrap';
import {getStats} from '../../actions/board.action';
import {Spinner} from '../common';
import worldCountries from '../map/world-countries.json';

type CountryStat = { country: string; count: number };

const pointInPolygon = (point: [number, number], polygon: number[][]) => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

const getCountryForCoordinate = (lng: number, lat: number): string => {
  for (const feature of (worldCountries as any).features) {
    const geom = feature.geometry;
    const rings = geom.type === 'MultiPolygon'
      ? geom.coordinates.flat()
      : geom.coordinates;
    for (const ring of rings) {
      if (pointInPolygon([lng, lat], ring)) {
        return feature.properties.name;
      }
    }
  }
  return 'Unknown';
};

const Stats = () => {
  const [stats, setStats] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getStats()
      .then(({data}) => {
        const countryMap = new Map<string, number>();
        for (const {latitude, longitude} of data) {
          const country = getCountryForCoordinate(longitude, latitude);
          countryMap.set(country, (countryMap.get(country) || 0) + 1);
        }
        const sorted = Array.from(countryMap.entries())
          .map(([country, count]) => ({country, count}))
          .sort((a, b) => b.count - a.count);
        setStats(sorted);
        setTotal(data.length);
      })
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="mt-3">
      <h3>Recording Statistics</h3>
      <p className="text-muted">Total recordings: {total}</p>
      {stats.length === 0 ? (
        <p>No recordings yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Recordings</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, i) => (
              <tr key={stat.country}>
                <td>{i + 1}</td>
                <td>{stat.country}</td>
                <td>{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Stats;
