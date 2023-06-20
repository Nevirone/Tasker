import PropTypes from 'prop-types';

const FormInput = ({ name, type, placeholder, id, value, setValue }) => {
  return (
    <div className="form-input">
      <label htmlFor={id}>{name}</label>
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        required
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default FormInput;
