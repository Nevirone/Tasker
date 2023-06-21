import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import FormInput from '../components/FormInput';

const TeamForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt_token');

    try {
      const response = await axios.post(
        'http://localhost:8080/team',
        { name: name },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      // Handle successtoast.dismiss();
      toast.clearWaitingQueue();

      toast.success(`New team created, token: ${response.data.data}`, {
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
      if (error.resposne.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="page-wrapper">
      <PageTitle title="Create team" />
      <div className="page-content">
        <form onSubmit={handleSubmit}>
          <FormInput
            name=""
            type="text"
            placeholder="Name"
            id="name"
            value={name}
            setValue={setName}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
