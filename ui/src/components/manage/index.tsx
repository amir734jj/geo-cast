import { EntityType, UserType } from "@geo-cast/lib/dto/account";
import { useEffect, useState } from "react";
import { getUsers, setUserActive as setUserActiveAction } from "../../actions";
import { Button, Table } from "react-bootstrap";
import {useAuthStore} from "../../stores";
import { Spinner } from "../common";

const Manage = () => {
  const authContext = useAuthStore();

  const [users, setUsers] = useState<(EntityType & UserType)[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = () => getUsers()
    .then(response => {
      setUsers(response.data);
    })
    .finally(() => setLoading(false));

  const setUserActive = async (user: EntityType, active: boolean) => {
    await setUserActiveAction(user, active);
    await refreshUsers();
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return <div className="mt-3">
    <Table bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => <tr key={index}>
          <td>
            <a href={`/profile/${user.id}`}>{user.name}</a>
          </td>
          <td>{user.email}</td>
          <td>{user.roles.map(x => x.name).join(",")}</td>
          <td>
            {user.active ?
              <Button variant="danger" onClick={() => setUserActive(user, false)} disabled={authContext.auth?.id === user.id}>Disable</Button> :
              <Button variant="success" onClick={() => setUserActive(user, true)} disabled={authContext.auth?.id === user.id}>Enable</Button>}
          </td>
        </tr>)}
      </tbody>
    </Table>
  </div>;
};

export default Manage;
