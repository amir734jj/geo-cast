import { useForm } from 'react-hook-form';
import { Button, Form, FormGroup } from 'react-bootstrap';
import useAuthStore from "../../../stores/auth.store";
import {useState} from "react";
import {LoginType} from "../../../../../lib/dtos/account";
import { login as LoginAction, accountInfo as accountInfoAction } from '../../../actions';
import {redirect} from "react-router-dom";

type LoginFormPropType = {
  loginHandler: (arg: LoginType) => void
};

const LoginForm = ({ loginHandler }: LoginFormPropType) => {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<LoginType>();

  return (
    <Form onSubmit={handleSubmit(loginHandler)} className="pure-form pure-form-aligned">
      <FormGroup>
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          id="username"
          className="form-control"
          {...formRegister("username", { required: true, maxLength: 20 })}
        />
        {errors.username && <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>}
      </FormGroup>
      <FormGroup>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          id="password"
          className="form-control"
          {...formRegister("password", { required: true, maxLength: 20 })}
        />
        {errors.password && <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>}
      </FormGroup>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const authContext = useAuthStore();

  const loginHandler = async (arg: LoginType) => {
    const {data: token} = await LoginAction(arg);
    authContext.setToken(token);
    const {data: user} = await accountInfoAction();
    authContext.login(user);
    setLoggedIn(true);
  }

  if (loggedIn) {
    return redirect("/");
  }

  return <LoginForm loginHandler={loginHandler} />;
}

export default Login;
