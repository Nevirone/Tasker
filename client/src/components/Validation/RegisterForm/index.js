import { useState, useEffect } from 'react';
import '../styles.css';
import FormInput from '../FormInput';
import validationRules from '../validationRules';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
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
    setFirstNameError(validationRules.validateName(firstName, result));
    setLastNameError(validationRules.validateName(lastName, result));
    setEmailError(validationRules.validateEmail(email, result));
    setPasswordError(validationRules.validatePassword(password, result));

    if (!result.isValid) return;

    let data = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/auth/register',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 201) navigate('/sign-in');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        name="firstname"
        value={firstName}
        setValue={setFirstName}
        placeholder="First Name"
        type="text"
        error={firstNameError}
      />

      <FormInput
        name="lastName"
        value={lastName}
        setValue={setLastName}
        placeholder="Last Name"
        type="text"
        error={lastNameError}
      />

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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default RegisterForm;
