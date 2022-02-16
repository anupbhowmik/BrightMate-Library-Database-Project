import * as React from "react";
import logo from ".//logo.png";
import {isLoggedIn, setTransferData, showToast, userInfo} from "../App";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import {MdAccountCircle} from "react-icons/md";
import {useNavigate} from 'react-router';

const pages = [
    {title: "Browse Books", address: "#"},
    {title: "Categories", address: "#"},
    {title: "About us", address: "about"}];
const settings = ["Dashboard", "Logout", "Login as Admin"];

const ResponsiveAppBar = () => {
    var navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (address) => {
        setAnchorElNav(null);
        navigate(address)
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);

    };

    function navigatePage(address) {
        setAnchorElUser(null);
        navigate(address)

    }

    return (
        <AppBar style={{backgroundColor: "white"}} position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img onClick={() => navigatePage("/")} src={logo} className="App-logo" alt="logo"/>
                    <h1>&nbsp;&nbsp;&nbsp;&nbsp;</h1><h3><font color="black"> BrightMate Library </font></h3>
                    <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>
                    <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        {/*<Menu*/}
                        {/*  id="menu-appbar"*/}
                        {/*  anchorEl={anchorElNav}*/}
                        {/*  anchorOrigin={{*/}
                        {/*    vertical: "bottom",*/}
                        {/*    horizontal: "left",*/}
                        {/*  }}*/}
                        {/*  keepMounted*/}
                        {/*  transformOrigin={{*/}
                        {/*    vertical: "top",*/}
                        {/*    horizontal: "left",*/}
                        {/*  }}*/}
                        {/*  open={Boolean(anchorElNav)}*/}
                        {/*  onClose={handleCloseNavMenu}*/}
                        {/*  sx={{*/}
                        {/*    display: { xs: "block", md: "none" },*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  {pages.map((page) => (*/}
                        {/*    <MenuItem key={page} onClick={handleCloseNavMenu}>*/}
                        {/*      <Typography textAlign="center">{page}</Typography>*/}
                        {/*    </MenuItem>*/}
                        {/*  ))}*/}
                        {/*</Menu>*/}
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}
                    >

                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => handleCloseNavMenu(page.address)}
                                sx={{my: 2, color: "#1565C0", display: "block"}}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>
                    {isLoggedIn ?
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <MdAccountCircle color="#1565C0" size="40"/>
                                    Welcome, username
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: "45px"}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box> : <div><Button
                            onClick={() => navigatePage("login")}
                            variant="contained"
                            id="loginBtn"
                            disableElevation>
                            Log in
                        </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button
                                onClick={() => navigatePage("register")}
                                variant="outlined"
                                id="registerBtn"
                                disableElevation>
                                Register
                            </Button>
                        </div>
                    }

                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
