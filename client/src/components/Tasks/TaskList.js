import { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import './styles.css';
import TaskForm from './Forms/TaskForm';

const TaskList = () => {
  // eslint-disable-next-line no-unused-vars
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) return;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/task/',
      headers: {
        'x-access-token': token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) setTaskList(response.data.tasks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleTaskDelete = (id) => {
    const token = localStorage.getItem('authToken');

    if (!token) return;

    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/task/${id}`,
      headers: {
        'x-access-token': token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          let temp = taskList;
          temp = temp.filter((task) => task._id !== id);
          setTaskList(temp);
          console.log('tesk');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <TaskForm />
      <div className="task-list-wrapper">
        {taskList.map((task) => (
          <Task
            key={task._id}
            task_id={task._id}
            title={task.title}
            created_by={task.created_by}
            objectives={task.objectives}
            handleTaskDelete={handleTaskDelete}
          />
        ))}
      </div>
    </>
  );
};

export default TaskList;
