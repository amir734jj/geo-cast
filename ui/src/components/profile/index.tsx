import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { updateProfile as updateProfileAction } from '../../actions';
import { AlertDismissible, Spinner } from '../common/index';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileType } from '@geo-cast/lib/dto/account/profile.account';
import { useAuthStore } from "../../stores";
import _ from 'lodash';
import { AxiosError } from 'axios';
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH, DESCRIPTION_MAX_LENGTH } from '@geo-cast/lib/constants';

const schema = yup.object({
  name: yup
    .string()
    .min(NAME_MIN_LENGTH, `must be at least ${NAME_MIN_LENGTH} characters long`)
    .max(NAME_MAX_LENGTH, `must be at most ${NAME_MAX_LENGTH} characters long`)
    .required(),
  description: yup
    .string()
    .max(DESCRIPTION_MAX_LENGTH, `should have maximum of ${DESCRIPTION_MAX_LENGTH} characters long`)
    .notRequired(),
}).required();

type SchemaType = yup.InferType<typeof schema>;

type ProfilePropType = {
  profile: ProfileType,
  updateProfileHandler: (arg: SchemaType) => void;
};

const ProfileForm = (arg: ProfilePropType) => {
  const { register: formRegister, handleSubmit, formState: { errors, isValid } } = useForm<SchemaType>({
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
        <Form.Text className="text-muted">
          This name is public.
        </Form.Text>
        {errors.name ? <Form.Control.Feedback type="invalid">{errors.name.message}</Form.Control.Feedback> : null}
      </FormGroup>
      <FormGroup className='mb-3' controlId="location">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className="form-control"
          isInvalid={!!errors.description}
          {...formRegister("description")}
        />
        <Form.Text className="text-muted">
          Public profile bio.
        </Form.Text>
        {errors.description ? <Form.Control.Feedback type="invalid">{errors.description.message}</Form.Control.Feedback> : null}
      </FormGroup>
      <Button variant="primary" type="submit">Update</Button>
    </Form>
  );
};

const Profile = () => {
  const authContext = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const updateProfileHandler = async (arg: SchemaType) => {
    try {
      setUpdating(true);
      const { data: user } = await updateProfileAction(arg as ProfileType);
      authContext.setUser(user);
    } catch (e) {
      setError((e as AxiosError).message);
    } finally {
      setUpdating(false);
    }
  };

  if (updating) {
    return <Spinner />;
  }

  return (
    <div className="mt-3 px-2">
      {error ? <AlertDismissible header='updating profile failed' variant='danger' message={error} /> : null}
      <ProfileForm {...{ profile: _.pick(authContext.auth!, ['name', 'description']) as ProfileType, updateProfileHandler }} />
    </div>
  );
};

export default Profile;
