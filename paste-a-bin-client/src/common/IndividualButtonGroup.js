import "./IndividualButtonGroup.css";
import PropTypes from "prop-types";

function IndividualButtonGroup({ buttons }) {
  const buttonElements = buttons.map((button) => (
    <button
      key={button.text}
      type="button"
      className={`btn btn${button.outline ? "-outline" : ""}-${button.theme} ${
        button.small ? "btn-sm " : ""
      }`}
      onClick={button.onClick}
      disabled={button.disabled}
    >
      {button.text}
    </button>
  ));

  return <div>{buttonElements}</div>;
}

IndividualButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.exact({
      text: PropTypes.string.isRequired,
      outline: PropTypes.bool,
      theme: PropTypes.oneOf(["primary", "secondary", "danger"]).isRequired,
      small: PropTypes.bool,
      onClick: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

export default IndividualButtonGroup;
