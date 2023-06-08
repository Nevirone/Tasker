import { FaBars } from 'react-icons/fa';
import { toast, Zoom, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';

import ActiveLink from '../ActiveLink';
import './styles.css';

const Navbar = ({ onToggle }) => {
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  return (
    <>
      <ToastContainer limit={1} />
      <div className="nav">
        <ActiveLink className="nav-link" to="/">
          <h1>Logo</h1>
        </ActiveLink>
        <FaBars className="bars" onClick={onToggle} />
        <div className="nav-menu">
          {token && (
            <ActiveLink className="nav-link" to="/dashboard">
              Dashboard
            </ActiveLink>
          )}
          {!token && (
            <ActiveLink className="nav-link" to="/sign-up">
              Sign Up
            </ActiveLink>
          )}
          {!token && (
            <ActiveLink className="nav-btn-link" to="/sign-in">
              Sign In
            </ActiveLink>
          )}
          {token && (
            <button
              className="nav-btn-link"
              onClick={() => {
                localStorage.removeItem('authToken');

                toast.dismiss();
                toast.clearWaitingQueue();

                toast.success('Logged out. Redirecting to home page', {
                  position: toast.POSITION.BOTTOM_CENTER,
                  hideProgressBar: true,
                  closeOnClick: true,
                  autoClose: 1000,
                  transition: Zoom,
                  onClose: () => {
                    navigate('/', { replace: true });
                  },
                });
              }}
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </>
  );
};

Navbar.propTypes = {
  onToggle: PropTypes.func,
};

export default Navbar;
