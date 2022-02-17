import React, {useEffect, useState} from "react";
import ReactRoundedImage from "react-rounded-image";

import reader from "./images/reader.png";
import {Chip, Grid} from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {setLoading, showToast, transferData, userInfo} from "./App";
import axios from "axios";

function UserDashboard() {

    var [userDetails, setUserDetails] = useState(null)

    useEffect(() => {

        console.log("user dashboard req ", "userID ", userInfo.userID);
        setLoading(true);

        axios.post("/api/getUserInfo", {
            USER_ID: userInfo.UserId
        })
            .then((res) => {
                setLoading(false);
                if (res.data.ResponseCode !== 0) {
                    setUserDetails(res.data)
                    showToast("User info loaded")

                } else {
                    showToast(" User details loading failed");
                }
                console.log("User info: ", res.data)


            }).catch((e) => {
            console.log(e)
        })

    }, []);


    return (
        <div style={{backgroundColor: "#F3F4F8"}}>
            <Grid container spacing={1} padding={4}>

                <Grid item xs={1} md={1}></Grid>
                <Grid item xs={10} md={10}>
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

                            <Chip sx={{mb: 1, mt: 1}} label="ID: 1805082" variant="outlined"/>

                            <Typography variant="h6" component="div">
                                E-mail: {userInfo.Email}
                            </Typography>

                            <Typography sx={{mb: 2, mt: 1}} color="text.secondary">
                                Department of Computer Science and Engineering
                                Bangladesh University of Engineering and Technology
                                Dhaka 1000, Bangladesh.
                            </Typography>
                        </Card>
                    </center>
                </Grid>

                <Grid item xs={1} md={1}></Grid>


            </Grid>
        </div>
    )
}

export default UserDashboard;