import { navigate, Redirect } from "@reach/router";
import axios from "axios";
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
  const { challenge, isSolved } = location.state;

  const validateAnswer = async (day) => {
    try {
      console.log(value);
      const resp = await axios.post(
        "http://localhost:8080/validate",
        {
          day,
          answer: value,
          user: localStorage.getItem("username"),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(resp.data.status);
      if (resp.data.status) {
        setResponse(resp.data.status);
        setValue("");
        setIsAnswered(true);
      } else {
        setResponse(resp.data.status);
        setValue("");
        setIsAnswered(true);
      }
    } catch (err) {
      console.log(err, err.message);
    }
  };

  return (
    <>
      <h1>{challenge.title}</h1>
      <div id="tags">
        {challenge.tags.split(",").map((tag, i) => (
          <Tag key={i}>{tag}</Tag>
        ))}
      </div>
      {/* <div
        style={{ lineHeight: "1.5rem", overflowWrap: "anywhere" }}
        dangerouslySetInnerHTML={{ __html: challenge.body }}
      ></div> */}
      <div style={{ lineHeight: "1.5rem", overflowWrap: "anywhere" }}>
        Alice with her friends are sledding on hill which they described by a
        function f(x)=arc_tan(x)+arc_tan(x+6). What is the speed of sledge at
        the point x=-12 when starting at the point x=6? Assume no friction,
        round the answer to 1 decimal place and use <b>g=9.81</b>.<br />
        <img src="https://i.ibb.co/RHTPJFT/Untitled.png" alt="" />
        <br />
      </div>
      {(!isAnswered || !response) && !isSolved && (
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
            onClick={() => validateAnswer(challenge.id)}
            disabled={value === ""}
          >
            submit
          </button>
        </div>
      )}
      {isAnswered && (response ? <Correct /> : <Incorrect />)}
      {isAnswered && response && (
        <div style={{ marginTop: "1rem" }}>
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
