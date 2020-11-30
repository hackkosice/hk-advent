import React, { useContext } from "react";
import { FirebaseDatabaseNode } from "@react-firebase/database";
import { Link } from "@reach/router";
import moment from "moment";
import { ChallengeContext } from "./App";
import useWindowWidth from "./useWindowWidth";

const ChallengeList = () => {
  const date = useContext(ChallengeContext);
  const width = useWindowWidth();

  if (moment().isBefore(date)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2>Challenges haven't started yet :(</h2>
        <img
          src="https://cdn.pixabay.com/photo/2016/03/27/19/02/desk-1283688_1280.jpg"
          alt="christmas"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: width > 800 ? "80vw" : "100vw",
        }}
      >
        <h2>Challenge List</h2>
        <div className="challengeList">
          <FirebaseDatabaseNode path="/">
            {(d) => {
              if (d.value) {
                return d.value.challenges.map((ch) => {
                  const isSolved =
                    d.value.submissions &&
                    d.value.submissions[ch.id - 1] &&
                    d.value.submissions[ch.id - 1].includes(
                      localStorage.getItem("username")
                    );
                  if (true || (moment().isAfter(ch.visible) && !isSolved)) {
                    return (
                      <Link
                        key={ch.id}
                        to={`/challenges/${ch.id}`}
                        className={ch.id === 24 ? "box special" : "box"}
                        state={{ challenge: ch }}
                      >
                        {ch.id}
                      </Link>
                    );
                  }
                  return (
                    <div
                      key={ch.id}
                      className={
                        ch.id === 24 ? "box disabled special" : "box disabled"
                      }
                      style={{ background: isSolved ? "green" : "transparent" }}
                      title={
                        isSolved
                          ? "You already solved it"
                          : `Available ${moment().to(ch.visible)}`
                      }
                    >
                      {ch.id}
                    </div>
                  );
                });
              }
              return null;
            }}
          </FirebaseDatabaseNode>
        </div>
      </div>
    </div>
  );
};

export default ChallengeList;
