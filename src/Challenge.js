import React from "react";

const Tag = ({ children }) => {
  return <p id="tag">{children}</p>;
};
const Challenge = ({ location, id }) => {
  console.log(location.state);
  if (!location.state) {
    return null;
  }
  const { challenge } = location.state;
  return (
    <>
      <h1>{challenge.title}</h1>
      <div id="tags">
      <Tag>math</Tag>
      </div>
      <div
        style={{ lineHeight: "1.5rem" }}
        dangerouslySetInnerHTML={{ __html: challenge.body }}
      ></div>
      <div className="input">
        <input type="text" name="answer" placeholder="Your answer" />
        <button className="btn">submit</button>
      </div>
    </>
  );
};

export default Challenge;
