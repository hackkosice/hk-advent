import React from "react";
import Snowfall from "react-snowfall";
import ChallengeList from "./ChallengeList";
import Challenge from "./Challenge";
import Home from "./Home";
import { Router, Link } from "@reach/router";
import Snow from "./SNEH.svg";
import firebase from "firebase/app";
import "firebase/analytics";

const App = () => {
  firebase.analytics();
  return (
    <div>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        <h1 style={{ textAlign: "center" }}>&#x1F384; Hack Kosice &#x1F384;</h1>
      </Link>
      <Router>
        <Home path="/" default />
        <ChallengeList path="challenges" />
        <Challenge path="challenges/:id" />
      </Router>
      <Snowfall snowflakeCount={100} />
      <img
        alt="snow"
        src={Snow}
        style={{
          width: "100vw",
          position: "absolute",
          bottom: "0px",
          left: "0px",
        }}
      />
    </div>
  );
};

export default App;
