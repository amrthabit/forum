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
import { Box } from "@mui/material";

// todo: abstract sizing thing
const pagesLeft = [
  ["create post", "/submit"],
  ["form clique", "/newclique"],
];

const HamburgerMenu = (props) => (
  <>
    <MenuIcon
      sx={{
        transition: "all 0.3s",
        width: 28,
        height: 30,
        margin: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: props.theme.palette.background.paper,
        color: props.theme.palette.text.primary,
        cursor: "pointer",
        ":hover, :focus-visible": {
          background: props.theme.palette.background.hover,
          borderColor: props.theme.palette.text.primary,
        },
      }}
      onClick={props.handleOpenNavMenu}
    />
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
              props.router.push(href);
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

function MuiHeader({ displaySize, ...props }) {
  const theme = props.theme;
  const router = useRouter();
  const [anchorNav, setAnchorNav] = React.useState(null);
  const [anchorUser, setAnchorUser] = React.useState(null);
  const [{ data, fetching }] = useMeQuery({
    // pause: isServer,
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
          // tested with maximum possible width characters down to 320px
          <Box sx={{ color: data.me.isAdmin ? "red" : "inherit" }}>
            {data.me.userID.length > 5
              ? data.me.userID.slice(0, 5)
              : data.me.userID}
          </Box>,
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
  

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          minWidth: 320,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: "all 0.3s ease-in-out",
          height: ["xs", "sm"].includes(displaySize) ? 40 : 50,
          zIndex: 10,
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
        }}
      >
        <div
          id="header-flex-div"
          style={{
            margin: "auto",
            maxWidth: 1100,
            transition: "inherit",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            paddingLeft: ["xs", "sm"].includes(displaySize) ? 8 : 16,
            paddingRight: ["xs", "sm"].includes(displaySize) ? 8 : 16,
            overflow: "hidden",
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
              height: 38,
            }}
          >
            <Box
              id="10"
              orientation="horizontal"
              sx={{
                display: "flex",
                width: ["xs", "sm"].includes(displaySize) ? 30 : 0,
                transition: "all 0.3s",
                overflow: "hidden",
              }}
            >
              <HamburgerMenu
                handleOpenNavMenu={handleOpenNavMenu}
                theme={theme}
                anchorElNav={anchorNav}
                handleCloseNavMenu={handleCloseNavMenu}
                router={router}
              />
            </Box>

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
                margin: "auto",
                marginRight: 1,
                marginLeft: 1,
                fontSize: 20,
                width: 90,
                height: 36,
              }}
            >
              Forum
            </MenuButton>
            <Box
              sx={{
                width: ["md", "lg", "xl"].includes(displaySize) ? 240 : 0,
                transition: "all 0.3s",
                margin: "auto",
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                overflow: "hidden",
              }}
            >
              {pagesLeft.map(([page, href]) => (
                <MenuButton id={page} theme={theme} key={page} href={href}>
                  {page}
                </MenuButton>
              ))}
            </Box>
          </div>
          <TransitionGroup
            id="header-right"
            style={{
              transition: "inherit",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft: "auto",
            }}
          >
            {pagesRight().map(([page, handler]) => (
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
            ))}
            <Collapse id="16" orientation="horizontal">
              <Button
                id="switch theme"
                aria-label="switch theme button"
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
      </Box>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient)(MuiHeader);
