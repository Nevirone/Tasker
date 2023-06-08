import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import './styles.css';
import ActiveLink from '../ActiveLink';
import { toast, Zoom, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onToggle, isMenuOpen }) => {
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  return (
    <>
      <ToastContainer limit={1} />
      <div
        className="sidebar"
        style={{
          opacity: isMenuOpen ? '100%' : '0%',
          top: isMenuOpen ? '0' : '-100%',
        }}
      >
        <div className="icon">
          <FaTimes className="close-icon" onClick={onToggle} />
        </div>
        <div className="sidebar-wrapper">
          <div className="sidebar-menu">
            <ActiveLink
              className="sidebar-link"
              to={token ? '/dashboard' : '/sign-up'}
            >
              {token ? 'Dashboard' : 'Sign Up'}
            </ActiveLink>
          </div>
          <div className="sidebar-btn">
            {!token && (
              <ActiveLink className="sidebar-btn-link" to="/sign-in">
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
      </div>
    </>
  );
};

Sidebar.propTypes = {
  onToggle: PropTypes.func,
  isMenuOpen: PropTypes.bool,
};

export default Sidebar;
