import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Objective = ({
  task_id,
  objective_id,
  title,
  completed,
  handleObjectiveDelete,
}) => {
  const [currentStatus, setCurrentStatus] = useState(completed);

  const handleStatusToggle = () => {
    const token = localStorage.getItem('authToken');

    if (!token) return;

    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/task/${task_id}`,
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        objectiveId: objective_id,
      }),
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          setCurrentStatus(!currentStatus);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <tr key={objective_id}>
      <td>{title}</td>
      <td>
        <input
          type="checkbox"
          checked={currentStatus}
          onChange={handleStatusToggle}
        />
      </td>
      <td>
        <button
          type="button"
          onClick={() => handleObjectiveDelete(objective_id)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

Objective.propTypes = {
  task_id: PropTypes.string.isRequired,
  objective_id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  handleObjectiveDelete: PropTypes.func.isRequired,
};

export default Objective;
