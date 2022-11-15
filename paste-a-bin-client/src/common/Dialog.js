import IndividualButtonGroup from "../common/IndividualButtonGroup";
import "./Dialog.css";
import PropTypes from "prop-types";

function Dialog({
  title,
  message,
  positiveOption,
  negativeOption,
  positiveAction,
  negativeAction,
}) {
  const buttons = [
    { text: positiveOption, theme: "danger", onClick: positiveAction },
    { text: negativeOption, theme: "secondary", onClick: negativeAction },
  ];
  return (
    <div className="dialog-container">
      <div className="overlay" />
      <div className="dialog">
        <div className="card shadow-sm">
          <h5 className="card-header">{title}</h5>
          <div className="card-body">
            <div className="col-12">
              <p className="mb-0">{message}</p>
            </div>
            <div className="mt-4">
              <IndividualButtonGroup buttons={buttons} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  positiveOption: PropTypes.string.isRequired,
  negativeOption: PropTypes.string.isRequired,
  positiveAction: PropTypes.func.isRequired,
  negativeAction: PropTypes.func.isRequired,
};

export default Dialog;
