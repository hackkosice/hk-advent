import { useEffect, useState } from "react";

const useAutotype = (
  text,
  initialTimeout = 0,
  ref = null,
  cursorVisible = true
) => {
  const [renderedText, setRenderedText] = useState("");
  useEffect(() => {
    setTimeout(() => {
      if (text !== renderedText) {
        if (renderedText.length === 0) {
          setTimeout(() => {
            cursorVisible && ref.current.classList.add("active");
            ref.current.innerText = renderedText + text[renderedText.length];
            ref.current.isDone = false;
            setRenderedText(renderedText + text[renderedText.length]);
          }, initialTimeout);
        } else {
          ref.current.innerText = renderedText + text[renderedText.length];
          setRenderedText(renderedText + text[renderedText.length]);
        }
      } else {
        if (ref) {
          setTimeout(() => {
            if (cursorVisible) {
              ref.current.classList.remove("active");
              ref.current.isDone = true;
            }
          }, 1000);
        }
      }
    }, 30);
  }, [renderedText, cursorVisible, initialTimeout, ref, text]);
  return ref.current && ref.current.isDone;
};

export default useAutotype;
