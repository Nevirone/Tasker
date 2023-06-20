import PageTitle from "../components/PageTitle";
import TeamDetails from "../components/Team/TeamDetails";
const Team = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Team details" />
      <div className="page-content">
        <TeamDetails />
      </div>
    </div>
  );
};

export default Team;
