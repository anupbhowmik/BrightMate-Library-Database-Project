import React, {useEffect, useState} from "react";
import ReactRoundedImage from "react-rounded-image";

import reader from "./images/reader.png";
import {Avatar, Button, CardActionArea, CardContent, Chip, Grid, List, ListItemIcon} from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {setLoading, showToast, transferData, userInfo} from "./App";
import axios from "axios";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

function UserDashboard() {

    var issueDate = "1"
    var [userDetails, setUserDetails] = useState(
        {
            ResponseCode: 0,
            ResponseDesc: "",
            RentalObject: []
        }
    )
    var [isLoaded, setLoaded] = useState(false)

    useEffect(() => {

        console.log("user dashboard req ", "userID ", userInfo.userID);
        setLoading(true);
        setLoaded(false)

        axios.post("/api/getUserInfo", {
            USER_ID: userInfo.UserId
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

    function showRentalHistory() {

        setLoading(true);

        axios.post("/api/getUserInfo", {
            USER_ID: userInfo.UserId
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
    }


    return (
        <div style={{backgroundColor: "#F3F4F8"}}>
            <Grid container spacing={1} padding={4}>

                <Grid item xs={1} md={2}></Grid>
                <Grid item xs={10} md={8}>
                    <center>
                        <Card style={{
                            padding: '20px',
                            boxSizing: 'content-box',
                        }} elevation={0}>
                            <Card elevation={0} sx={{bgcolor: "#6C63FF", marginBottom: 2}}>
                                <Typography color="white" sx={{mb: 2, mt: 2}} variant="h5" component="div">
                                    {userInfo.UserTypeId === 1 ? <div>General Reader</div> : <div>Employee</div>}

                                </Typography>
                            </Card>
                            <ReactRoundedImage
                                image={reader}
                                imageWidth="120"
                                imageHeight="120"
                                roundedSize="0"/>

                            <Typography paddingTop={3} variant="h4" component="div">
                                {userInfo.Username}
                            </Typography>

                            <Chip sx={{mb: 1, mt: 1}} label={"Library card: " + userDetails.LibraryCardNumber} variant="outlined"/>

                            <Typography variant="h6" component="div">
                                E-mail: {userInfo.Email}
                            </Typography>


                        </Card>
                    </center>
                </Grid>
                <Grid item xs={1} md={2}></Grid>




                <Grid container padding={1}>
                    <Grid item xs={0} md={1}></Grid>
                    <Grid sx={6} md={5}>

                        <Grid  item xs={12} md={12}>
                            <h2 align="center">Rental History</h2>
                        </Grid>

                        <Grid item xs={1} md={2}></Grid>
                        <Grid item xs={12} md={8}>
                            <div style={{display: "flex", justifyContent: "center"}}>

                                <List aria-colcount={2} fullwidth>
                                    {userDetails.RentalObject?.map((rentalObject) => (

                                        <Card style={{textAlign: 'left', marginBottom: '10px'}} key={rentalObject.BookObject[0].BookID}
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
                                                    {/*{issueDate = rentalObject.IssueDate.split("T")}*/}
                                                    {"Issue Date: " + rentalObject.IssueDate}
                                                </Typography>

                                                {rentalObject.RentalStatus === 1? <Chip variant="outlined" color="primary" sx={{mr: 1.5, mt: 1 }} label="Pending Return"/> : <div> </div>}
                                                {rentalObject.RentalStatus === 2? <Chip color="error" sx={{mr: 1.5, mt: 1 }} label="Overdue"/>  : <div> </div>}
                                                {rentalObject.RentalStatus === 3? <Chip variant="outlined" color="success" sx={{mr: 1.5, mt: 1 }} label= {"Returned on" + rentalObject.ReturnDate}/>  : <div> </div>}


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
                                    onClick={showRentalHistory}
                                    variant="contained"
                                    id="showRentalHistoryBtn"
                                    disableElevation>
                                    {isLoaded ? <div>Refresh Rental list</div> : <div>Show Rental History</div>}

                                </Button>
                            </center>
                        </Grid>
                        <Grid item xs={0} md={4}></Grid>

                    </Grid>

                    <Grid item xs={0} md={1}></Grid>

                    <Grid sx={6} md={5}></Grid>

                </Grid>

            </Grid>
        </div>
    )
}

export default UserDashboard;