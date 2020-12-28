import React from "react";
import { CoolHeader } from "./CoolHeader";
import Countdown from "./Countdown";

const Home = () => {
  return (
    <>
      <CoolHeader />
      {<Countdown />}
    </>
  );
};

export default Home;
