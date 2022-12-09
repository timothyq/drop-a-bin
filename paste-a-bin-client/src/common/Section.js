import PropTypes from "prop-types";

function Section({ title, children }) {
  return (
    <section>
      <div className="row">
        <div className="col mx-auto mb-2 d-flex justify-content-center">
          <h2 className="fw-light">{title}</h2>
        </div>
      </div>
      <div className="row">{children}</div>
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
};
export default Section;
