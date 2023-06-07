const validateName = (name, result) => {
  const valid = result.isValid;
  result.isValid = false;
  if (name === '') return 'Name is required';
  else if (name.length < 3) return 'Name must consist of at least 3 characters';
  else if (!name.match('[A-Z][a-z]*'))
    return 'Name must start with capital letter';
  result.isValid = valid;
  return '';
};

const validateEmail = (email, result) => {
  const valid = result.isValid;
  result.isValid = false;
  if (email === '') return 'Email is required';
  else if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return 'Email should be xxx@xxx.xxx';
  result.isValid = valid;
  return '';
};

const validatePassword = (password, result) => {
  const valid = result.isValid;
  result.isValid = false;
  if (password === '') return 'Password is required';
  else if (password.length < 6)
    return 'Password should contain at least 6 characters';
  else if (!password.match('.*[A-Z].*'))
    return 'Password should contain at least one capital letter';
  else if (!password.match('.*[0-9].*'))
    return 'Password should contain at least one number';

  result.isValid = valid;
  return '';
};

export default { validateName, validateEmail, validatePassword };
