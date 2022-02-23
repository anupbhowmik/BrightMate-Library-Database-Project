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
import searchResult from "./SearchResult";

export default function SingleBookDetails(props) {

    const params = useParams()
    console.log('params ', params)

    var [singleBook, setBook] = React.useState({

        CopyObject: [],
        GenreObject: [],
        AuthorObject: [],
    });

    var [state, setState] = React.useState({
        copies: []
    });

    useEffect(() => {

        setLoading(true);
        // console.log("book id ", transferData.BookID)

        axios.post("/api/getBookInfo", {
            BOOK_ID: params.id
        }).then((res) => {
            setLoading(false);
            if (res.data.ResponseCode !== 0) {
                setBook(res.data)

            } else {
                showToast(" Book loading failed");
            }
            console.log(res.data)


        }).catch((e) => {
            console.log(e)
        })

    }, []);

    function getBookInfo() {
        setLoading(true);
        console.log("book id ", params.id)

        axios.post("/api/getBookInfo", {
            BOOK_ID: params.id
        }).then((res) => {
            setLoading(false);
            if (res.data.ResponseCode !== 0) {
                setBook(res.data)

            } else {
                showToast(" Book loading failed");
            }
            console.log(res.data)


        }).catch((e) => {
            console.log(e)
        })
    }

    var navigate = useNavigate();

    function collectBook(book, edition) {

        // console.log("rent book req ", "book id ", book.BookID, " edition ", edition, " pass ", userInfo.PasswordKey);

        console.log('is logged in ', isLoggedIn)
        if (isLoggedIn === false) {
            showToast('Please log in first')
            navigate('../login')
        } else {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    USER_ID: userInfo.UserId,
                    USER_PASSWORD: userInfo.PasswordKey,
                    BOOK_ID: book.BookID,
                    EDITION: edition,

                }),
            };

            setLoading(true);

            console.log('user info ', userInfo)
            console.log("book rent req", "user id ", userInfo.UserId, "pass", userInfo.PasswordKey, "book id ", book.BookID, "edition ", edition)
            showToast("Adding new book to Collection...");
            fetch("/api/rentBook", requestOptions).then(() => {
                setLoading(false);
                showToast(book.Title + " Added to your collection!");

            });

            setLoading(true);
            // console.log("book id ", transferData.BookID)
            axios.post("/api/getBookInfo", {
                BOOK_ID: params.id
            }).then((res) => {
                setLoading(false);
                if (res.data.ResponseCode !== 0) {
                    setBook(res.data)

                } else {
                    showToast("Book loading failed");
                }
                console.log(res.data)


            }).catch((e) => {
                console.log(e)
            })

        }


    }

    return (
        <Grid  container spacing={4} padding={5}>
            <Grid item xs={12} md={12}>
                <center>
                    <img src={logo} height={120} width={120}/>
                </center>
            </Grid>
            <Grid item xs={0} md={2}>
            </Grid>
            <Grid item xs={12} md={8}>
                <div align="left" style={{display: "flex", justifyContent: "center"}}>

                    <Card sx={{minWidth: 800, maxWidth: 300}}>
                        <CardContent sx={{padding: 4}}>

                            <b><strong><Typography variant="h4" component="div">
                                {singleBook.Title}
                            </Typography> </strong></b>
                            <br/>

                            <Typography sx={{mb: 1.5}} color="text.primary">
                                ISBN: {singleBook.ISBN}
                            </Typography>

                            <Button variant={"outlined"} onClick={getBookInfo}>

                                <RefreshIcon/> &nbsp;&nbsp;&nbsp;Refresh
                            </Button>

                            <hr color="#E1EBFF"/>

                            <br/>
                            <Avatar sx={{bgcolor: "#50CB88"}}>
                                <CheckCircleIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="h5">
                                Available Copies
                            </Typography>
                            <br/>

                            {singleBook === null ? singleBook.CopyObject.length === 0 ?
                                    <Chip sx={{mr: 1.5}} label={"No copies available right now"}
                                          variant="outlined"/> :
                                    singleBook.CopyObject.map((singleCopy) => (

                                        <Card elevation={0}>

                                            <Chip
                                                onClick={() => collectBook(userInfo.UserId, singleBook, singleCopy.Edition)}
                                                size={"large"} color="primary" clickable={true} sx={{mr: 1.5, mb: 1}}
                                                label={"Collect " + "Edition "  + singleCopy.Edition}
                                            />

                                            <Typography sx={{mb: 1.5}} color={"#3A7CFF"} variant="body1" component="div">
                                                {"Copies Available: " + singleCopy.CopyCount}
                                            </Typography>


                                        </Card>

                                    ))
                                :
                                // the book is loaded from api
                                singleBook.CopyObject.length === 0 ?
                                    <Chip sx={{mr: 1.5, mb: 1}} label={"No copies available right now"}
                                          variant="outlined"/> :
                                    singleBook.CopyObject.map((singleCopy) => (

                                        <Card elevation={0}>

                                            <Chip
                                                onClick={() => collectBook(singleBook, singleCopy.Edition)}
                                                size={"large"} color="primary" clickable={true} sx={{mr: 1.5, mb: 1}}
                                                label={"Collect " + "Edition "  + singleCopy.Edition}
                                            />

                                            <Typography sx={{mb: 1.5}} color={"#3A7CFF"} variant="body1"
                                                        component="div">
                                                {"Copies Available: " + singleCopy.CopyCount}
                                            </Typography>


                                        </Card>

                                    ))


                            }


                            <br/>
                            <Avatar sx={{bgcolor: "#E91E63", mt: 1.5}}>
                                <CreateIcon/>
                            </Avatar>
                            <List>
                                {singleBook.AuthorObject.map((singleAuthor) => (
                                    <Chip onClick={()=>{
                                        setTransferData(
                                            {
                                                authID: singleAuthor.AuthorId,
                                                authName: singleAuthor.AuthorName,
                                                genreID: null

                                            }
                                        )
                                        navigate('../../searchresult')

                                    }} clickable sx={{mr: 1.5, mt: 1}} label={singleAuthor.AuthorName}
                                          variant="outlined"/>
                                ))}

                            </List>
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
                            <Avatar sx={{bgcolor: "#3A7CFF"}}>
                                <AccessTimeIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="body2">
                                Year of Publication: {singleBook.YearOfPublication}
                            </Typography>

                            <br/>

                            <Avatar sx={{bgcolor: "#50CB88"}}>
                                <CategoryIcon/>
                            </Avatar>
                            <List>
                                {singleBook.GenreObject.map((singleGenre) => (
                                    <Chip onClick={()=>{
                                        setTransferData(
                                            {
                                                authID: null,
                                                genreID: singleGenre.GenreId,
                                                genreName: singleGenre.GenreName

                                            }
                                        )
                                        navigate('../../searchresult')

                                    }} clickable sx={{mr: 1.5, mt: 1}} label={singleGenre.GenreName}
                                          variant="outlined"/>
                                ))}

                            </List>
                            <br/>

                            <Avatar sx={{bgcolor: "#6C63FF"}}>
                                <DescriptionIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="body2">
                                {singleBook.Description}
                            </Typography>


                        </CardContent>

                    </Card>
                </div>
            </Grid>

            <Grid item xs={0} md={2}>
            </Grid>
        </Grid>
    );
}
