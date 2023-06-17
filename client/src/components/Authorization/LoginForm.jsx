import { useState } from 'react';
import { toast, Zoom } from 'react-toastify'
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateData = () => {
    if (!email) return 'Email must be provided';
    // eslint-disable-next-line no-useless-escape
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.match(regex)) return 'Invalid email!';
  
    if (!password) return 'Password must be provided!';
    if (password.length < 6)
      return 'Password must contain at least 6 characters!';
    if (!password.match(/.*[A-ZĘÓĄŚŁŻŹĆŃ].*/))
      return 'Password must contain at least one capital letter!';
    if (!password.match(/.*[0123456789].*/))
      return 'Password must contain at least one number letter!';
    }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const error = validateData()

    if(error) {
      toast.dismiss();
      toast.clearWaitingQueue();

      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
      })
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });

      // Handle successful login
      localStorage.setItem('jwt_token', response.data.token)
      toast.dismiss();
      toast.clearWaitingQueue();

      toast.success('Logged in. Redirecting to dashboard', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
        onClose: () => {
          window.location.href = '/dashboard'
        },
      })

    }catch (error) {
      console.error('Login failed:', error.message);
      if(error.response.status >= 400 && error.response.status < 500) {
        toast.dismiss();
        toast.clearWaitingQueue();
  
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
          closeOnClick: true,
          autoClose: 1000,
          transition: Zoom,
        })
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
