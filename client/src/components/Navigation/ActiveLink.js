import { NavLink } from 'react-router-dom';

const ActiveLink = (props) => {
  return (
    <NavLink
      style={({ isActive }) => {
        return { color: isActive ? '#fda' : '' };
      }}
      {...props}
    />
  );
};

export default ActiveLink;
