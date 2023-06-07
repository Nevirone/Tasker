import PropTypes from 'prop-types';

function FormInput({ name, value, setValue, placeholder, type, error }) {
  return (
    <label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={(e) => setValue(e.target.value)}
      />
      {error}
    </label>
  );
}

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
};

export default FormInput;
