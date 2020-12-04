import React, { useContext, useEffect, useState } from "react";
import { Link } from "@reach/router";
import moment from "moment";
import { ChallengeContext } from "./App";
import useWindowWidth from "./useWindowWidth";
import axios from "axios";

const ChallengeList = () => {
  const date = useContext(ChallengeContext);
  const width = useWindowWidth();
  const [solved, setSolved] = useState([]);
  const [challenges, setChallenges] = useState(
    [...Array(24)].map((_, i) => ({
      id: i + 1,
      body: "",
      title: "",
      visible: `2020-12-${(i + 1).toString().padStart(2, "0")}T00:00:00`,
      tags: "",
    }))
  );

  useEffect(() => {
    axios("https://hka-validator.herokuapp.com/challenges").then((data) =>
      setChallenges([
        ...data.data.data,
        ...challenges.slice(data.data.data.length),
      ])
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axios
      .post(
        "https://hka-validator.herokuapp.com/solved",
        {
          user: localStorage.getItem("username"),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((data) => {
        setSolved(data.data.status);
      });
  }, []);

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
          {challenges.map((ch) => {
            const isSolved = solved.includes(ch.id - 1);
            if (moment().isAfter(ch.visible)) {
              return (
                <Link
                  key={ch.id}
                  to={`/challenges/${ch.id}`}
                  className={ch.id === 24 ? "box special" : "box"}
                  style={{ background: isSolved ? "green" : "transparent" }}
                  state={{ challenge: ch, isSolved }}
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
                title={`Available ${moment().to(ch.visible)}`}
              >
                {ch.id}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChallengeList;
