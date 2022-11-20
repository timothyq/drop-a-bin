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
