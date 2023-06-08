import PropTypes from 'prop-types';
import { FaBars } from 'react-icons/fa';
import './styles.css';
import ActiveLink from '../ActiveLink';

const Navbar = ({ onToggle }) => {
  const token = localStorage.getItem('authToken');
  return (
    <>
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
            <ActiveLink className="nav-link" to="/logout">
              Log Out
            </ActiveLink>
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
