import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { updateProfile as updateProfileAction } from '../../actions';
import { AlertDismissible, Spinner } from '../common/index';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileType } from '@geo-cast/lib/dto/account/profile.account';
import useAuthStore from '../../stores/auth.store';
import _ from 'lodash';
import { AxiosError } from 'axios';

type ProfilePropType = {
  profile: ProfileType,
  updateProfileHandler: (arg: ProfileType) => void;
};

const schema = yup.object({
  name: yup
    .string()
    .min(3, "must be at least 3 characters long")
    .max(20, "must be at most 20 characters long")
    .required(),
  location: yup
    .string()
    .min(3, "must be at least 3 characters long")
    .max(50, "must be at most 20 characters long")
    .required(),
}).required();

const ProfileForm = (arg: ProfilePropType) => {
  const { register: formRegister, handleSubmit, formState: { errors, isValid } } = useForm<ProfileType>({
    defaultValues: arg.profile,
    resolver: yupResolver(schema)
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setValidated(isValid);
  }, [errors, isValid]);

  return (
    <Form onSubmit={handleSubmit(arg.updateProfileHandler)} className="pure-form pure-form-aligned" validated={validated}>
      <FormGroup className='mb-3' controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          className="form-control"
          isInvalid={!!errors.name}
          {...formRegister("name")}
        />
        {errors.name ? <Form.Control.Feedback type="invalid">{errors.name.message}</Form.Control.Feedback> : null}
      </FormGroup>
      <FormGroup className='mb-3' controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control
          className="form-control"
          isInvalid={!!errors.location}
          {...formRegister("location")}
        />
        {errors.location ? <Form.Control.Feedback type="invalid">{errors.location.message}</Form.Control.Feedback> : null}
      </FormGroup>
      <Button variant="primary" type="submit">Update</Button>
    </Form>
  );
};

const Profile = () => {
  const authContext = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const updateProfileHandler = async (arg: ProfileType) => {
    try {
      setUpdating(true);
      const { data: user } = await updateProfileAction(arg);
      authContext.setUser(user);
    } catch (e) {
      setError((e as AxiosError).message);
    } finally {
      setUpdating(false);
    }
  }

  if (updating) {
    return <Spinner />
  }

  return (
    <>
      {error ? <AlertDismissible header='updating profile failed' variant='danger' message={error} /> : null}
      <ProfileForm {...{ profile: _.pick(authContext.auth!, ['name', 'location']) as ProfileType, updateProfileHandler }} />
    </>
  );
}

export default Profile;
