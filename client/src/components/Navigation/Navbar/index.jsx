import { FaBars } from 'react-icons/fa';
import { toast, Zoom, ToastContainer } from 'react-toastify';

import PropTypes from 'prop-types';

import ActiveLink from '../ActiveLink';
import './styles.css';

const Navbar = ({ handleMenuToggle }) => {
  const token = localStorage.getItem('jwt_token');

  return (
    <>
      <ToastContainer limit={1} />
      <div className="nav">
        <ActiveLink className="nav-link" to="/">
          <h1>Logo</h1>
        </ActiveLink>
        <FaBars className="bars" onClick={handleMenuToggle} />
        <div className="nav-menu">
          {token && (
            <ActiveLink className="nav-link" to="/dashboard">
              Dashboard
            </ActiveLink>
          )}
          {!token && (
            <ActiveLink className="nav-link" to="/register">
              Register
            </ActiveLink>
          )}
          {!token && (
            <ActiveLink className="nav-btn-link" to="/login">
              Login
            </ActiveLink>
          )}
          {token && (
            <button
              className="nav-btn-link"
              onClick={() => {
                toast.dismiss();
                toast.clearWaitingQueue();

                toast.success('Logged out. Redirecting to home page', {
                  position: toast.POSITION.BOTTOM_CENTER,
                  hideProgressBar: true,
                  closeOnClick: true,
                  autoClose: 1000,
                  transition: Zoom,
                  onClose: () => {
                    localStorage.removeItem('jwt_token');
                    window.location.href = '/';
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
  handleMenuToggle: PropTypes.func,
};

export default Navbar;
