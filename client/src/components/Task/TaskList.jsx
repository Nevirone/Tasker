import axios from 'axios';
import { toast, Zoom } from 'react-toastify';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TaskList = ({ team, tasks, setTasks, me }) => {
  const navigate = useNavigate();

  const handleTaskDelete = async (taskId) => {
    if (!taskId) return;

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.delete(`http://localhost:8080/task/${team._id}/${taskId}`, {
        headers: {
          'x-access-token': token,
        },
      });

      let temp = tasks;
      temp = temp.filter((user) => user._id != taskId);
      setTasks(temp);

      // Handle success
      toast.success('Task removed', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
      });
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/';
      }
      console.log(error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Author</th>
          <th colSpan="3">Content</th>
          <th>-</th>
        </tr>
      </thead>
      <tbody>
        {team &&
          tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>
                {task.author.firstName} {task.author.lastName}
              </td>
              <td colSpan="3">{task.content}</td>
              <td>
                {task.author._id == me._id ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/edit_task/${team._id}/${task._id}`)
                    }
                  >
                    Edit
                  </button>
                ) : (
                  '-'
                )}
                {task.author._id == me._id || team.owner._id == me._id ? (
                  <button
                    type="button"
                    onClick={() => handleTaskDelete(task._id)}
                  >
                    Delete
                  </button>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

TaskList.propTypes = {
  team: PropTypes.object,
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
  me: PropTypes.object,
};

export default TaskList;
