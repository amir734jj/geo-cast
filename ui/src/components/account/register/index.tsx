import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { register as registerAction } from '../../actions';
import { AlertDismissible } from '../common';
import useAuthStore from "../../../stores/auth.store.ts";
import {LoginType, UserType} from "../../../../../lib/dtos/account";
import {register as registerAction} from "../../../actions";
import {redirect} from "react-router-dom";

const RegisterForm = ({ registerHandler }) => {
  const { register: formRegister, handleSubmit, watch, formState: { errors } } = useForm<UserType>();
  formState.er
  return (
    <div className="mt-3">
      <Form onSubmit={handleSubmit(registerHandler)} className="pure-form pure-form-aligned">
        <FormGroup>
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            id="name"
            className="form-control"
            {...formRegister("name", { required: true, maxLength: 20 })}
          />
          {errors.name && <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>}
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            id="email"
            className="form-control"
            {...formRegister("email", { required: true, maxLength: 20 })}
          />
          {errors.email && <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>}
        </FormGroup>
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
        <FormGroup>
          <Form.Label htmlFor="passwordConfirmation">Password Confirmation</Form.Label>
          <Form.Control
            id="password"
            className="form-control"
            {...formRegister("password", { required: true, maxLength: 20 })}
          />
          {errors.passwordConfirmation && <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>}
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

const Register = () => {
  const [registered, setRegistered] = useState(false);

  const registerHandler = async (arg: UserType) => {
    await registerAction(arg);
    setRegistered(true);
  }

  if (registered) {
    return redirect("/login");
  }

  return <RegisterForm registerHandler={registerHandler} />;
}

export default Register;
