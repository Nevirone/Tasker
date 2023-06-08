import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import './styles.css';
import ActiveLink from '../ActiveLink';

const Sidebar = ({ onToggle, isMenuOpen }) => {
  const token = localStorage.getItem('authToken');
  return (
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
          <ActiveLink
            className="sidebar-btn-link"
            to={token ? '/logout' : '/sign-in'}
          >
            {token ? 'Logout' : 'Sign In'}
          </ActiveLink>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onToggle: PropTypes.func,
  isMenuOpen: PropTypes.bool,
};

export default Sidebar;
