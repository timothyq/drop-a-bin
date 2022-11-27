import { useEffect } from "react";
import "./AutoResizingTextArea.css";
import PropTypes from "prop-types";

function AutoResizingTextArea({ placeholder, id, content, onChange }) {
  function resize() {
    const textarea = document.getElementById(id);
    setTimeout(() => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }

  useEffect(resize, [content, id]);
  return (
    <textarea
      className="form-control detail-input"
      id={id}
      onInput={(event) => onChange(event.target.value)}
      value={content}
      placeholder={placeholder}
      required
    />
  );
}

AutoResizingTextArea.propTypes = {
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default AutoResizingTextArea;
