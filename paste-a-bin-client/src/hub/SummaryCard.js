import "./SummaryCard.css";
import IndividualButtonGroup from "../common/IndividualButtonGroup";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function SummaryCard({ pasteId, content, username, allowEdit }) {
  const navigate = useNavigate();
  const buttons = [];
  buttons.push({
    text: "View",
    theme: "secondary",
    small: true,
    outline: true,
    onClick: () => navigate(`/paste/${pasteId}`),
  });
  if (allowEdit) {
    buttons.push({
      text: "Edit",
      theme: "secondary",
      small: true,
      outline: true,
      onClick: () => navigate(`/paste/${pasteId}?edit`),
    });
  }
  let displayedContent;
  if (content.length < 280) {
    displayedContent = content;
  } else {
    displayedContent = content.substring(0, 277) + "...";
  }
  return (
    <div className="col-md-12 col-lg-6 mb-4">
      <div className="card shadow-sm">
        <h5 className="card-header">{pasteId}</h5>
        <div className="card-body">
          <p className="text-muted">{displayedContent}</p>
          <small className="text-muted user-name-text">{username}</small>
          <IndividualButtonGroup buttons={buttons} />
        </div>
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  pasteId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  allowEdit: PropTypes.bool.isRequired,
};

export default SummaryCard;
