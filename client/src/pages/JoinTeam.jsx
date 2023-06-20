import PageTitle from "../components/PageTitle";
import TeamJoinForm from "../components/Team/TeamJoinForm";

const JoinTeam = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Join a team" />
      <div className="page-content">
        <TeamJoinForm />
      </div>
    </div>
  );
};

export default JoinTeam;
