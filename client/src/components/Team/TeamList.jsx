import axios from 'axios';
import { useState, useEffect } from 'react';
import TeamRow from './TeamRow';

const TeamList = () => {

  const [teams, setTeams] = useState([])

  
  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/team', {
        headers: {
          'x-access-token': token,
        }
      });

      // Handle success
      setTeams(response.data.data)
    } catch (error) {
      if(error.response.status === 401) {
        // Token expired
        localStorage.removeItem('jwt_token');
        window.location.href = '/'
      }
      // Handle login error
      console.error('Request failed:', error.message);
    }
  };
fetchData();
   }, [])

  return (
    <div className="team-list-wrapper">
      <h1>Team List</h1>
      <ul>
        {teams.length === 0 && <p>No teams, maybe join one</p>}
        {teams.length > 0 && teams.map(team => (
          <TeamRow key={team.name} team={team} />
        ))}
      </ul>
    </div>
  )
}

export default TeamList