import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ObjectiveForm = ({ id }) => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const title = document.getElementById('objective-title').value;
    if (title === '') return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/task/${id}`,
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
    <tr>
      <td>
        <input
          className="title-input"
          type="text"
          placeholder="Title"
          id="objective-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />{' '}
      </td>
      <td></td>
      <td>
        <button type="button" onClick={handleSubmit}>
          Add
        </button>
      </td>
    </tr>
  );
};

ObjectiveForm.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ObjectiveForm;
