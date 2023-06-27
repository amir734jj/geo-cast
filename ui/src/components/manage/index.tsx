import {UserType} from "@geo-cast/lib/dto/account";
import {useEffect, useState} from "react";
import {getUsers} from "../../actions";
import {Button, Table} from "react-bootstrap";

const Manage = () => {

  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    getUsers()
      .then(response => {
        setUsers(response.data);
      });
  }, [])

  return <div className="mt-3">
    <Table bordered hover>
      <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Roles</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {users.map((user, index) => <tr key={index}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.roles.map(x => x.name).join(",")}</td>
        <td>{user.description}</td>
        <td>
          <Button>admin</Button>
        </td>
      </tr>)}
      </tbody>
    </Table>
  </div>;
};

export default Manage;
