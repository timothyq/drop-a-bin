import SummaryCard from "./SummaryCard";
import Section from "../common/Section";
import { getHubData } from "./hubApi";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function HubPage({ currentUser }) {
  const [yourPastes, setYourPastes] = useState([]);
  const [latestPastes, setLatestPastes] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getHubData();
      setYourPastes(data.yourPastes);
      setLatestPastes(data.latest);
    })();
  }, [currentUser]);

  const mapper = (item) => (
    <SummaryCard
      key={item.pasteId}
      pasteId={item.pasteId}
      content={item.content}
      username={item.user}
      allowEdit={item.user === currentUser}
    />
  );

  return (
    <div>
      {!currentUser && (
        <Section title={"Welcome!"}>
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                Now you have an infinite clipboard! Paste-a-bin is a service for
                you to save any content. Whether it's a piece of message, a
                snippet of code, or your personal note, we've got you covered!
                You can make the paste public for everyone to see, or you can
                make it private to limit access to yourself. You can also share
                your private pastes protected with a password, or make the paste
                self-destroy! There are endless possibilities for you to find
                out. Shown below are some latest public pastes posted by
                paste-a-biners. Enjoy the service!
              </div>
            </div>
          </div>
        </Section>
      )}
      {currentUser && yourPastes && yourPastes.length > 0 && (
        <Section title={"Your Pastes"}>{yourPastes.map(mapper)}</Section>
      )}
      {latestPastes && latestPastes.length > 0 && (
        <Section title={"Latest"}>{latestPastes.map(mapper)}</Section>
      )}
    </div>
  );
}

HubPage.propTypes = {
  currentUser: PropTypes.string,
};

export default HubPage;
