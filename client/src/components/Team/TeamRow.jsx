import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TeamRow = ({ team }) => {
  return (
    <Link replace to={`/team/${team._id}`}>
      <li>{team.name}</li>
    </Link>
  );
};

TeamRow.propTypes = {
  team: PropTypes.object,
};
export default TeamRow;
