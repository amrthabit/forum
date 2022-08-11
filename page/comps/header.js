import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider } from "@mui/material";
import TransitionGroup from "react-transition-group/TransitionGroup";
import Collapse from "@mui/material/Collapse";
import Instagram from "@mui/icons-material/Instagram";
import LinkedIn from "@mui/icons-material/LinkedIn";
import GitHub from "@mui/icons-material/GitHub";
import Email from "@mui/icons-material/Email";
import Send from "@mui/icons-material/Send";
import Link from "@mui/material/Link";
import useDeviceSize from "./useDeviceSize";
import LightModeIcon from "@mui/icons-material/Brightness4";
import DarkModeIcon from "@mui/icons-material/Brightness7";

const pages = [
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
];

const contactMenu = [
  [<LinkedIn key="1" />, "https://www.linkedin.com/in/williamhgates"],
  [<GitHub key="2" />, "https://github.com/amrthabit"],
  [<Email key="3" />, "#contact"],
  [<Instagram key="4" />, "https://www.instagram.com/thbbit/"],
];

export default function MuiHeader(props) {
  const theme = props.theme;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [displaySize] = useDeviceSize();
  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        style={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: "all 0.3s ease-in-out",
          height: ["xs", "sm"].includes(displaySize) ? 40 : 60,
          width: "100%",
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
          <TransitionGroup 
            id="header-left"
            style={{
              transition: "inherit",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              // background: "red",
              margin: displaySize == "sm" ? 10 : 20,
            }}
          >
            {["md", "sm"].includes(displaySize) && (
              <Collapse id="10" orientation="horizontal">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  sx={{
                    color: theme.palette.text.primary,
                    transition: "all 0.3s ease-in-out",
                    marginLeft: -1,
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                  disableScrollLock={true}
                >
                  {pages.map(([page, href]) => (
                    <MenuItem
                      key={page}
                      onClick={(e) => {
                        handleCloseNavMenu();
                        setTimeout(() => {
                          e.preventDefault();
                          let element = document.getElementById(
                            href.substring(1)
                          );
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 10);
                      }}
                    >
                      <Typography
                        textAlign="center"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Collapse>
            )}
            <Collapse
              id="12"
              style={{
                fontSize: 20,
                margin: "auto",
                marginRight: 10,
                whiteSpace: "nowrap",
                color: theme.palette.text.primary,
                transition: "inherit",
              }}
            >
              <Link
                href="#home"
                variant="text"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                sx={{
                  color: theme.palette.text.primary,
                  fontFamily: "inherit",
                  textDecoration: "none",
                  transition: "all 0.3s ease-in-out",
                  marginLeft: 1,
                }}
              >
                Amr Thabit
              </Link>
            </Collapse>
            {["xl", "lg"].includes(displaySize) &&
              pages.map(([page, href]) => (
                <Collapse
                  key={page}
                  orientation="horizontal"
                  style={{ margin: "auto" }}
                >
                  <Button
                    key={page}
                    href={href}
                    onClick={(e) => {
                      handleCloseNavMenu();
                      let element = document.getElementById(href.substring(1));
                      e.preventDefault();
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    sx={{
                      color: theme.palette.text.primary,
                      fontFamily: "inherit",
                    }}
                  >
                    {page}
                  </Button>
                </Collapse>
              ))}
          </TransitionGroup>
          <TransitionGroup
            id="header-right"
            style={{
              transition: "inherit",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              // background: "red",
              margin: displaySize == "sm" ? 10 : 20,
            }}
          >
            {["xl", "lg", "md"].includes(displaySize) &&
              contactMenu.map(([icon, href]) => (
                <Collapse
                  key={href}
                  orientation="horizontal"
                  style={{ margin: "auto", tranition: "inherit" }}
                >
                  <IconButton
                    href={href}
                    // target="_blank"
                    key={icon.toString()}
                    onClick={(e) => {
                      handleCloseUserMenu();
                      if (href.startsWith("#")) {
                        e.preventDefault();
                        let element = document.getElementById(
                          href.substring(1)
                        );
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    sx={{
                      color: theme.palette.text.primary,
                      width: 40,
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    {icon}
                  </IconButton>
                </Collapse>
              ))}
            {["sm"].includes(displaySize) && (
              <Collapse id="15" orientation="horizontal">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar-send"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  sx={{
                    color: theme.palette.text.primary,
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <Send />
                </IconButton>
                <Menu
                  id="menu-appbar-send"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                  disableScrollLock={true}
                >
                  {contactMenu.map(([icon, href]) => (
                    <IconButton
                      key={href}
                      href={href.startsWith("#") ? "" : href}
                      onClick={(e) => {
                        handleCloseUserMenu();
                        if (href.startsWith("#")) {
                          setTimeout(() => {
                            e.preventDefault();
                            let element = document.getElementById(
                              href.substring(1)
                            );
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }, 10);
                        }
                      }}
                      sx={{
                        color: theme.palette.text.primary,
                        width: 40,
                        scale: 0.8,
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {icon}
                    </IconButton>
                  ))}
                </Menu>
              </Collapse>
            )}
            <Collapse id="16" orientation="horizontal">
              <Box
                sx={{ display: "flex", transition: "all 0.3s", marginLeft: 1 }}
                onClick={props.switchTheme}
              >
                <LightModeIcon
                  sx={{
                    transition: "all 0.3s",
                    color: theme.palette.text.primary,
                    opacity: props.themeMode == "light" ? 0 : 0,
                    position: "absolute",
                  }}
                />
                <DarkModeIcon
                  xs={{
                    transition: "all 0.3s ease-in-out",
                    color: theme.palette.text.primary,
                    opacity: props.themeMode == "light" ? 0 : 0,
                  }}
                />
              </Box>
            </Collapse>
          </TransitionGroup>
        </div>
      </AppBar>
    </ThemeProvider>
  );
}
