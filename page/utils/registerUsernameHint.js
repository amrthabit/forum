import { useEffect, useState } from "react";

export default  ({ username, ...props }) => {
  const [hint, setHint] = useState("the quick");

  useEffect(() => {
    if (username.length < 2) {
      setHint("Enter your username");
    } else if (!/^[A-Za-z]$/.test(username.charAt(0))) {
      setHint("Username must start with a letter");
    } else if (/^.* .*$/.test(username)) {
      setHint("No spaces allowed");
    } else if (!/^[A-Za-z_\d]*$/.test(username)) {
      setHint("The only symbol you can use is underscore");
    }
  }, [username]);

  return <div>{hint}</div>;
};
