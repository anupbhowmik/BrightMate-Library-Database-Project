import React from "react";
import ReactRoundedImage from "react-rounded-image";
import anup from "./images/Anup.jpg";
import {Grid} from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

function About() {
    return (
        <div style={{backgroundColor: "#F3F4F8"}}>
            <Grid container spacing={1} padding={1}>

                <Grid item xs={1} md={3}></Grid>
                <Grid marginTop={4} marginBottom={3} item xs={10} md={6}>
                    <center>
                        <Card style={{
                            padding: '20px',
                            boxSizing: 'content-box',
                        }} elevation={0}>
                            <Card elevation={0} sx={{bgcolor: "#50CB88", marginBottom: 2}}>
                                <Typography color="white" sx={{mb: 2, mt: 2}} variant="h5" component="div">
                                    Project Supervisor
                                </Typography>
                            </Card>
                            <ReactRoundedImage
                                image={anup}
                                imageWidth="120"
                                imageHeight="120"
                                roundedSize="0"
                            />

                            <Typography paddingTop={3} variant="h4" component="div">
                                Dr. Abu Sayed Md. Latiful Hoque
                            </Typography>

                            <Typography variant="h5" component="div">
                                Professor
                            </Typography>


                            <Typography sx={{mb: 2, mt: 1}} color="text.secondary">
                                Department of Computer Science and Engineering
                                Bangladesh University of Engineering and Technology
                                Dhaka 1000, Bangladesh.
                            </Typography>
                        </Card>
                    </center>
                </Grid>
                <Grid item xs={1} md={3}></Grid>


                <Grid item xs={1} md={1}></Grid>
                <Grid  item xs={10} md={5}>
                    <center>
                        <Card style={{
                            padding: '20px',
                            boxSizing: 'content-box',
                        }} elevation={0}>
                            <Card elevation={0} sx={{bgcolor: "#6C63FF", marginBottom: 2}}>
                                <Typography color="white" sx={{mb: 2, mt: 2}} variant="h5" component="div">
                                    Team Member
                                </Typography>
                            </Card>
                            <ReactRoundedImage
                                image={anup}
                                imageWidth="120"
                                imageHeight="120"
                                roundedSize="0"/>

                            <Typography paddingTop={3} variant="h4" component="div">
                                Anup Bhowmik
                            </Typography>

                            <Typography variant="h5" component="div">
                                Undergraduate Student
                            </Typography>

                            <Typography sx={{mb: 2, mt: 1}} color="text.secondary">
                                Department of Computer Science and Engineering
                                Bangladesh University of Engineering and Technology
                                Dhaka 1000, Bangladesh.
                            </Typography>
                        </Card>
                    </center>
                </Grid>
                <Grid  item xs={10} md={5}>
                    <center>
                        <Card style={{
                            padding: '20px',
                            boxSizing: 'content-box',
                        }} elevation={0}>
                            <Card elevation={0} sx={{bgcolor: "#3A7CFF", marginBottom: 2}}>
                                <Typography color="white" sx={{mb: 2, mt: 2}} variant="h5" component="div">
                                    Team Member
                                </Typography>
                            </Card>
                            <ReactRoundedImage
                                image={anup}
                                imageWidth="120"
                                imageHeight="120"
                                roundedSize="0"/>

                            <Typography paddingTop={3} variant="h4" component="div">
                                Fabiha Tasneem
                            </Typography>

                            <Typography variant="h5" component="div">
                                Undergraduate Student
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

export default About;