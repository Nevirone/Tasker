import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './styles.css';

const Sidebar = ({ onToggle, isMenuOpen }) => {
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
          <NavLink className="sidebar-link" to="/sign-up">
            Sign Up
          </NavLink>
        </div>
        <div className="sidebar-btn">
          <NavLink className="sidebar-btn-link" to="/sign-in">
            Sign In
          </NavLink>
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
