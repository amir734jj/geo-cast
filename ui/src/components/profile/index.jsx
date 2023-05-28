import React from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { accountInfo, getProfile, updateProfile as updateProfileAction } from '../../actions';
import { AlertDismissible } from '../common/index.js';

const ProfileForm = ({
  name, email, username, updateProfile,
}) => {
  const { register: formRegister, handleSubmit, errors } = useForm({
    defaultValues: { name, email, username },
  });

  return (
    <Form onSubmit={handleSubmit(updateProfile)} className="pure-form pure-form-aligned">
      <FormGroup>
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
          name="name"
          type="text"
          className="form-control"
          id="name"
          isInvalid={errors.name}
          ref={formRegister({ required: true })}
        />
        {errors.name && <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>}
      </FormGroup>
      <FormGroup>
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          name="email"
          type="email"
          className="form-control"
          id="email"
          isInvalid={errors.email}
          ref={formRegister({ required: true })}
          disabled
        />
      </FormGroup>
      <FormGroup>
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          className="form-control"
          id="username"
          isInvalid={errors.username}
          ref={formRegister({ required: true })}
          disabled
        />
      </FormGroup>
      <Button type="primary">Update</Button>
    </Form>
  );
};

const Profile = () => {
  useEffect(() => {
    fetchUsers().then((users) => setUsers(users));
  }, []);

  return (
    <div>
      {this.props.error ? <AlertDismissible header="Login Failed" message={this.props.error.join('\n')} variant="danger" /> : null}
      <h3>
        Profile
      </h3>

      {this.props.username ? <ProfileForm {...this.props} /> : null}
    </div>
  );
}

export class Index extends React.Component {
  componentDidMount() {
    this.props.getProfile().then();
  }

  render() {

  }
}

const mapStateToProps = ({ profile }) => ({
  ...profile,
});

const mapDispatchToProps = (dispatch) => ({
  getProfile: () => dispatch(getProfile()),
  updateProfile: async (profile) => {
    await dispatch(updateProfileAction(profile));
    await dispatch(accountInfo());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
