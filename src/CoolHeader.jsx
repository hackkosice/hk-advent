import React, { useEffect, useRef } from "react";
import useAutotype from "./useAutotype";

export const CoolHeader = ({ setDone }) => {
  const firstTextRef = useRef();
  const secondTextRef = useRef();
  const thirdTextRef = useRef();
  const fourthTextRef = useRef();

  useAutotype(
    "Hi again! Let's have fun with some challenges during this Advent time.",
    0,
    firstTextRef
  );
  useAutotype(
    "Every day there will be one challenge to solve.",
    1500,
    secondTextRef
  );
  useAutotype("No winners, no losers, just pure joy :)", 3000, thirdTextRef);
  useAutotype("Are you ready?", 4000, fourthTextRef, false);

  useEffect(() => {
    if (
      fourthTextRef.current &&
      fourthTextRef.current.innerText === "Are you ready?"
    ) {
      setDone(true);
    }
  });

  return (
    <div style={{ minHeight: "50vh" }}>
      <p ref={firstTextRef} />
      <p ref={secondTextRef} />
      <p ref={thirdTextRef} />
      <h2
        ref={fourthTextRef}
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        {" "}
      </h2>
    </div>
  );
};
