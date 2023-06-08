import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const title = document.getElementById('task-title').value;
    if (title === '') return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/task`,
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        title: title,
      }),
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 201) navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <input
        className="task-title-input"
        type="text"
        placeholder="Title"
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="button" onClick={handleSubmit}>
        Add
      </button>
    </>
  );
};

export default TaskForm;
