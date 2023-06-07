import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './styles.css';

const Navbar = ({ onToggle }) => {
  return (
    <>
      <div className="nav">
        <NavLink className="nav-link" to="/">
          <h1>Logo</h1>
        </NavLink>
        <FaBars className="bars" onClick={onToggle} />
        <div className="nav-menu">
          <NavLink className="nav-link" to="/sign-up">
            Sign Up
          </NavLink>
          <NavLink className="nav-btn-link" to="/sign-in">
            Sign In
          </NavLink>
          <NavLink className="nav-link" to="/logout">
            Log Out
          </NavLink>
        </div>
      </div>
    </>
  );
};

Navbar.propTypes = {
  onToggle: PropTypes.func,
};

export default Navbar;
