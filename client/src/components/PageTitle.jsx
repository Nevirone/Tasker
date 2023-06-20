import PropTypes from "prop-types";

const PageTitle = (props) => {
  return (
    <div className="page-title">
      {props.title ? props.title : "Title template"}
    </div>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export default PageTitle;
