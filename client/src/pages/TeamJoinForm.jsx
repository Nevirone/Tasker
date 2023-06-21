import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import FormInput from '../components/FormInput';

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

      if (error.response.status === 404 || error.response.status === 409) {
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
    <div className="page-wrapper">
      <PageTitle title="Join a team" />
      <div className="page-content">
        <form onSubmit={handleSubmit}>
          <FormInput
            name=""
            type="text"
            placeholder="Token"
            id="token"
            value={teamToken}
            setValue={setTeamToken}
          />
          <button type="submit">Join</button>
        </form>
      </div>
    </div>
  );
};

export default TeamJoinForm;
