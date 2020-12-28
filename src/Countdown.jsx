import React from "react";
import { Link } from "@reach/router";

const Countdown = () => {
  // const date = useContext(ChallengeContext);
  // const [text, setText] = useState(null);
  // const [isAfter, setIsAfter] = useState(false);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     const newDiff = {
  //       days: moment.duration(date.diff(moment())).get("d"),
  //       hours: moment.duration(date.diff(moment())).get("h"),
  //       mins: moment.duration(date.diff(moment())).get("m"),
  //       secs: moment.duration(date.diff(moment())).get("s"),
  //     };
  //     setIsAfter(!moment().isBefore(date));
  //     setText(
  //       `${newDiff.days}d ${newDiff.hours}h ${newDiff.mins}m ${newDiff.secs}s`
  //     );
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // });

  // if (!text) {
  //   return null;
  // }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Link to="/challenges" className="btn">
        Go to challenges
      </Link>
      <Link to="/solutions" className="btn">
        Solutions
      </Link>
    </div>
  );
};

export default Countdown;
