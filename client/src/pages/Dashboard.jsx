import PageTitle from "../components/PageTitle";
import TeamList from "../components/Team/TeamList";

const Dashboard = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Dashboard" />
      <div className="page-content">
        <TeamList />
      </div>
    </div>
  );
};

export default Dashboard;
