import React, { useEffect } from "react";
import RegisterForm from "../comps/registerForm";
import Header from "../comps/headerV2";
import { Global, css } from "@emotion/react";
import { darkTheme, lightTheme } from "../comps/themes";
// todo: update theme comp

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
    <div
      style={{
        background: theme.palette.background.default,
        // todo? fix viewport shenanigans
        width: "100vw",
        height: "100vh",
        transition: "all 0.3s",
      }}
    >
      <Global
        styles={css`
          html {
            background: ${theme.palette.background.default};
            transition: all 1s;
          }
        `}
      />
      <Header
        theme={theme}
        themeMode={themeMode}
        switchTheme={handleSwitchTheme}
      />
      <RegisterForm theme={theme} />
    </div>
  );
};

export default Register;
