import React from "react";
import { FirebaseDatabaseNode } from "@react-firebase/database";
import { Link } from "@reach/router";
import moment from 'moment';

const challenge = moment("2020-12-01T00:00:00");

const ChallengeList = () => {
  if(moment().isBefore(challenge)) {
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
        <img src="https://cdn.pixabay.com/photo/2016/03/27/19/02/desk-1283688_1280.jpg" alt="christmas" />
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
      }}
    >
      <h2>Challenge List</h2>
      <div className="challengeList">
        <FirebaseDatabaseNode path="challenges/">
          {(d) => {
            if (d.value) {
              return d.value.map((ch, i) => {
                if (ch.visible) {
                  return (
                    <Link
                      key={i}
                      to={`/challenges/${i + 1}`}
                      className={i+1 === 24 ? "box special" : "box"}
                      state={{ challenge: ch }}
                    >
                      {i + 1}
                    </Link>
                  );
                }
                return <div key={i} className={i+1 === 24 ? "box disabled special" : "box disabled"}>{i + 1}</div>;
              });
            }
            return null;
          }}
        </FirebaseDatabaseNode>
      </div>
    </div>
  );
};

export default ChallengeList;
