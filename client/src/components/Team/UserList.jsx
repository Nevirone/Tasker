import axios from 'axios';
import { toast, Zoom } from 'react-toastify';
import PropTypes from 'prop-types';

const TeamUsersList = ({ team, tasks, setTasks, users, setUsers, me }) => {
  const handleDeleteUser = async (userId) => {
    if (!userId) return;

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.delete(
        `http://localhost:8080/team/manage/${team._id}/${userId}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      let temp = users;
      temp = temp.filter((user) => user._id != userId);
      setUsers(temp);
      temp = tasks;
      temp = temp.filter((task) => task.author._id != userId);
      setTasks(temp);

      // Handle success
      toast.success('User removed', {
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
          <th>Imie</th>
          <th>Nazwisko</th>
          <th>-</th>
        </tr>
      </thead>
      <tbody>
        {team &&
          users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>
                {me._id === team.owner._id && user._id != team.owner._id ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Remove
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

TeamUsersList.propTypes = {
  team: PropTypes.object,
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  setUsers: PropTypes.func.isRequired,
  me: PropTypes.object,
};
export default TeamUsersList;
