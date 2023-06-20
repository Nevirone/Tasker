import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';

const TeamJoinForm = () => {
  const navigate = useNavigate();
  const [teamToken, setTeamToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt_token');

    try {
      const response = await axios.post(
        'http://localhost:8080/team/manage/join',
        { token: teamToken },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      // Handle success
      toast.dismiss();
      toast.clearWaitingQueue();

      console.log(response);
      toast.success('Team joined. Redirecting to dashboard', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
        onClose: () => {
          navigate('/dashboard');
        },
      });
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.dismiss();
        toast.clearWaitingQueue();

        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
          closeOnClick: true,
          autoClose: 1000,
          transition: Zoom,
        });
      }
      if (error.response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/';
      }

      if (error.response.status === 409) {
        toast.dismiss();
        toast.clearWaitingQueue();

        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
          closeOnClick: true,
          autoClose: 1000,
          transition: Zoom,
        });
      }
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={teamToken}
          placeholder="Token"
          onChange={(e) => {
            if (e.target.value.length <= 6) setTeamToken(e.target.value);
          }}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default TeamJoinForm;
