import PropTypes from 'prop-types'

const TeamRow = ({team}) => {
  return (
    <li>{team.name}</li>
  )
}

TeamRow.propTypes = {
  team: PropTypes.object
}
export default TeamRow