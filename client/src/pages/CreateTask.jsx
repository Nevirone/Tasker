import PageTitle from "../components/PageTitle";
import TaskForm from "../components/Team/TaskForm";

const CreateTask = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Create task" />
      <div className="page-content">
        <TaskForm />
      </div>
    </div>
  );
};

export default CreateTask;
