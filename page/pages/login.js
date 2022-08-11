import React, { useEffect } from "react";
import LoginForm from "../comps/loginForm";
import Header from "../comps/headerV2";
import { Global, css } from "@emotion/react";
import { darkTheme, lightTheme } from "../comps/themes";

const Register = () => {
  const [themeMode, setThemeMode] = React.useState("light");
  const [theme, setTheme] = React.useState(lightTheme);

  useEffect(() => {
    const themeOnStorage = localStorage.getItem("theme");
    if (typeof themeOnStorage === null) {
      localStorage.setItem("theme", "light");
    }
    if (themeOnStorage === "light") {
      setThemeMode("light");
      setTheme(lightTheme);
    } else {
      setThemeMode("dark");
      setTheme(darkTheme);
    }
  }, []);

  const handleSwitchTheme = () => {
    if (themeMode === "light") {
      localStorage.setItem("theme", "dark");
      setThemeMode("dark");
      setTheme(darkTheme);
    } else {
      localStorage.setItem("theme", "light");
      setThemeMode("light");
      setTheme(lightTheme);
    }
  };

  return (
    <div>
      <Global
        styles={css`
          html {
            background: ${theme.palette.background.default};
            transition: all 0.3s;
          }
          body {
            margin: 0;
          }
        `}
      />
      <Header
        theme={theme}
        themeMode={themeMode}
        switchTheme={handleSwitchTheme}
      />
      <LoginForm theme={theme} />
    </div>
  );
};

export default Register;
