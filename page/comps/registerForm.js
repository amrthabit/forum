// todo!: split up component

// make material ui form
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button as MuiButton,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import "typeface-roboto";
import { useRegisterMutation } from "../src/generated/graphql";
import Alert from "./alert";
import Button from "./button";
import UsernameHint from "../utils/registerUsernameHint";
import { userAgentFromString } from "next/server";

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
  const [text, set] = useState("");
  const [error, setError] = useState(false);
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

export default function MuiForm(props) {
  const theme = props.theme;
  const displaySize = props.displaySize;

  const router = useRouter();
  // graphql code generated using @graphql-codegen
  const [, register] = useRegisterMutation();

  const [buttonStatus, setButtonStatus] = useState("enabled");
  const [buttonColor, setButtonColor] = useState("primary");

  const [alertStatus, setAlertStatus] = useState("false");
  const [alertMsg, setAlertMsg] = useState("");

  const [showComponent, setShowComponent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowComponent(true);
    }, 100);
    if (showComponent) {
      clearTimeout(timeout);
    }
  }, []);

  // initiate all form values inside object form
  const useForm = {
    firstName: useField(() => false),
    lastName: useField(() => false),
    userName: useField((value) => !/^([A-Za-z][A-Za-z_\d]+)$/.test(value)), // alphanumeric+`_` starting with letter
    email: useField((value) => !/^.+@.+\..+$/.test(value)),
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
      useForm.firstName.set("");
      useForm.lastName.set("");
      useForm.userName.set("");
      useForm.email.set("");
      useForm.password.set("");
      useForm.password.setError(false);
    },
    validate: () => {
      return [
        useForm.userName.validate(),
        useForm.email.validate(),
        useForm.password.validate(),
      ];
    },
  };

  const submitForm = async () => {
    setButtonStatus("sending");
    setAlertStatus("false");

    const response = await register({
      firstName: useForm.firstName.text,
      lastName: useForm.lastName.text,
      userName: useForm.userName.text,
      email: useForm.email.text,
      password: useForm.password.text,
    });

    // if we don't have data or data.reister.status == "failed"
    if (response.data?.register.status !== "successful") {
      setButtonColor("error");
      setTimeout(() => {
        if (response.data) {
          setAlertMsg(response.data.register.message);
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
        if (useForm.userName.text.length < 13) {
          setAlertMsg(`${useForm.userName.text} signed up!`);
        } else {
          setAlertMsg(
            `${useForm.userName.text.substring(0, 13)}... signed up!`
          );
        }
        useForm.reset();
        3;
      }, 200);
    }
    // time to server response + 200ms for resubmission
    setTimeout(() => {
      setButtonStatus("enabled");
    }, 200);
  };

  // todo: refactor this function
  const handleSubmitForm = () => {
    setButtonStatus("disabled");
    const [usernameErr, emailErr, passwordErr] = useForm.validate();

    // required fields check
    if (usernameErr || emailErr || passwordErr) {
      setButtonColor("error");

      // remove other message first before warning
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
      handleSubmitForm();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          transition: "all 0.3s ease-out",
          width: ["xs", "sm"].includes(displaySize) ? "100%" : 450,
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
          marginTop: ["xs", "sm"].includes(displaySize) ? 10 : 100,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          style={{
            transition: "all 0.3s",
            position: "relative",
            maxHeight: showComponent ? 1000 : 0,

            overflow: "hidden",
            background: theme.palette.background.default,
            borderRadius: ["xs", "sm"].includes(displaySize) ? 0 : 15,
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
                  // md, lg and xl
                  padding: 40,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: theme.palette.background.border,
                }),
          }}
        >
          <div>
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
              Create your account
            </div>
            <div
              style={{
                display: "flex",
                transition: "all 0.5s",
                flexDirection: "row",
                width: "100%",
                height: ["xs", "sm"].includes(displaySize) ? 92 : 38,
                marginBottom: 17,
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
                  width: ["xs", "sm"].includes(displaySize) ? "100%" : 178,
                  height: 30,
                  marginBottom: ["xs", "sm"].includes(displaySize) ? 17 : 0,
                }}
                inputProps={{ maxLength: 12 }}
                onKeyDown={handleEnter}
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
                  position: "absolute",
                  width: ["xs", "sm"].includes(displaySize)
                    ? `calc(100% - ${displaySize === "xs" ? "40" : "100"}px)`
                    : 178,
                  height: 30,
                  right: ["xs", "sm"].includes(displaySize) ? "auto" : 40,
                  transition: "all 0.3s ease-in-out",
                  marginTop: ["xs", "sm"].includes(displaySize) ? 62.5 : 8,
                }}
                inputProps={{ maxLength: 12 }}
                onKeyDown={handleEnter}
              />
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
              <UsernameHint username={useForm.userName.text} />
            </Collapse>
            <TextField
              name="email"
              label="Email"
              margin="dense"
              size="small"
              value={useForm.email.text}
              required
              disabled={buttonStatus === "sending"}
              error={useForm.email.error}
              onChange={useForm.set}
              onBlur={useForm.set}
              onFocus={useForm.set}
              style={{
                width: "100%",
                marginTop: 15,
                marginBottom: 0,
              }}
              inputProps={{ maxLength: 50 }}
              onKeyDown={handleEnter}
            />
            <Collapse in={useForm.email.error} style={errorMessage}>
              Invalid Email
            </Collapse>
            <FormControl
              variant="outlined"
              margin="dense"
              size="small"
              required
              error={useForm.password.error}
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: 14,
              }}
            >
              <InputLabel htmlFor="password-field">Password</InputLabel>
              <OutlinedInput
                id="password-field"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                disabled={buttonStatus === "sending"}
                value={useForm.password.text}
                onChange={useForm.set}
                onBlur={useForm.set}
                onFocus={useForm.set}
                style={{ width: "100%" }}
                inputProps={{ maxLength: 100 }}
                onKeyDown={handleEnter}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle possword visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Collapse in={useForm.password.error} style={errorMessage}>
              Use 8 or more characters
            </Collapse>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingTop: 35,
              }}
            >
              <MuiButton
                variant="text"
                theme={theme}
                onClick={() => {
                  setShowComponent(false);
                  setAlertStatus("false");
                  setTimeout(() => router.push("/login"), 300);
                }}
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
