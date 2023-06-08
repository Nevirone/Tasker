import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';

import FormInput from '../FormInput';
import validationRules from '../validationRules';
import '../styles.css';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) navigate('/');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let result = { isValid: true };

    setEmailError(validationRules.validateEmail(email, result));
    setPasswordError(validationRules.validatePassword(password, result));

    if (!result.isValid) return;

    let data = JSON.stringify({
      email: email,
      password: password,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/auth/login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('authToken', response.data.token);

          toast.dismiss();
          toast.clearWaitingQueue();
          toast.success('Success. Redirecting to dashboard!', {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
            closeOnClick: true,
            autoClose: 1000,
            transition: Zoom,
            onClose: () => {
              navigate('/dashboard', { replace: true });
            },
          });
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.clearWaitingQueue();

        const status = error.response.status;
        let message = 'Internal server error';

        if (status === 400 || status === 401)
          message = error.response.data.message;

        toast.error(message, {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
          closeOnClick: true,
          autoClose: 1000,
          transition: Zoom,
        });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        name="email"
        value={email}
        setValue={setEmail}
        placeholder="Email"
        type="text"
        error={emailError}
      />

      <FormInput
        name="password"
        value={password}
        setValue={setPassword}
        placeholder="Password"
        type="text"
        error={passwordError}
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;
