import { useForm } from 'react-hook-form';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { useAuthStore } from "../../../stores";
import { useEffect, useState } from "react";
import { LoginType } from "@geo-cast/lib/dto/account";
import { login as LoginAction, accountInfo as accountInfoAction } from '../../../actions';
import { useNavigate } from "react-router-dom";
import { AlertDismissible, Spinner } from '../../common';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';

type LoginFormPropType = {
  loginHandler: (arg: LoginType) => void
};

const schema = yup.object({
  email: yup
    .string()
    .email("must be a valid email")
    .required(),
  password: yup
    .string()
    .min(8, "must be at least 8 characters long")
    .max(30, "must be at most 30 characters long")
    .required(),
}).required();

type SchemaType = yup.InferType<typeof schema> & LoginType;

const LoginForm = ({ loginHandler }: LoginFormPropType) => {
  const { register: formRegister, handleSubmit, formState: { errors, isValid } } = useForm<SchemaType>({
    resolver: yupResolver(schema)
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setValidated(isValid);
  }, [errors, isValid]);

  return (
    <Form onSubmit={handleSubmit(loginHandler)} className="pure-form pure-form-aligned" validated={validated}>
      <FormGroup className='mb-3' controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          className="form-control"
          type="email"
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
      <Button variant="primary" type="submit">Submit</Button>
    </Form>
  );
};

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const authContext = useAuthStore();
  const navigate = useNavigate();

  const loginHandler = async (arg: LoginType) => {
    try {
      const { data: token } = await LoginAction(arg);
      authContext.setToken(token);
      const { data: user } = await accountInfoAction();
      authContext.setUser(user);
      setLoggedIn(true);
      navigate("/");
    } catch (e) {
      setError((e as AxiosError).message);
    }
  }

  if (loggedIn) {
    return <Spinner />
  }

  return <>
    {error ? <AlertDismissible header='logging in failed' variant='danger' message={error} /> : null}
    <LoginForm loginHandler={loginHandler} />
  </>;
}

export default Login;
