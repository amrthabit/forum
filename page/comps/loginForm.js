// todo!: split up component

// make material ui form
import React from "react";
import { useState, useEffect } from "react";
import TransitionGroup from "react-transition-group/TransitionGroup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "./form/button";
import Alert from "./form/alert";
import loginUser from "../pages/api/loginUser";

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

// style for small error below field
const errorMessage = {
  fontFamily: "Roboto",
  color: "#e83f33",
  textAlign: "left",
  fontSize: "12px",
  marginTop: "1px",
  marginLeft: "15px",
};

// returns form values and setters
// takes error validation test
function useForm(test) {
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

export default function LoginForm(props) {
  const theme = props.theme;

  const [displaySize] = useDeviceSize();

  const [buttonStatus, setButtonStatus] = useState("enabled");
  const [buttonColor, setButtonColor] = useState("primary");

  const [alertStatus, setAlertStatus] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");


  const [counter, setCounter] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // count to 10 to stagger fields' intro
  // todo?: find better way
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCounter(counter + 1);
    }, 50);
    if (counter > 10) {
      clearTimeout(timeout);
    }
  }, [counter]);

  // initiate all form values inside object form
  const form = {
    firstName: useForm(() => false),
    lastName: useForm(() => false),
    userName: useForm((value) => !/^([A-Za-z][A-Za-z_\d]+)$/.test(value)), // alphanumeric+`_` starting with letter
    password: useForm((value) => value.length < 8),
    set: (e) => {
      form[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || form[e.target.name].error === true) {
        form[e.target.name].validate(e.target.value);
      }
      setAlertStatus(false);
      setButtonColor("primary");
    },
    reset: () => {
      form.firstName.set("");
      form.lastName.set("");
      form.userName.set("");
      form.password.set("");
      form.password.setError(false);
    },
    validate: () => {
      return [form.userName.validate(), form.password.validate()];
    },
  };

  const submitForm = async () => {
    setButtonStatus("sending");
    setAlertStatus(false);

    const error = await loginUser(form.userName.text, form.password.text);

    if (error) {
      setButtonColor("error");
      setTimeout(() => {
        setAlertMsg("Failed. Please try again later.");
        setAlertStatus("error");
      }, 200);
    } else {
      setTimeout(() => {
        setButtonColor("success");
        setAlertStatus("success");
        // keep alert message length at bay
        if (form.userName.text.length < 20) {
          setAlertMsg(`${form.userName.text} logged in!`);
        } else {
          setAlertMsg(`${form.userName.text.substring(0, 19)}... logged in!`);
        }
        form.reset();
      }, 200);
    }
    // 200 ms for resubmission
    setTimeout(() => {
      setButtonStatus("enabled");
    }, 200);
  };

  const handleSend = () => {
    setButtonStatus("disabled");

    const [nameErr, passwordErr] = form.validate();

    // required fields check
    if (nameErr || passwordErr) {
      setButtonColor("error");

      if (alertStatus !== "warning" && alertStatus !== false) {
        setAlertStatus(false);
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

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          background: theme.palette.background.primary,
          transition: "all 0.3s ease-out",
          width: ["xs", "sm"].includes(displaySize) ? "100%" : 450,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: ["xs", "sm"].includes(displaySize) ? 0 : 100,
        }}
      >
        <div
          style={{
            height: "100%",
            color: theme.palette.text.primary,
            transition: "all 0.3s ease-in-out",
            margin: "auto",
          }}
        >
          <Box
            style={{
              margin: "auto",
              transition: "all 0.3s",
            }}
          >
            <TransitionGroup>
              <Collapse style={{ position: "relative", zIndex: 1 }}>
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
                          borderStyle: "solid",
                          borderWidth: 1,
                          borderColor: theme.palette.background.border,
                        }),
                  }}
                >
                  <TransitionGroup>
                    {counter > 1 && (
                      <Collapse>
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
                          }}
                        >
                          Log in to your account
                        </div>
                      </Collapse>
                    )}
                    {counter > 1 && (
                      <Collapse>
                        <TextField
                          name="userName"
                          label="Username"
                          margin="dense"
                          size="small"
                          value={form.userName.text}
                          required
                          disabled={buttonStatus === "sending"}
                          error={form.userName.error}
                          onChange={form.set}
                          onBlur={form.set}
                          onFocus={form.set}
                          style={{
                            width: "100%",
                            marginBottom: 0,
                          }}
                          inputProps={{ maxLength: 30 }}
                        />
                      </Collapse>
                    )}
                    {form.userName.error && (
                      // todo!: refactor this monstrosity vv
                      <Collapse style={errorMessage}>
                        {"Username invalid"}
                      </Collapse>
                    )}
                    {counter > 2 && (
                      <Collapse>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <TextField
                            name="password"
                            label="Password"
                            margin="dense"
                            size="small"
                            required
                            type={showPassword ? "text" : "password"}
                            disabled={buttonStatus === "sending"}
                            value={form.password.text}
                            onChange={form.set}
                            error={form.password.error}
                            onBlur={form.set}
                            onFocus={form.set}
                            style={{
                              width: "100%",
                              marginTop: 15,
                              marginBottom: 0,
                            }}
                            inputProps={{ maxLength: 100 }}
                          />

                          <IconButton
                            aria-label="delete"
                            style={{
                              width: 70,
                              backgroundColor: "transparent",
                              scale: "1.4",
                              marginTop: "auto",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                            onClick={handleClickShowPassword}
                            disableRipple
                          >
                            <VisibilityOffIcon
                              style={{
                                visibility: !showPassword
                                  ? "hidden"
                                  : "visible",
                                opacity: showPassword ? 1 : 0,
                                transition: "all 0.3s",
                                color: theme.palette.text.secondary,
                              }}
                            />
                            <VisibilityIcon
                              style={{
                                visibility: !showPassword
                                  ? "visible"
                                  : "hidden",
                                opacity: showPassword ? 0 : 1,
                                position: "absolute",
                                transition: "all 0.3s",
                                color: theme.palette.text.secondary,
                              }}
                            />
                          </IconButton>
                        </div>
                      </Collapse>
                    )}
                    {form.password.error && (
                      <Collapse style={errorMessage}>
                        {form.password.length === 0
                          ? "Enter password"
                          : "Invalid Password"}
                      </Collapse>
                    )}
                    {counter > 4 && (
                      <Collapse>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingTop: 35,
                          }}
                        >
                          <MuiButton
                            href="/register"
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
                      </Collapse>
                    )}
                  </TransitionGroup>
                </Box>
              </Collapse>
              {alertStatus && (
                <Collapse
                  style={{ position: "relative", zIndex: 0, width: "100%" }}
                >
                  <Alert
                    severity={alertStatus}
                    message={alertMsg}
                    displaySize={displaySize}
                  />
                </Collapse>
              )}
            </TransitionGroup>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
}
