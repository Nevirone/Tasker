import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeamList = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/team', {
          headers: {
            'x-access-token': token,
          },
        });

        // Handle success
        setTeams(response.data.data);
      } catch (error) {
        if (error.response.status === 401) {
          // Token expired
          localStorage.removeItem('jwt_token');
          window.location.href = '/';
        }
        // Handle login error
        console.error('Request failed:', error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Team name</th>
          <th colSpan={2}>Team owner</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={team._id}>
            <td>{team.name}</td>
            <td>
              {team.owner.firstName} {team.owner.lastName}
            </td>
            <td>
              <button
                type="button"
                onClick={() => navigate(`/team/${team._id}`)}
              >
                Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamList;
