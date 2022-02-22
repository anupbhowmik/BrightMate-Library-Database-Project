import React, {useEffect, useState} from "react";
import ReactRoundedImage from "react-rounded-image";

import reader from "./images/reader.png";
import {
    Avatar,
    Button,
    CardActionArea,
    CardContent,
    Chip, CssBaseline,
    Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, Drawer,
    Grid,
    List, ListItem,
    ListItemIcon, ListItemText, PropTypes, TextField
} from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {setLoading, showToast, transferData, userInfo} from "./App";
import axios from "axios";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import './components/user.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreateIcon from '@mui/icons-material/Create';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MailIcon from '@mui/icons-material/Mail';
import CallIcon from '@mui/icons-material/Call';

// IoReceiptSharp
import {IoReceiptSharp} from 'react-icons/io5';
import {red} from "@mui/material/colors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const drawerWidth = 240;

function UserDashboard(props) {

    const params = useParams()
    console.log('user id ', params.id)

    function dateFix(dateStr) {
        var issueDate = dateStr.split("T")
        var issueTime = issueDate[1].split(".")
        return (
            <> Date: {issueDate[0]} | Time: {issueTime[0]} </>)
    }

    var [userDetails, setUserDetails] = useState(
        {
            ResponseCode: 0,
            ResponseDesc: "",
            RentalObject: [],
            FineObject: []

        }
    )

    var [updateInfoState, setUpdateInfoState] = useState(
        {
            oldPass: "",
            newPass: "",
            userName: "",
            mobile: ""
        }
    )


    const onTextChange = (event) => {
        const value = event.target.value;
        setUpdateInfoState({
            ...updateInfoState,
            [event.target.name]: value,
        });
        console.log(event.target.value);

    };

    var [isLoaded, setLoaded] = useState(false)

    useEffect(() => {

        // console.log("user dashboard req ", "userID ", userInfo.userID);
        setLoading(true);
        setLoaded(false)

        axios.post("/api/getUserInfo", {
            USER_ID: params.id
        }).then((res) => {
            setLoading(false);
            if (res.data.ResponseCode !== 0) {
                setUserDetails(res.data)
                showToast("User info loaded")
                setLoaded(true)

            } else {
                showToast(" User details loading failed");
            }
            console.log("User info here: ", userDetails)


        }).catch((e) => {
            console.log(e)
        })


    }, []);

    function refreshUserInfo() {

        setLoading(true);

        axios.post("/api/getUserInfo", {
            USER_ID: params.id
        }).then((res) => {
            setLoading(false);
            if (res.data.ResponseCode !== 0) {
                setUserDetails(res.data)
                showToast("User info loaded")
                setLoaded(true)

            } else {
                showToast(" User details loading failed");
            }
            console.log("User info here: ", userDetails)

            console.log("fine history here: ", userDetails.FineObject)


        }).catch((e) => {
            console.log(e)
        })
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        updateInfoState.newPass = null;
        updateInfoState.oldPass = null;
    };

    const handleClose = () => {
        setOpen(false);
        console.log(updateInfoState)
    };

    function updateUserInfo() {
        console.log('update info req ', updateInfoState)
        if (updateInfoState.userName == "" && updateInfoState.mobile == "") {
            showToast("Please update at least one info before submitting")
        } else {

            setLoading(true)
            axios.post('/api/updateUserInfo', {
                USER_ID: userDetails.UserId,
                PASSWORD: userDetails.PasswordKey,
                USER_NAME: updateInfoState.userName,
                MOBILE: updateInfoState.mobile
            }).then((res) => {

                console.log(res.data)
                setLoading(false)
                if (res.data.ResponseCode === 1) {
                    showToast("User info updated!")
                    refreshUserInfo()
                    updateInfoState.userName = "";
                    updateInfoState.mobile = "";
                    setMenu(0);
                } else {
                    showToast("Failed to update user info")
                }

            }).catch((e) => {
                console.log(e)
            })

        }
    }

    function changePassword() {

        if (updateInfoState.oldPass == null || updateInfoState.newPass == null || updateInfoState.oldPass == "" || updateInfoState.newPass == "") {
            showToast("Don't keep any of the fields empty")
        } else {
            setOpen(false)
            setLoading(true)
            axios.post('/api/changePassword', {
                USER_ID: userInfo.UserId,
                OLD_PASSWORD: updateInfoState.oldPass,
                NEW_PASSWORD: updateInfoState.newPass
            }).then((res) => {

                console.log(res.data)
                setLoading(false)
                if (res.data.ResponseCode === 1) {
                    showToast("Password updated successfully!")
                } else {
                    showToast("Old password is wrong")
                }

            }).catch((e) => {
                console.log(e)
            })

        }


    }

    // drawer implementation

    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [menu, setMenu] = useState(
        0
    )

    const drawer = (
        <div className="drawer">
            <Toolbar/>
            <Divider/>
            <List>
                <ListItem button selected={menu === 0} onClick={() => {
                    setMenu(0)
                }}>
                    <ListItemIcon>
                        <AccountCircleIcon/>
                    </ListItemIcon>
                    <ListItemText primary="User Details"/>
                </ListItem>
                <ListItem button selected={menu === 1} onClick={() => {
                    setMenu(1)
                }}>
                    <ListItemIcon>
                        <IoReceiptSharp color={red}/>
                    </ListItemIcon>
                    <ListItemText primary="Fine History"/>
                </ListItem>

                <ListItem button selected={menu === 2} onClick={() => {
                    setMenu(2)
                }}>
                    <ListItemIcon>

                        <LibraryBooksIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Rental History"/>
                </ListItem>

                <ListItem button selected={menu === 3} onClick={() => {
                    setMenu(3)
                }}>
                    <ListItemIcon>

                        <CreateIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Change User Info"/>
                </ListItem>
            </List>

        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;


    return (

        <div style={{backgroundColor: "#F3F4F8"}}>
            {/*drawer*/}

            <Box sx={{display: 'flex'}}>
                <CssBaseline/>

                <Box
                    component="nav"
                    sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: {xs: 'block', sm: 'none'},
                            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: {xs: 'none', sm: 'block'},
                            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
                >
                    <Toolbar/>

                </Box>
            </Box>

            {/*drawer*/}

            {menu === 0 ? <Grid container spacing={1}>


                <Grid item xs={1} md={2}></Grid>
                <Grid marginLeft={9} marginBottom={10} item xs={10} md={8}>
                    <center>
                        <Card style={{
                            padding: '20px',
                            boxSizing: 'content-box',
                        }} elevation={0}>
                            <Card elevation={0} sx={{bgcolor: "#6C63FF", marginBottom: 2}}>
                                <Typography color="white" sx={{mb: 2, mt: 2}} variant="h5" component="div">
                                    {userDetails.UserType === 1 ? <div>General Reader</div> : <div>Employee</div>}

                                </Typography>
                            </Card>
                            <ReactRoundedImage
                                image={reader}
                                imageWidth="120"
                                imageHeight="120"
                                roundedSize="0"/>

                            <Typography paddingTop={2} variant="h4" component="div">
                                {userDetails.Username}
                            </Typography>

                            <Chip sx={{mb: 1, mt: 1}} label={"Library card: " + userDetails.LibraryCardNumber}
                                  variant="outlined"/>

                            <Typography paddingTop={2} variant="h6" component="div">
                                <Avatar sx={{mb: 1, bgcolor: "#E91E63"}}>
                                    <MailIcon/>
                                </Avatar> {userDetails.Email}
                            </Typography>

                            <Typography paddingTop={2} variant="h6" component="div">
                                <Avatar sx={{mb: 1, bgcolor: "#50CB88"}}>
                                    <CallIcon/>
                                </Avatar>{userDetails.Mobile}
                            </Typography>

                            <Grid item xs={0} md={4}></Grid>

                            <br/>
                            <Grid item xs={12} md={4}>
                                <center>
                                    <Button
                                        onClick={handleClickOpen}
                                        variant="contained"
                                        id="showRentalHistoryBtn"
                                        disableElevation>

                                        <VpnKeyIcon/>

                                        &nbsp;&nbsp;&nbsp;Change Password

                                    </Button>
                                </center>
                            </Grid>
                            <Grid item xs={0} md={4}></Grid>


                        </Card>
                    </center>
                </Grid>
                <Grid item xs={1} md={2}></Grid>


                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>

                        <TextField
                            autoFocus
                            margin="dense"
                            id="oldpass"
                            onChange={onTextChange}
                            value={updateInfoState.oldPass}
                            label="Enter Old Password"
                            name="oldPass"
                            type="password"
                            fullWidth
                            variant="standard"
                        />

                        <TextField
                            value={updateInfoState.newPass}
                            margin="dense"
                            id="newpass"
                            onChange={onTextChange}
                            label="Enter new Password"
                            type="password"
                            fullWidth
                            name="newPass"
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="outlined" onClick={changePassword}>Update Password</Button>
                    </DialogActions>
                </Dialog>


            </Grid> : <div></div>}

            {menu === 3 ? <Grid container spacing={1}>


                    <Grid item xs={1} md={2}></Grid>
                    <Grid marginLeft={9} marginBottom={10} item xs={10} md={8}>
                        <center>
                            <Grid item xs={4} md={4}>
                                <TextField
                                    style={{backgroundColor: "white"}}
                                    onChange={onTextChange}
                                    value={updateInfoState.userName}
                                    name="userName"
                                    fullWidth
                                    id="outlined-basic"
                                    label="New User Name"
                                    variant="outlined"

                                />

                                <TextField
                                    sx={{marginTop: 2}}
                                    style={{backgroundColor: "white"}}
                                    onChange={onTextChange}
                                    value={updateInfoState.mobile}
                                    name="mobile"
                                    fullWidth
                                    id="outlined-basic"
                                    label="New Mobile Number"
                                    variant="outlined"
                                    type="number"

                                />

                                <Button
                                    sx={{marginTop: 2}}
                                    onClick={updateUserInfo}
                                    variant="contained"
                                    disableElevation>
                                    <ManageAccountsIcon/>
                                    &nbsp;&nbsp;&nbsp;Update User Info

                                </Button>

                            </Grid>
                        </center>
                    </Grid>
                </Grid>
                :
                <div></div>}

            {menu === 1 ? <Grid marginLeft={9} container spacing={1} padding={4}>

                <Grid item xs={12} md={12}>
                    <Typography variant="h6" component="div">
                        Fine History
                    </Typography>

                </Grid>

                <Grid item xs={1} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <div style={{display: "flex", justifyContent: "center"}}>

                        <List aria-colcount={2} fullwidth>
                            {userDetails.FineObject.map((fineObject) => (

                                <Card style={{textAlign: 'left', marginBottom: '10px'}}
                                      key={fineObject.FineId}
                                      elevation={0}
                                      sx={{minWidth: 700}}>

                                    <CardContent>

                                        <Grid container padding={1}>
                                            <Grid sx={1} md={1}>
                                                <ListItemIcon sx={{mb: 1.2}}>
                                                    <Avatar sx={{bgcolor: "#E91E63"}}>
                                                        <IoReceiptSharp/>
                                                    </Avatar>
                                                </ListItemIcon>
                                            </Grid>

                                            <Grid sx={6} md={8}>
                                                <b><strong><Typography sx={{mt: 0.5}} variant="h6" component="div">
                                                    Fine Starting
                                                    {dateFix(fineObject.FineStartingDate)}
                                                </Typography> </strong></b>
                                            </Grid>

                                            <Grid sx={5} md={3}></Grid>

                                            <Grid sx={1} md={1}>
                                                <ListItemIcon sx={{mb: 1.2}}>
                                                    <Avatar sx={{bgcolor: "#50CB88"}}>
                                                        <MonetizationOnIcon/>
                                                    </Avatar>
                                                </ListItemIcon>
                                            </Grid>

                                            <Grid sx={6} md={8}>
                                                <b><strong><Typography sx={{mt: 0.5}} variant="h6" component="div">

                                                    {"Fee: BDT " + fineObject.Fee}
                                                </Typography> </strong></b>
                                            </Grid>
                                        </Grid>


                                        <Typography variant="body1" component="div">

                                            {fineObject.FineStatus === "1" ?
                                                <div>Payment Date {dateFix(fineObject.PaymentDate)}</div> :
                                                <div></div>}

                                        </Typography>


                                        {fineObject.FineStatus === "1" ?
                                            <Chip variant="outlined" color="success" sx={{mr: 1.5, mt: 1}}
                                                  label="Fine Paid"/> :
                                            <Chip variant="outlined" color="error" sx={{mr: 1.5, mt: 1}}
                                                  label="Fine Due"/>}

                                    </CardContent>


                                </Card>
                            ))}
                        </List>
                    </div>
                </Grid>

                <Grid item xs={1} md={2}></Grid>

                <Grid item xs={0} md={4}></Grid>

                <Grid item xs={12} md={4}>
                    <center>
                        <Button
                            onClick={refreshUserInfo}
                            variant="contained"
                            id="showFineHistoryBtn"
                            disableElevation>
                            {isLoaded ? <div>Refresh Fine list</div> : <div>Show Fine History</div>}

                        </Button>
                    </center>
                </Grid>
                <Grid item xs={0} md={4}></Grid>

            </Grid> : <div></div>}

            {menu === 2 ? <Grid marginLeft={9} container spacing={1} padding={4}>


                <Grid item xs={12} md={12}>
                    <Typography variant="h6" component="div">
                        Rental History
                    </Typography>

                </Grid>

                <Grid item xs={1} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <div style={{display: "flex", justifyContent: "center"}}>

                        <List aria-colcount={2} fullwidth>
                            {userDetails.RentalObject?.map((rentalObject) => (

                                <Card style={{textAlign: 'left', marginBottom: '10px'}}
                                      key={rentalObject.BookObject[0].BookID}
                                      elevation={0}
                                      sx={{minWidth: 700}}>

                                    <CardContent>

                                        <Grid container padding={1}>
                                            <Grid sx={1} md={1}>
                                                <ListItemIcon sx={{mb: 1.2}}>
                                                    <Avatar sx={{bgcolor: "#3A7CFF"}}>
                                                        <LibraryBooksIcon/>
                                                    </Avatar>
                                                </ListItemIcon>
                                            </Grid>

                                            <Grid sx={6} md={8}>
                                                <b><strong><Typography variant="h6" component="div">
                                                    {rentalObject.BookObject[0].Title}
                                                </Typography> </strong></b>
                                            </Grid>
                                        </Grid>

                                        <List>
                                            {rentalObject.BookObject[0].AuthorObject.map((singleAuthor) => (
                                                <Chip sx={{mr: 1.5, mt: 1}} label={singleAuthor.AuthorName}
                                                />
                                            ))}

                                        </List>

                                        <Typography variant="body1" component="div">

                                            Issue {dateFix(rentalObject.IssueDate)}

                                        </Typography>


                                        {rentalObject.RentalStatus === 1 ?
                                            <Chip variant="outlined" color="primary" sx={{mr: 1.5, mt: 1}}
                                                  label="Pending Return"/> : <div></div>}
                                        {rentalObject.RentalStatus === 2 ?
                                            <Chip color="error" sx={{mr: 1.5, mt: 1}} label="Overdue"/> :
                                            <div></div>}
                                        {rentalObject.RentalStatus === 3 ?
                                            <Chip color="success" sx={{mr: 1.5, mt: 1}} label="Dues Cleared"/> :
                                            <div></div>}
                                        {rentalObject.RentalStatus === 4 ?
                                            <Typography variant="body1" component="div" color="#50CB88">
                                                Return {dateFix(rentalObject.ReturnDate)}
                                            </Typography> :
                                            <div></div>}

                                    </CardContent>


                                </Card>
                            ))}
                        </List>
                    </div>
                </Grid>

                <Grid item xs={1} md={2}></Grid>

                <Grid item xs={0} md={4}></Grid>

                <Grid item xs={12} md={4}>
                    <center>
                        <Button
                            onClick={refreshUserInfo}
                            variant="contained"
                            id="showRentalHistoryBtn"
                            disableElevation>
                            {isLoaded ? <div>Refresh Rental list</div> : <div>Show Rental History</div>}

                        </Button>
                    </center>
                </Grid>
                <Grid item xs={0} md={4}></Grid>

            </Grid> : <div></div>}


        </div>
    )
}

export default UserDashboard;