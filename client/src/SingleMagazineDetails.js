import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
    isLoggedIn,
    setLoading,
    setLoggedIn,
    setTransferData,
    setUserInfo,
    showToast,
    transferData,
    userInfo
} from "./App";
import {
    Avatar, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, TextField,
} from "@mui/material";

import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';
import logo from ".//logo.png";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";
import {useEffect} from "react";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";

const cookies = new Cookies()
const COOKIE_AGE = 31536000

export default function SingleMagazineDetails() {

    var [singleBook, setBook] = React.useState({
        Genre: [],
    });

    const params = useParams()
    console.log('params ', params)

    useEffect(() => {

        setLoading(true);
        // console.log("magazine  ", transferData)

        axios.post("/api/getMagazineInfo", {
            MAGAZINE_ID: params.id
        }).then((res) => {
            setLoading(false);
            if (res.data.ResponseCode !== 0) {
                setBook(res.data)

            } else {
                showToast("Magazine loading failed");
            }
            console.log(res.data)


        }).catch((e) => {
            console.log(e)
        })

    }, []);

    function getBookInfo() {
        setLoading(true);
        console.log("book id ", params.id)

        axios.post("/api/getMagazineInfo", {
            MAGAZINE_ID: params.id
        }).then((res) => {
            setLoading(false);
            if (res.data.ResponseCode !== 0) {
                setBook(res.data)

            } else {
                showToast("Magazine loading failed");
            }
            console.log(res.data)


        }).catch((e) => {
            console.log(e)
        })
    }

    var navigate = useNavigate();


    return (
        <Grid container spacing={4} padding={5}>
            <Grid item xs={12} md={12}>
                <center>
                    <img src={logo} height={120} width={120}/>
                </center>
            </Grid>
            <Grid item xs={0} md={2}>
            </Grid>
            <Grid item xs={12} md={8}>
                <div align="left" style={{display: "flex", justifyContent: "center"}}>

                    <Card sx={{minWidth: 800}}>
                        <CardContent>

                            <b><strong><Typography variant="h4" component="div">
                                {singleBook.MagazineTitle}
                            </Typography> </strong></b>
                            <br/>

                            <Button variant={"outlined"} onClick={getBookInfo}>

                                <RefreshIcon/> &nbsp;&nbsp;&nbsp;Refresh
                            </Button>

                            <hr color="#E1EBFF"/>

                            <br/>


                            <Avatar sx={{bgcolor: "#3A7CFF"}}>
                                <LocalPrintshopIcon/>
                            </Avatar>

                            <Typography paddingTop={1} variant="body2">
                                {singleBook.Publisher}
                            </Typography>


                            <br/>
                            <Avatar sx={{bgcolor: "#E91E63"}}>
                                <LanguageIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="body2">
                                Language: {singleBook.Language}
                            </Typography>

                            <br/>

                            <Avatar sx={{bgcolor: "#50CB88"}}>
                                <CategoryIcon/>
                            </Avatar>
                            <List>
                                {singleBook.Genre.map((singleGenre) => (
                                    <Chip sx={{mr: 1.5, mt: 1}} label={singleGenre.GenreName}
                                          variant="outlined"/>
                                ))}

                            </List>
                            <br/>

                        </CardContent>

                    </Card>
                </div>
            </Grid>

            <Grid item xs={0} md={2}>
            </Grid>
        </Grid>
    );
}
