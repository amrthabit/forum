// todo!: split up component

// make material ui form
import React from "react";
import { useState, useEffect } from "react";
import TransitionGroup from "react-transition-group/TransitionGroup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "./button";
import Alert from "./alert";
import LinearProgress from "@mui/material/LinearProgress";

import {
  IconButton,
  Box,
  TextField,
  Collapse,
  ThemeProvider,
  Button as MuiButton,
} from "@mui/material";

import "typeface-roboto";
import useDeviceSize from "./useDeviceSize";
import { useLoginMutation } from "../src/generated/graphql";
import { useRouter } from "next/router";
import { useField } from "./useField";

// style for small error below field
const errorMessage = {
  fontFamily: "Roboto",
  color: "#e83f33",
  textAlign: "left",
  fontSize: "12px",
  marginTop: "1px",
  marginLeft: "15px",
};

export default function LoginForm(props) {
  const [progress, setProgress] = React.useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const routeTime = 2500;

  // todo: use pure css instead of this
  if (showProgress) {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return clearInterval(timer);
        }
        return oldProgress + 1;
      });
    }, routeTime/7);
  }

  const theme = props.theme;
  const displaySize = props.displaySize;

  const router = useRouter();
  const [, login] = useLoginMutation();

  const [buttonStatus, setButtonStatus] = useState("enabled");
  const [buttonColor, setButtonColor] = useState("primary");

  const [alertStatus, setAlertStatus] = useState("false");
  const [alertMsg, setAlertMsg] = useState("");

  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowComponent(true);
    }, 100);
    if (showComponent) {
      clearTimeout(timeout);
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // initiate all form values inside object form
  const useForm = {
    userName: useField((value) => !/^([A-Za-z][A-Za-z_\d]+)$/.test(value)), // alphanumeric+`_` starting with letter
    password: useField((value) => value.length < 8),
    set: (e) => {
      useForm[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || useForm[e.target.name].error === true) {
        useForm[e.target.name].validate(e.target.value);
      }
      setAlertStatus("false");
      setButtonColor("primary");
    },
    reset: () => {
      useForm.userName.set("");
      useForm.password.set("");
      useForm.password.setError(false);
    },
    validate: () => {
      return [useForm.userName.validate(), useForm.password.validate()];
    },
  };

  const submitForm = async () => {
    setButtonStatus("sending");
    setAlertStatus("false");
    const response = await login({
      userName: useForm.userName.text,
      password: useForm.password.text,
    });
    if (response.error) {
      response.error.graphQLErrors.forEach((error) => {
        console.error(error.extensions.code);
        console.info(
          Object.fromEntries(
            ["name", "severity", "code"].map((key) => [
              key,
              error.extensions.exception[key],
            ])
          )
        );
      });
    }

    // if we don't have data or data.login.status == "failed"
    if (response.data?.login.status !== "successful") {
      setButtonColor("error");
      setTimeout(() => {
        if (response.data) {
          setAlertMsg(response.data.login.message);
        } else {
          console.error(response);
          setAlertMsg("Unexpected error. Try again later.");
        }
        setAlertStatus("error");
      }, 200);
    } else {
      setTimeout(() => {
        setButtonColor("success");
        setAlertStatus("success");
        // keep alert message length at bay
        if (useForm.userName.text.length < 20) {
          setAlertMsg(`${useForm.userName.text} logged in!`);
        } else {
          setAlertMsg(
            `${useForm.userName.text.substring(0, 19)}... logged in!`
          );
        }
        useForm.reset();
        setShowProgress(true);
        setProgress(0);
        setTimeout(() => {
          router.push("/");
        }, routeTime);
      }, 200);
    }
    // 200 ms for resubmission
    setTimeout(() => {
      setButtonStatus("enabled");
    }, 200);
  };

  const handleSend = () => {
    setButtonStatus("disabled");

    const [nameErr, passwordErr] = useForm.validate();

    // required fields check
    if (nameErr || passwordErr) {
      setButtonColor("error");

      if (alertStatus !== "warning" && alertStatus !== "false") {
        setAlertStatus("false");
        setTimeout(() => {
          setAlertStatus("warning");
        }, 200);
      } else {
        setAlertStatus("warning");
      }
      setAlertMsg("Please fill out all required fields");
      setTimeout(() => {
        setButtonColor("primary");
        setTimeout(() => {
          setButtonColor("error");
          setTimeout(() => {
            setButtonColor("primary");
          }, 100);
        }, 150);
      }, 150);

      setButtonStatus("enabled");
    } else {
      submitForm();
    }
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          background: theme.palette.background.primary,
          transition: "all 0.3s ease-out",
          width: ["xs", "sm"].includes(displaySize) ? "100%" : 450,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: ["xs", "sm"].includes(displaySize) ? 10 : 100,
        }}
      >
        <Box
          //todo*: fix last name animation

          component="form"
          noValidate
          autoComplete="off"
          style={{
            background: ["xs", "sm"].includes(displaySize)
              ? "inherit"
              : theme.palette.background.default,
            transition: "all 0.3s ease-in-out",
            borderRadius: ["xs", "sm"].includes(displaySize) ? 0 : 15,
            // border: `1px solid ${theme.palette.divider}`,
            boxShadow: ["xs", "sm"].includes(displaySize)
              ? "0px 0px 0px"
              : `0px 0px 20px ${theme.palette.background.shadow}`,
            ...(displaySize === "xs"
              ? {
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 20,
                  paddingBottom: 30,
                }
              : displaySize === "sm"
              ? {
                  paddingLeft: 50,
                  paddingRight: 50,
                  paddingTop: 50,
                  paddingBottom: 30,
                }
              : {
                  // lg and xl
                  padding: 40,
                }),
            position: "relative",
            zIndex: 1,
            maxHeight: showComponent ? 300 : 0,
            overflow: "hidden",
          }}
        >
          <LinearProgress
            hidden={true}
            variant="determinate"
            value={progress}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              margin: 0,
              height: 4,
              width: "100%",
              opacity: showProgress ? 1 : 0,
            }}
          />
          <div
            style={{
              height: 60,
              display: "flex",
              marginTop: 10,
              fontFamily: "roboto, sans",
              fontSize: 28,
              marginLeft: 12,
              fontWeight: 300,
              color: theme.palette.text.primary,
              transition: "all 0.3s",
              opacity: showComponent ? 1 : 0,
            }}
          >
            Login to your account
          </div>
          <TextField
            name="userName"
            label="Username"
            margin="dense"
            size="small"
            value={useForm.userName.text}
            required
            disabled={buttonStatus === "sending"}
            error={useForm.userName.error}
            onChange={useForm.set}
            onBlur={useForm.set}
            onFocus={useForm.set}
            style={{
              width: "100%",
              marginBottom: 0,
            }}
            inputProps={{ maxLength: 30 }}
            onKeyDown={handleEnter}
          />
          <Collapse in={useForm.userName.error} style={errorMessage}>
            {"Username invalid"}
          </Collapse>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              name="password"
              label="Password"
              margin="dense"
              size="small"
              required
              type={showPassword ? "text" : "password"}
              disabled={buttonStatus === "sending"}
              value={useForm.password.text}
              onChange={useForm.set}
              error={useForm.password.error}
              onBlur={useForm.set}
              onFocus={useForm.set}
              style={{
                width: "100%",
                marginTop: 15,
                marginBottom: 0,
              }}
              inputProps={{ maxLength: 100 }}
              onKeyDown={handleEnter}
            />
            <IconButton
              aria-label="delete"
              sx={{
                width: 50,
                height: 50,
                marginTop: 1.3,
                marginBottom: "auto",
                marginLeft: 2,
                marginRight: 1,
                transition: "all 0.3s",
                ":hover, :focus-visible": {
                  background: theme.palette.background.hover,
                  boxShadow: `0px 0px 20px ${theme.palette.background.shadow}`,
                },
              }}
              onClick={handleClickShowPassword}
              disableRipple
            >
              <VisibilityOffIcon
                style={{
                  opacity: showPassword ? 1 : 0,
                  transition: "all 0.3s",
                  scale: "1.5",
                  marginLeft: 1,
                  marginTop: 1,
                  color: theme.palette.text.secondary,
                }}
              />
              <VisibilityIcon
                style={{
                  marginLeft: 1,
                  marginTop: 1,
                  scale: "1.5",
                  opacity: showPassword ? 0 : 1,
                  position: "absolute",
                  transition: "all 0.3s",
                  color: theme.palette.text.secondary,
                }}
              />
            </IconButton>
          </div>
          <Collapse in={useForm.password.error} style={errorMessage}>
            {useForm.password.length === 0
              ? "Enter password"
              : "Invalid Password"}
          </Collapse>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              paddingTop: 35,
            }}
          >
            <MuiButton
              onClick={() => {
                setAlertStatus("false");
                setShowComponent(false);
                setTimeout(() => router.push("/register"), 300);
              }}
              variant="text"
              theme={theme}
              style={{
                marginTop: 15,
                width: 140,
                fontSize: 16,
                // fontWeight: 500,
                textTransform: "none",
                color: theme.palette.text.accent,
              }}
            >
              Create account
            </MuiButton>
            <Button
              color={buttonColor}
              alert={alertStatus}
              buttonStatus={buttonStatus}
              alertMsg={alertMsg}
              onClick={handleSend}
              text="Sign in"
            />
          </div>
        </Box>
        <TransitionGroup>
          {alertStatus !== "false" && (
            <Collapse
              in={true}
              style={{ position: "relative", zIndex: -1, width: "100%" }}
            >
              <Alert
                severity={alertStatus}
                message={alertMsg}
                displaySize={displaySize}
              />
            </Collapse>
          )}
        </TransitionGroup>
      </div>
    </ThemeProvider>
  );
}
