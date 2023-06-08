import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  }, []);

  return <></>;
};

export default Logout;
