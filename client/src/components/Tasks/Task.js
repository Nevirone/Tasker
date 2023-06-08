import PropTypes from 'prop-types';
import axios from 'axios';
import ObjectiveForm from './Forms/ObjectiveForm';
import { useState } from 'react';
import Objective from './Objective';

// eslint-disable-next-line no-unused-vars
const Task = ({ task_id, title, created_by, objectives, handleTaskDelete }) => {
  const [currentObjectives, setCurrentObjectives] = useState(objectives);

  const handleObjectiveDelete = (id) => {
    const token = localStorage.getItem('authToken');

    if (!token) return;

    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/task/${task_id}/${id}`,
      headers: {
        'x-access-token': token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          let temp = currentObjectives;
          temp = temp.filter((obj) => obj.id !== id);
          setCurrentObjectives(temp);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="task-wrapper">
      <table className="styled-table">
        <thead>
          <tr>
            <th colSpan="2" className="title">
              {title}{' '}
            </th>
            <th className="title">
              <button type="button" onClick={() => handleTaskDelete(task_id)}>
                Remove
              </button>
            </th>
          </tr>

          <tr>
            <th>Title</th>
            <th>Completed</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {currentObjectives.length === 0 && (
            <tr>
              <td></td>
            </tr>
          )}
          {currentObjectives.map((obj) => (
            <Objective
              key={obj.id}
              task_id={task_id}
              objective_id={obj.id}
              title={obj.title}
              completed={obj.completed}
              handleObjectiveDelete={handleObjectiveDelete}
            />
          ))}
          <ObjectiveForm id={task_id} />
        </tbody>
      </table>
    </div>
  );
};

Task.propTypes = {
  task_id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  created_by: PropTypes.string.isRequired,
  objectives: PropTypes.array.isRequired,
  handleTaskDelete: PropTypes.func.isRequired,
};

export default Task;
