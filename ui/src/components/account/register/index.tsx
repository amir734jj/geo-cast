import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormGroup } from 'react-bootstrap';
import { RegisterType } from "@geo-cast/lib/dto/account";
import { register as registerAction } from "../../../actions";
import { useNavigate } from "react-router-dom";
import { AlertDismissible, SimpleButton, Spinner } from '../../common';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '@geo-cast/lib/constants';

type RegisterFormPropType = {
  registerHandler: (arg: RegisterType) => void;
  loading: boolean;
};

const schema = yup.object({
  name: yup
    .string()
    .min(NAME_MIN_LENGTH, `must be at least ${NAME_MIN_LENGTH} characters long`)
    .max(NAME_MAX_LENGTH, `must be at most ${NAME_MAX_LENGTH} characters long`)
    .required(),
  email: yup
    .string()
    .email("must be a valid email")
    .required(),
  password: yup
    .string()
    .min(PASSWORD_MIN_LENGTH, `must be at least ${PASSWORD_MIN_LENGTH} characters long`)
    .max(PASSWORD_MAX_LENGTH, `must be at most ${PASSWORD_MAX_LENGTH} characters long`)
    .required(),
}).required();

type SchemaType = yup.InferType<typeof schema> & RegisterType;

const RegisterForm = ({ registerHandler, loading }: RegisterFormPropType) => {
  const { register: formRegister, handleSubmit, formState: { errors, isValid } } = useForm<SchemaType>({
    resolver: yupResolver(schema)
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setValidated(isValid);
  }, [errors, isValid]);

  return (
    <Form onSubmit={handleSubmit(registerHandler)} className="pure-form pure-form-aligned" validated={validated}>
      <FormGroup className='mb-3' controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          className="form-control"
          isInvalid={!!errors.name}
          {...formRegister("name")}
        />
        <Form.Text className="text-muted">
          Name has to be at least 3 characters long
        </Form.Text>
        {errors.name ? <Form.Control.Feedback type="invalid">{errors.name.message}</Form.Control.Feedback> : null}
      </FormGroup>
      <FormGroup className='mb-3' controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          className="form-control"
          isInvalid={!!errors.email}
          {...formRegister("email")}
        />
        <Form.Text className="text-muted">
          We will never share your email with anyone else.
        </Form.Text>
        {errors.email ? <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback> : null}
      </FormGroup>
      <FormGroup className='mb-3' controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          className="form-control"
          isInvalid={!!errors.password}
          type="password"
          {...formRegister("password")}
        />
        <Form.Text className="text-muted">
          Password has to be between 8 to 30 characters long
        </Form.Text>
        {errors.password ? <Form.Control.Feedback type="invalid">{errors.password.message}</Form.Control.Feedback> : null}
      </FormGroup>
      <SimpleButton type="submit" loading={loading}>Submit</SimpleButton>
    </Form>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerHandler = async (arg: RegisterType) => {
    setLoading(true);
    try {
      await registerAction(arg);
      setRegistered(true);
      navigate("/login");
    } catch (e) {
      setError((e as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return <Spinner />;
  }

  return <div className="mt-3 px-2">
    {error ? <AlertDismissible header='registering failed' variant='danger' message={error} /> : null}
    <RegisterForm registerHandler={registerHandler} loading={loading} />
  </div>;
};

export default Register;
