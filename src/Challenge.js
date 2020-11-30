import { navigate, Redirect } from "@reach/router";
import { FirebaseDatabaseTransaction } from "@react-firebase/database";
import React, { useState } from "react";
import { FacebookProvider, Share } from "react-facebook";

const Tag = ({ children }) => {
  return <p id="tag">{children}</p>;
};

const Correct = () => <p style={{ marginLeft: "1rem" }}>&#x2714; Correct</p>;
const Incorrect = () => (
  <p style={{ marginLeft: "1rem" }}>&#x274c; Incorrect</p>
);

const Challenge = ({ location }) => {
  const [value, setValue] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [response, setResponse] = useState(false);

  if (!location.state) {
    return <Redirect noThrow={true} to="/challenges" />;
  }
  const { challenge } = location.state;

  const validateAnswer = () => {
    const { answer } = challenge;
    setResponse(value === answer);
    setValue("");
    setIsAnswered(true);
  };

  return (
    <>
      <h1>{challenge.title}</h1>
      <div id="tags">
        {challenge.tags.split(",").map((tag, i) => (
          <Tag key={i}>{tag}</Tag>
        ))}
      </div>
      <div
        style={{ lineHeight: "1.5rem", overflowWrap: "anywhere" }}
        dangerouslySetInnerHTML={{ __html: challenge.body }}
      ></div>
      {(!isAnswered || !response) && (
        <div className="input">
          <input
            type="text"
            name="answer"
            placeholder="Your answer"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className={value === "" ? "btn disabled" : "btn"}
            onClick={validateAnswer}
            disabled={value === ""}
          >
            submit
          </button>
        </div>
      )}
      {isAnswered && (response ? <Correct /> : <Incorrect />)}
      {isAnswered && response && (
        <div style={{ marginTop: "1rem" }}>
          <FirebaseDatabaseTransaction path={`submissions/${challenge.id - 1}`}>
            {({ runTransaction }) => {
              const username = localStorage.getItem("username");
              runTransaction({
                reducer: (val) => {
                  if (val === null) {
                    return [username];
                  } else {
                    if (val.includes(username)) {
                      return val;
                    }
                    return [...val, username];
                  }
                },
              });
              // setTimeout(() => navigate("/challenges"), 3000);
              return <></>;
            }}
          </FirebaseDatabaseTransaction>
          <FacebookProvider appId="1075131816290966">
            <Share
              quote={`I solved Day ${challenge.id} challenge of the Hack Kosice Advent Calendar!`}
            >
              {({ handleClick, loading }) => (
                <button
                  className="fb-btn"
                  type="button"
                  disabled={loading}
                  onClick={handleClick}
                >
                  Share
                </button>
              )}
            </Share>
          </FacebookProvider>
          <button onClick={() => navigate("/challenges")} className="btn">
            Back
          </button>
        </div>
      )}
    </>
  );
};

export default Challenge;
