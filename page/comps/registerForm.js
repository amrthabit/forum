// todo!: split up component

// make material ui form
import React from "react";
import { useState, useEffect } from "react";
import TransitionGroup from "react-transition-group/TransitionGroup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "./form/button";
import Alert from "./form/alert";

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
import { useRegisterMutation } from "../src/generated/graphql";

// style for small error shown below field
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
function useField(test) {
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

const REGISTER_MUTATION = ``;

export default function MuiForm(props) {
  const theme = props.theme;

  const [displaySize] = useDeviceSize();

  // graphql code generated using @graphql-codegen
  const [, register] = useRegisterMutation();

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
  const useForm = {
    firstName: useField(() => false),
    lastName: useField(() => false),
    userName: useField((value) => !/^([A-Za-z][A-Za-z_\d]+)$/.test(value)), // alphanumeric+`_` starting with letter
    password: useField((value) => value.length < 8),
    set: (e) => {
      useForm[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || useForm[e.target.name].error === true) {
        useForm[e.target.name].validate(e.target.value);
      }
      setAlertStatus(false);
      setButtonColor("primary");
    },
    reset: () => {
      useForm.firstName.set("");
      useForm.lastName.set("");
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
    setAlertStatus(false);

    await register({
      firstName: useForm.firstName.text,
      lastName: useForm.lastName.text,
      userName: useForm.userName.text,
      password: useForm.password.text,
    });

    const error = false;
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
        if (useForm.userName.text.length < 20) {
          setAlertMsg(`${useForm.userName.text} signed up!`);
        } else {
          setAlertMsg(
            `${useForm.userName.text.substring(0, 19)}... signed up!`
          );
        }
        useForm.reset();
      }, 200);
    }
    // time to server response + 200 ms for resubmission
    setTimeout(() => {
      setButtonStatus("enabled");
    }, 200);
  };

  // todo: refactor this function
  const handleSubmitForm = () => {
    setButtonStatus("disabled");
    const [usernameErr, passwordErr] = useForm.validate();

    // required fields check
    if (usernameErr || passwordErr) {
      setButtonColor("error");

      // remove other message first before warning
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
          position: "relative",
          marginTop: ["xs", "sm"].includes(displaySize) ? 0 : 100,
        }}
      >
        <div
          style={{
            color: theme.palette.text.primary,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Box>
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
                        {" "}
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
                          Create your account
                        </div>
                      </Collapse>
                    )}
                    {counter > 1 && (
                      <Collapse style={{ marginBottom: 17 }}>
                        <div
                          style={{
                            display: "flex",
                            transition: "all 0.5s",
                            flexDirection: ["xs", "sm"].includes(displaySize)
                              ? "row"
                              : "row",
                            width: "100%",
                            height: ["xs", "sm"].includes(displaySize)
                              ? 92
                              : 38,
                          }}
                        >
                          <TextField
                            name="firstName"
                            label="First name"
                            margin="dense"
                            size="small"
                            value={useForm.firstName.text}
                            disabled={buttonStatus === "sending"}
                            error={useForm.firstName.error}
                            onChange={useForm.set}
                            onBlur={useForm.set}
                            onFocus={useForm.set}
                            style={{
                              width: ["xs", "sm"].includes(displaySize)
                                ? "100%"
                                : 178,
                              height: 30,
                              marginBottom: ["xs", "sm"].includes(displaySize)
                                ? 17
                                : 0,
                            }}
                            inputProps={{ maxLength: 12 }}
                          />
                          <TextField
                            name="lastName"
                            label="Last name"
                            margin="dense"
                            size="small"
                            value={useForm.lastName.text}
                            disabled={buttonStatus === "sending"}
                            error={useForm.lastName.error}
                            onChange={useForm.set}
                            onBlur={useForm.set}
                            onFocus={useForm.set}
                            style={{
                              width: ["xs", "sm"].includes(displaySize)
                                ? `calc(100% - ${
                                    displaySize === "xs" ? "40" : "100"
                                  }px)`
                                : 178,
                              height: 30,
                              position: "absolute",
                              right: ["xs", "sm"].includes(displaySize)
                                ? "auto"
                                : 40,
                              transition: "all 0.3s ease-in-out",
                              marginTop: ["xs", "sm"].includes(displaySize)
                                ? 62.5
                                : 8,
                            }}
                            inputProps={{ maxLength: 12 }}
                          />
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
                        />
                      </Collapse>
                    )}
                    {useForm.userName.error && (
                      // todo!: make function for this monstrosity vv
                      <Collapse style={errorMessage}>
                        {useForm.userName.text.length < 2
                          ? "Enter your username"
                          : !/^[A-Za-z]$/.test(useForm.userName.text.charAt(0))
                          ? "Username must start with a letter"
                          : /^.* .*$/.test(useForm.userName.text)
                          ? "No spaces allowed"
                          : !/^[A-Za-z_\d]*$/.test(useForm.userName.text)
                          ? "The only symbol you can use is underscore"
                          : "Username must be alphanumeric"}
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
                              // background:'red'
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
                    {useForm.password.error && (
                      <Collapse style={errorMessage}>
                        Use 8 or more characters
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
                            href="/login"
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
                            Sign in instead
                          </MuiButton>
                          <Button
                            color={buttonColor}
                            alert={alertStatus}
                            buttonStatus={buttonStatus}
                            alertMsg={alertMsg}
                            onClick={handleSubmitForm}
                            text="Sign up"
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
