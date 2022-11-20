import IndividualButtonGroup from "./common/IndividualButtonGroup";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Header({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const buttons = currentUser
    ? [
        {
          text: "Create",
          theme: "primary",
          onClick: () => navigate("/paste?create"),
        },
        { text: "Logout", theme: "secondary", onClick: onLogout },
      ]
    : [
        {
          text: "Login",
          theme: "primary",
          onClick: () =>
            navigate(
              `/login?redirect=${window.location.pathname}${window.location.search}`
            ),
        },
      ];

  return (
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <Link
        to="/"
        className="d-flex align-items-center mt-1 mb-3 mb-md-0 me-md-auto text-dark text-decoration-none mx-4"
      >
        <img
          className="bi me-2"
          width="32"
          height="32"
          src="/logo.png"
          alt="logo"
        />
        <span className="fs-4">Paste-a-bin</span>
      </Link>
      <IndividualButtonGroup buttons={buttons} />
    </header>
  );
}

Header.propTypes = {
  onLogout: PropTypes.func.isRequired,
  currentUser: PropTypes.string,
};

export default Header;
