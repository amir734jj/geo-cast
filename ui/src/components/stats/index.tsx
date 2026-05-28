import {useEffect, useState} from 'react';
import {Table, Container} from 'react-bootstrap';
import {getStats} from '../../actions/board.action';
import {Spinner} from '../common';

type CountryStat = { country: string; count: number };

const Stats = () => {
  const [stats, setStats] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getStats()
      .then(({data}) => {
        setStats(data);
        setTotal(data.reduce((sum, s) => sum + s.count, 0));
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
