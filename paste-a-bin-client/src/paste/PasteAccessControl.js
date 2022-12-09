import { useState } from "react";
import PropTypes from "prop-types";

function PasteAccessControl({ error, onPasswordSubmit }) {
  const [passwordInput, setPasswordInput] = useState("");
  const pasteIsPasswordProtected = error === "PasteIsPasswordProtected";
  const pastePasswordIncorrect = error === "PastePasswordIncorrect";
  const pasteNotFound = !pasteIsPasswordProtected && !pastePasswordIncorrect;

  let title;
  let message;
  if (pasteIsPasswordProtected) {
    title = "Password Required";
    message =
      "This paste is protected by a password. Please enter the password to access the paste.";
  } else if (pastePasswordIncorrect) {
    title = "Password Is Incorrect";
    message =
      "The password you entered for this protected paste is wrong. Please try again.";
  } else if (pasteNotFound) {
    title = "Paste Not Found";
    message = "The paste requested is not found.";
  }

  return (
    <div className="col-12 mb-4">
      <div className="card shadow-sm">
        <h3 className="card-header">{title}</h3>
        <div className="card-body">
          <p className="mb-0">{message}</p>
          {!pasteNotFound && (
            <form>
              <div className="form-floating mt-4 mx-auto">
                <input
                  type="password"
                  className="form-control"
                  id="access-password-input"
                  value={passwordInput}
                  onInput={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password"
                  autoComplete="off"
                />
                <label htmlFor="access-password-input">Password</label>
              </div>
              <div className="mt-4 mx-auto">
                <button
                  className="w-100 btn btn-lg btn-primary"
                  type="button"
                  onClick={() => {
                    onPasswordSubmit(passwordInput);
                    setPasswordInput("");
                  }}
                  disabled={!passwordInput}
                >
                  Access
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

PasteAccessControl.propTypes = {
  error: PropTypes.string.isRequired,
  onPasswordSubmit: PropTypes.func.isRequired,
};

export default PasteAccessControl;
