import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import FormInput from '../components/FormInput';
import PageTitle from '../components/PageTitle';

const TaskForm = () => {
  const navigate = useNavigate();
  const { teamId, taskId } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Normal');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt_token');

      try {
        const response = await axios.get(
          `http://localhost:8080/task/${teamId}/${taskId}`,
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        // Handle success
        const task = response.data.data;
        setTitle(task.title);
        setContent(task.content);
        setStatus(task.status);
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          localStorage.removeItem('jwt_token');
          window.location.href = '/';
        }
      }
    };
    fetchData();
  }, [teamId, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt_token');

    try {
      await axios.patch(
        `http://localhost:8080/task/${teamId}/${taskId}`,
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

      toast.success('Task updated. Redirecting to team details', {
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
    <div className="page-wrapper">
      <PageTitle title="Edit task" />
      <div className="page-content">
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
    </div>
  );
};

export default TaskForm;
