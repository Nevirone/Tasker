import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import axios from 'axios';
import FormInput from '../../components/FormInput';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateData = () => {
    if (firstName.length < 3)
      return 'First name must contain at least 3 characters!';
    if (!firstName.match(/^[A-ZĘÓĄŚŁŻŹĆŃ][a-zęóąśłżźćń]*$/))
      return 'First letter must be capital, all other must be lower case!';

    if (lastName.length < 3)
      return 'Last name must contain at least 3 characters!';
    if (!lastName.match(/^[A-ZĘÓĄŚŁŻŹĆŃ][a-zęóąśłżźćń]*$/))
      return 'First letter must be capital, all other must be lower case!';

    // eslint-disable-next-line no-useless-escape
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.match(regex)) return 'Invalid email!';

    if (password.length < 6)
      return 'Password must contain at least 6 characters!';
    if (!password.match(/.*[A-ZĘÓĄŚŁŻŹĆŃ].*/))
      return 'Password must contain at least one capital letter!';
    if (!password.match(/.*[0123456789].*/))
      return 'Password must contain at least one number letter!';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validateData();

    if (error) {
      toast.dismiss();
      toast.clearWaitingQueue();

      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
      });
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
          navigate('/login');
        },
      });
    } catch (error) {
      // Handle registration error
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <FormInput
          name="First Name "
          type="text"
          placeholder="First Name"
          id="firstName"
          value={firstName}
          setValue={setFirstName}
        />
        <FormInput
          name="Last Name "
          type="text"
          placeholder="Last Name"
          id="lastName"
          value={lastName}
          setValue={setLastName}
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
