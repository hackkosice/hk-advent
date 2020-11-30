import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { Link } from "@reach/router";
import { ChallengeContext } from "./App";

const Countdown = () => {
  const date = useContext(ChallengeContext);
  const [text, setText] = useState(null);
  const [isAfter, setIsAfter] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newDiff = {
        days: moment.duration(date.diff(moment())).get("d"),
        hours: moment.duration(date.diff(moment())).get("h"),
        mins: moment.duration(date.diff(moment())).get("m"),
        secs: moment.duration(date.diff(moment())).get("s"),
      };
      setIsAfter(!moment().isBefore(date));
      setText(
        `${newDiff.days}d ${newDiff.hours}h ${newDiff.mins}m ${newDiff.secs}s`
      );
    }, 1000);
    return () => clearTimeout(timeoutId);
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
      {!isAfter ? (
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
