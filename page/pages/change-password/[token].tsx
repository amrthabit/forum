import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/private-theming";
import { NextPage } from "next";
import { lightTheme } from "../../comps/themes";
import useDeviceSize from "../../comps/useDeviceSize";

// make material ui form
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Button as MuiButton,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import "typeface-roboto";
// import Alert from "./alert";
import Button from "../../comps/button";
import { useRouter } from "next/router";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const theme = lightTheme;
  const [displaySize] = useDeviceSize();
  const router = useRouter();

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
            maxHeight: 1000,

            overflow: "hidden",
            background: theme.palette.background.default,
            borderRadius: ["xs", "sm"].includes(displaySize) ? 0 : 15,
            boxShadow: ["xs", "sm"].includes(displaySize)
              ? "0px 0px 0px"
              : `0px 0px 20px ${(theme.palette.background as any).shadow}`,
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
                  borderColor: (theme.palette.background as any).border,
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
              }}
            >
              Create your account
            </div>
            {/* <FormControl
              variant="outlined"
              margin="dense"
              size="small"
              required
              error={false}
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginTop: 14,
              }}
            >
              <InputLabel htmlFor="password-field">Password</InputLabel> */}
              {/* <OutlinedInput
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
            </Collapse> */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingTop: 35,
              }}
            >
              <MuiButton
                variant="text"
                onClick={() => {
                  // setAlertStatus("false");
                  setTimeout(() => router.push("/login"), 300);
                }}
                style={{
                  marginTop: 15,
                  width: 140,
                  fontSize: 16,
                  // fontWeight: 500,
                  textTransform: "none",
                  color: (theme.palette.text as any).accent,
                }}
              >
                Sign in instead
              </MuiButton>
              <Button
                color="primary" //{buttonColor}
                // alert={alertStatus}
                // buttonStatus={buttonStatus}
                // alertMsg={alertMsg}
                // onClick={handleSubmitForm}
                text="Reset Password"
              />
            </div>
          </div>
        </Box>
        {/* <TransitionGroup>
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
        </TransitionGroup> */}
      </div>
    </ThemeProvider>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
