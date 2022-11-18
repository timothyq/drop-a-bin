import "./RadioButtonGroup.css";
import PropTypes from "prop-types";

function RadioButtonGroup({ name, value, options, onChange }) {
  const radioButtonElements = [];
  for (const option of options) {
    radioButtonElements.push(
      <input
        key={`${option.value}-input`}
        type="radio"
        className="btn-check"
        name={name}
        id={`${name}-${option.value}`}
        autoComplete="off"
        checked={option.value === value}
        onChange={() => onChange(option.value)}
      />
    );
    radioButtonElements.push(
      <label
        key={`${option.value}-label`}
        className="btn btn-sm btn-outline-primary"
        htmlFor={`${name}-${option.value}`}
      >
        {option.text}
      </label>
    );
  }

  return (
    <div className="btn-group detail-input" role="group">
      {radioButtonElements}
    </div>
  );
}

RadioButtonGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.any.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RadioButtonGroup;
