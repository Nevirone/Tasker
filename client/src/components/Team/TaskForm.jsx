import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import FormInput from '../FormInput';

const TaskForm = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Normal');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt_token');

    try {
      await axios.post(
        `http://localhost:8080/task/${teamId}`,
        { title: title, content: content, status: status, teamId },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );

      // Handle success
      toast.dismiss();
      toast.clearWaitingQueue();

      toast.success('Task created. Redirecting to dashboard', {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 1000,
        transition: Zoom,
        onClose: () => {
          navigate(`/team/${teamId}`);
        },
      });
    } catch (error) {
      console.log(error);
      console.log(status);
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
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <FormInput
          name="Title "
          type="text"
          placeholder="Title"
          id="title"
          value={title}
          setValue={setTitle}
        />
        <FormInput
          name="Content "
          type="text"
          placeholder="Content"
          id="content"
          value={content}
          setValue={setContent}
        />
        <div className="form-input">
          <label htmlFor="status">Status </label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TaskForm;
