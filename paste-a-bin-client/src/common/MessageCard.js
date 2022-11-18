import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function MessageCard({
  title,
  message,
  instruction,
  theme,
  expireTs,
  onFinish,
}) {
  const textColor = theme === "success" ? "white" : "dark";
  const [secondsLeft, setSecondsLeft] = useState(0);
  const now = new Date().getTime();
  const show = expireTs > now;

  useEffect(() => {
    const timeouts = [];
    if (show) {
      for (let t = now; t < expireTs; t += 1000) {
        timeouts.push(
          setTimeout(() => {
            setSecondsLeft(Math.ceil((expireTs - t) / 1000));
          }, t - now)
        );
      }
      timeouts.push(
        setTimeout(() => {
          onFinish();
        }, expireTs - now)
      );
    }
    return () => {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    };
  }, [expireTs, now, onFinish, show]);

  return (
    <div>
      {show && (
        <div className={`card shadow-sm text-${textColor} bg-${theme}`}>
          <h5 className="card-header">{title}</h5>
          <div className="card-body">
            <p>{message}</p>
            <p className="mb-0">
              {instruction} in {secondsLeft} second{secondsLeft > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

MessageCard.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  instruction: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(["success", "warning"]).isRequired,
  expireTs: PropTypes.number.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default MessageCard;
