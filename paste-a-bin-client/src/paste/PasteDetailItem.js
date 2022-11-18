import "./PasteDetailItem.css";
import PropTypes from "prop-types";

function PasteDetailItem({ itemName, text, showText, showControls, children }) {
  return (
    <div className="col-12">
      <h6>{itemName}</h6>
      {showText && text && (
        <p className="text-muted detail-text multiline-text">{text}</p>
      )}
      {showControls && children}
    </div>
  );
}

PasteDetailItem.propTypes = {
  itemName: PropTypes.string.isRequired,
  text: PropTypes.string,
  showText: PropTypes.bool.isRequired,
  showControls: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired,
};

export default PasteDetailItem;
