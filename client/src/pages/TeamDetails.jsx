import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import TaskList from '../components/Task/TaskList';
import TeamUsersList from '../components/Team/UserList';

const TeamDetails = () => {
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
        if (error.response.status === 401) {
          localStorage.removeItem('jwt_token');
          window.location.href = '/';
        }
        console.log(error);
      }
    };
    fetchData();
  }, [teamId]);

  return (
    <div className="page-wrapper">
      <PageTitle title="Team details" />
      <div className="page-content">
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

        <PageTitle title="User list" />
        <TeamUsersList
          team={team}
          tasks={tasks}
          setTasks={setTasks}
          users={users}
          setUsers={setUsers}
          me={me}
        />

        <PageTitle title="Task list" />
        <TaskList team={team} tasks={tasks} setTasks={setTasks} me={me} />

        <button type="button" onClick={() => navigate(`/add_task/${teamId}`)}>
          Add task
        </button>
      </div>
    </div>
  );
};

export default TeamDetails;
