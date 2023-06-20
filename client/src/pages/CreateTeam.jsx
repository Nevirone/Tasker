import PageTitle from "../components/PageTitle";
import TeamForm from "../components/Team/TeamForm";

const CreateTeam = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Create team" />
      <div className="page-content">
        <TeamForm />
      </div>
    </div>
  );
};

export default CreateTeam;
