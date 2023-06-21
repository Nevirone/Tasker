import { useState } from 'react';
import { toast, Zoom } from 'react-toastify';
import axios from 'axios';
import FormInput from '../../components/FormInput';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });

      // Handle successful login
      localStorage.setItem('jwt_token', response.data.token);
      toast.dismiss();
      toast.clearWaitingQueue();

      toast.success('Logged in. Redirecting to dashboard', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
        onClose: () => {
          window.location.href = '/dashboard';
        },
      });
    } catch (error) {
      console.error('Login failed:', error.message);
      if (error != 500) {
        toast.dismiss();
        toast.clearWaitingQueue();

        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
          closeOnClick: true,
          autoClose: 1000,
          transition: Zoom,
        });
      }
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <FormInput
          name="Email "
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          setValue={setEmail}
        />
        <FormInput
          name="Password "
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          setValue={setPassword}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
