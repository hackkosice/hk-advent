import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "@reach/router";

const challenge = moment("2020-11-01T00:00:00");
const Countdown = () => {
  const [text, setText] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      const newDiff = {
        days: moment.duration(challenge.diff(moment())).get("d"),
        hours: moment.duration(challenge.diff(moment())).get("h"),
        mins: moment.duration(challenge.diff(moment())).get("m"),
        secs: moment.duration(challenge.diff(moment())).get("s"),
      };
      setText(
        `${newDiff.days}d ${newDiff.hours}h ${newDiff.mins}m ${newDiff.secs}s`
      );
    }, 1000);
  });

  if (!text) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {moment().isBefore(challenge) ? (
        <>
          <p>Starts in</p>
          <h2>{text}</h2>
        </>
      ) : (
        <Link to="/challenges" className="btn">
          Go to challenges
        </Link>
      )}
    </div>
  );
};

export default Countdown;
