import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import axios from 'axios';

const Team = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [me, setMe] = useState(null);

  const handleDeleteTeam = async () => {
    const token = localStorage.getItem('jwt_token');

    try {
      await axios.delete(`http://localhost:8080/team/${teamId}`, {
        headers: {
          'x-access-token': token,
        },
      });

      // Handle success
      toast.success('Team removed. Redirecting to dashboard', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
        onClose: () => {
          navigate(`/dashboard`);
        },
      });
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/';
      }
      console.log(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.delete(
        `http://localhost:8080/team/manage/${teamId}/${userId}`,
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
      if (error.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/';
      }
      console.log(error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!taskId) return;

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.delete(`http://localhost:8080/task/${teamId}/${taskId}`, {
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
      if (error.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/';
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/team/${teamId}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        const responseMe = await axios.get(`http://localhost:8080/user/me`, {
          headers: {
            'x-access-token': token,
          },
        });

        // Handle success
        const team = response.data.data;
        const user = responseMe.data.data;
        if (team && user) {
          setMe(user);
          setTeam(team);
          setTasks(team.tasks);
          setUsers(team.users);
        }
      } catch (error) {
        if (error.status === 401) {
          localStorage.removeItem('jwt_token');
          window.location.href = '/';
        }
        console.log(error);
      }
    };
    fetchData();
  }, [teamId]);

  return (
    <div className="team-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Token</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{team ? team.name : '-'}</td>
            <td>
              {team ? `${team.owner.firstName} ${team.owner.lastName}` : '-'}
            </td>
            <td>{team ? team.token : '-'}</td>
          </tr>
        </tbody>
      </table>
      {team && me && me._id === team.owner._id && (
        <div>
          <button type="button" onClick={handleDeleteTeam}>
            Remove team
          </button>
        </div>
      )}
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
      <button type="button" onClick={() => navigate(`/add_task/${teamId}`)}>
        Add task
      </button>
    </div>
  );
};

export default Team;
