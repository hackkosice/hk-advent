import React, { useState } from "react";
import { CoolHeader } from "./CoolHeader";
import Countdown from "./Countdown";

const Home = () => {
  const [isDone, setDone] = useState(false);
  return (
    <>
      <CoolHeader setDone={setDone} />
      {isDone && <Countdown />}
    </>
  );
};

export default Home;
