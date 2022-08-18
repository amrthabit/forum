import React from "react";

// returns form values and setters
// takes error validation test
export function useField(test) {
  const [text, set] = React.useState("");
  const [error, setError] = React.useState(false);
  // use argument instead of text for instant update
  const validate = (value = text) => {
    const res = test(value);
    setError(res);
    return res;
  };
  return {
    text,
    set,
    setError,
    error,
    validate,
  };
}
