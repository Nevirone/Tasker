import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify'
import axios from 'axios';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateData = () => {
  if (!firstName) return 'First name must be provided!';
  if (firstName.length < 3) return 'First name must contain at least 3 characters!';
  if (!firstName.match(/^[A-ZĘÓĄŚŁŻŹĆŃ][a-zęóąśłżźćń]*$/))
    return 'First letter must be capital, all other must be lower case!';

  if (!lastName) return 'Last name must be provided!';
  if (lastName.length < 3) return 'Last name must contain at least 3 characters!';
  if (!lastName.match(/^[A-ZĘÓĄŚŁŻŹĆŃ][a-zęóąśłżźćń]*$/))
    return 'First letter must be capital, all other must be lower case!';

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
      await axios.post('http://localhost:8080/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });

      // Handle successful registration
      toast.dismiss();
      toast.clearWaitingQueue();

      toast.success('Account created. Redirecting to login page', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
        onClose: () => {
          localStorage.removeItem('jwt_token');
          navigate('/login')
        },
      });
    } catch (error) {
      // Handle registration error
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={handleLastNameChange}
        />
      </div>
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
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
