import PropTypes from "prop-types";

const TaskRow = ({ task }) => {
  return (
    <li key={task._id}>
      <p>Task title: {task.title}</p>
      <p>Task author: {task.author}</p>
      <p>Task content: {task.content}</p>
    </li>
  );
};

TaskRow.propTypes = {
  task: PropTypes.object.isRequired
};

export default TaskRow;
