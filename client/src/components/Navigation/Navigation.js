import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Navigation = ({ onToggle, isMenuOpen, children }) => {
  return (
    <>
      <Sidebar isMenuOpen={isMenuOpen} onToggle={onToggle} />
      <Navbar onToggle={onToggle} />
      {children}
    </>
  );
};

Navigation.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
};
export default Navigation;
