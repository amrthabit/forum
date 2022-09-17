import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import * as React from "react";
import TransitionGroup from "react-transition-group/TransitionGroup";
import { useLogoutMutation, useMeQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import isServer from "../utils/isServer";
import MenuButton from "./menuButton";
import useDeviceSize from "./useDeviceSize";

// todo: abstract sizing thing
const pagesLeft = [
  ["Play", "#play"],
  ["Leaderboard", "#leaderboard"],
  ["Events", "#events"],
];

const HamburgerMenu = (props) => (
  <>
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={props.handleOpenNavMenu}
      sx={{
        color: props.theme.palette.text.primary,
        transition: "all 0.3s ease-in-out",
        marginLeft: -1,
        // mui hamburger menu icon not centered??
        marginTop: 0.2,
      }}
    >
      <MenuIcon />
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={props.anchorElNav}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(props.anchorElNav)}
      onClose={props.handleCloseNavMenu}
      sx={{
        display: { xs: "block", md: "none" },
      }}
      disableScrollLock={true}
    >
      {pagesLeft.map(([page, href]) => (
        <MenuItem
          key={page}
          onClick={(e) => {
            props.handleCloseNavMenu();
            setTimeout(() => {
              e.preventDefault();
              let element = document.getElementById(href.substring(1));
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 10);
          }}
        >
          <Typography
            textAlign="center"
            sx={{ color: props.theme.palette.text.primary }}
          >
            {page}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  </>
);

function MuiHeader({ meQuery, ...props }) {
  const theme = props.theme;
  const router = useRouter();
  const [anchorNav, setAnchorNav] = React.useState(null);
  const [anchorUser, setAnchorUser] = React.useState(null);
  const [{ data, fetching }] = useMeQuery({
    pause: isServer,
  });
  const [, logout] = useLogoutMutation();

  const pagesRight = () => {
    if (fetching || !data || !data.me) {
      return [
        [
          "Sign In",
          () => {
            router.push("/login");
          },
        ],
        [
          "Register",
          () => {
            router.push("/register");
          },
        ],
      ];
    } else {
      return [
        [
          "Sign Out",
          () => {
            logout();
          },
        ],
        [
          data.me.userID.length > 8
            ? data.me.userID.slice(0, 7)
            : data.me.userID,
          () => {
            router.push(`/user/${data.me.userID}`);
          },
        ],
      ];
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorUser(null);
  };

  const [displaySize] = useDeviceSize();
  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        style={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: "all 0.3s ease-in-out",
          height: ["xs", "sm"].includes(displaySize) ? 40 : 50,
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          id="header-flex-div"
          style={{
            width: "100%",
            transition: "inherit",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            maxWidth: 1100,
            margin: "auto",
          }}
        >
          <div
            id="header-left"
            style={{
              transition: "inherit",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: ["xs", "sm"].includes(displaySize) ? 10 : 20,
              marginRight: ["xs", "sm"].includes(displaySize) ? 10 : 0,
            }}
          >
            <Collapse
              in={["xs", "sm"].includes(displaySize)}
              id="10"
              orientation="horizontal"
            >
              <HamburgerMenu
                handleOpenNavMenu={handleOpenNavMenu}
                theme={theme}
                anchorElNav={anchorNav}
                handleCloseNavMenu={handleCloseNavMenu}
              />
            </Collapse>

            <MenuButton
              theme={theme}
              id="name"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              variant="text"
              onClick={() => {
                router.push("/");
              }}
              style={{
                color: theme.palette.text.primary,
                textDecoration: "none",
                marginLeft: 0,
                margin: "auto",
                fontSize: 20,
                padding: 1,
              }}
            >
              XOXO
            </MenuButton>
            <Collapse
              component="div"
              in={["md", "lg", "xl"].includes(displaySize)}
              orientation="horizontal"
              style={{
                transition: "all 0.3s",
                margin: "auto",
                height: "2.3em",
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                width: "20em",
              }}
            >
              {pagesLeft.map(([page, href]) => (
                <MenuButton id={page} theme={theme} key={page} href={href}>
                  {page}
                </MenuButton>
              ))}
            </Collapse>
          </div>
          <TransitionGroup
            id="header-right"
            style={{
              transition: "inherit",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: ["xs", "sm"].includes(displaySize) ? 10 : 20,
            }}
          >
            {
              // ["xl", "lg", "md"].includes(displaySize) &&
              pagesRight().map(([page, handler]) => (
                <Collapse
                  key={page}
                  orientation="horizontal"
                  style={{ margin: "auto" }}
                >
                  <MenuButton
                    theme={theme}
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu();
                      handler();
                    }}
                  >
                    {page}
                  </MenuButton>
                </Collapse>
              ))
            }
            <Collapse id="16" orientation="horizontal">
              <Button
                disableRipple
                onClick={theme.switchTheme}
                sx={{
                  display: "flex",
                  transition: "all 0.1s ease-out",
                  cursor: "pointer",
                  borderRadius: "50%",
                  padding: 1,
                  margin: -1,
                  marginLeft: -0.2,
                  minWidth: 35,
                  minHeight: 35,
                  overFlow: "hidden",
                  ":hover, :focus-visible": {
                    background: theme.palette.background.hover,
                    boxShadow: `0px 2px 10px ${theme.palette.background.shadow}`,
                    borderRadius: "50%",
                    "> *": {
                      scale: "1.4",
                    },
                  },
                  ":active": {
                    transform: "rotate(45deg)",
                  },
                }}
              >
                <DarkModeIcon
                  sx={{
                    scale: "1.2",
                    transition: "all 0.3s",
                    color: "white",
                    opacity: props.theme.palette.mode == "light" ? 0 : 1,
                    position: "absolute",

                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: "auto",
                  }}
                />
                <LightModeIcon
                  sx={{
                    scale: "1.2",
                    transition: "all 0.3s",
                    color: "black",
                    opacity: props.theme.palette.mode == "light" ? 1 : 0,
                    margin: "auto",
                  }}
                />
              </Button>
            </Collapse>
          </TransitionGroup>
        </div>
      </AppBar>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient)(MuiHeader);
