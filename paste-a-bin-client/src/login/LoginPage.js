import Section from "../common/Section";
import { login } from "./loginApi";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./LoginPage.css";
import PropTypes from "prop-types";

function LoginPage({ onLogin }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <Section title="Login">
      <div className="mb-4 col-md-8 mx-auto d-flex justify-content-center align-items-center">
        <form>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="login-username-input"
              value={usernameInput}
              onInput={(e) => setUsernameInput(e.target.value)}
              placeholder="Username"
              autoComplete="off"
            />
            <label htmlFor="login-username-input">Username</label>
          </div>
          <div className="form-floating mt-2">
            <input
              type="password"
              className="form-control"
              id="login-password-input"
              value={passwordInput}
              onInput={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              autoComplete="off"
            />
            <label htmlFor="login-password-input">Password</label>
          </div>
          <p className="text-muted detail-text mt-4">
            An account will be automatically created for you if the username
            does not exist
          </p>
          <button
            className="w-100 btn btn-lg btn-primary mt-2"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              await login(usernameInput, passwordInput);
              onLogin(usernameInput);
              navigate(searchParams.get("redirect"));
            }}
            disabled={!usernameInput || !passwordInput}
          >
            Login
          </button>
        </form>
      </div>
    </Section>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
