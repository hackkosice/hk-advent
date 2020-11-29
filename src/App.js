import React, { createContext, useEffect } from "react";
import Snowfall from "react-snowfall";
import ChallengeList from "./ChallengeList";
import Challenge from "./Challenge";
import Home from "./Home";
import { Router, Link } from "@reach/router";
import Snow from "./SNEH.svg";
import firebase from "firebase/app";
import "firebase/analytics";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export const ChallengeContext = createContext();
const date = moment("2020-12-01T00:00:00");

const App = () => {
  firebase.analytics();

  useEffect(() => {
    if (!localStorage.getItem("username")) {
      localStorage.setItem("username", uuidv4());
    }
  }, []);

  return (
    <ChallengeContext.Provider value={date}>
      <div style={{ padding: "0 1rem" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <h1 style={{ textAlign: "center" }}>
            &#x1F384; Hack Kosice &#x1F384;
          </h1>
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
            width: "100%",
            position: "fixed",
            bottom: "0px",
            left: "0px",
          }}
        />
      </div>
    </ChallengeContext.Provider>
  );
};

export default App;
