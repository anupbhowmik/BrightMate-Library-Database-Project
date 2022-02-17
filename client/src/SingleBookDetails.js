import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {setLoading, setLoggedIn, setTransferData, setUserInfo, showToast, transferData, userInfo} from "./App";
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
import CategoryIcon from '@mui/icons-material/Category';
import axios from "axios";
import {useEffect} from "react";


export default function SingleBookDetails() {

    var [singleBook, setBook] = React.useState(null);

    useEffect(() => {
        setLoading(true);
        console.log("book id " , transferData.BookID)
        axios.post("/api/getBookInfo", {
            BOOK_ID: transferData.BookID
        })
            .then((res) => {
                setLoading(false);
                if (res.data.ResponseCode !== 0) {
                    showToast(" Showing book details ", res.data.Title);
                    setBook(res.data)

                } else {
                    showToast(" Book loading failed");
                }
                console.log(res.data)


            }).catch((e) => {
            console.log(e)
        })


    }, []);

    var [state, setState] = React.useState({
        copies: null
    });

    function addCopy(edition) {
        setOpen(false);
        setLoading(true);

        const copy = state.copies;


        console.log("add book coy req: ", "copies ", copy);


        showToast("Adding book copies...");

        setLoading(true)

        axios.post('/api/addBookCopies', {
            BOOK_ID: transferData.BookID,
            COPIES: parseInt(copy),
            EDITION: edition,
            ADMIN_ID: 3,
        }).then(res => {

            if (res.data.ResponseCode === 1) {
                console.log(transferData)
                var arr = [...transferData.CopyObject]
                arr.map((a, i) => {
                    if (a.Edition === edition) {
                        arr[i].CopyCount += parseInt(copy)
                    }
                })
            }
            var tmp = {...transferData}
            tmp.CopyObject = arr
            setTransferData(tmp)

        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })


        state.copies = null;
    }

    const onTextChange = (event) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value,
        });
        console.log(event.target.value);

    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        state.copies = null;
    };

    const handleClose = () => {
        setOpen(false);
    };


    function collectBook(userID, book, edition) {

        console.log("rent book req ", "userID ", userID, "book id ", book.BookID, " edition ", edition, " pass ", userInfo.PasswordKey);

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                USER_ID: userID,
                USER_PASSWORD: userInfo.PasswordKey,
                BOOK_ID: book.BookID,
                EDITION: edition,

            }),
        };

        setLoading(true);
        showToast("Adding new book to Collection...");
        fetch("/api/rentBook", requestOptions).then(() => {
            setLoading(false);
            showToast(book.Title + " Added to your collection!");
            // todo: now refresh the page to show the changed copy count
        });


    }

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
                                {singleBook.Title}
                            </Typography> </strong></b>
                            <br/>

                            <Typography sx={{mb: 1.5}} color="text.primary">
                                ISBN: {singleBook.ISBN}
                            </Typography>

                            <hr color="#E1EBFF"/>

                            <br/>
                            <Avatar sx={{bgcolor: "#50CB88"}}>
                                <CheckCircleIcon/>
                            </Avatar>
                            <Typography paddingTop={1} variant="h5">
                                Available Copies
                            </Typography>
                            <br/>

                            {singleBook.CopyObject.length === 0 ?
                                <Chip sx={{mr: 1.5}} label={"No copies available right now"}
                                      variant="outlined"/> :
                                singleBook.CopyObject.map((singleCopy) => (

                                    <Card elevation={0}>

                                        <Chip
                                            onClick={() => collectBook(userInfo.UserId, singleBook, singleCopy.Edition)}
                                            size={"large"} color="primary" clickable={true} sx={{mr: 1.5, mb: 1}}
                                            label={"Collect " + singleCopy.Edition + " Edition"}
                                        />

                                        <Typography sx={{mb: 1.5}} color={"#3A7CFF"} variant="body1" component="div">
                                            {"Copies Available: " + singleCopy.CopyCount}
                                        </Typography>
                                        {/*for adding book copies in admin site*/}
                                        {/*<Dialog open={open} onClose={handleClose}>*/}
                                        {/*    <DialogTitle>Add copies</DialogTitle>*/}
                                        {/*    <DialogContent>*/}
                                        {/*        <TextField*/}
                                        {/*            onChange={onTextChange}*/}
                                        {/*            required*/}
                                        {/*            value={state.copies}*/}
                                        {/*            style={{backgroundColor: "white"}}*/}
                                        {/*            name="copies"*/}
                                        {/*            fullWidth*/}
                                        {/*            id="outlined-basic"*/}
                                        {/*            label="Number of copies"*/}
                                        {/*            type="number"*/}
                                        {/*        />*/}
                                        {/*    </DialogContent>*/}
                                        {/*    <DialogActions>*/}
                                        {/*        <Button onClick={handleClose}>Cancel</Button>*/}
                                        {/*        <Button onClick={() => {*/}
                                        {/*            addCopy(singleCopy.Edition)*/}
                                        {/*        }}>Submit</Button>*/}
                                        {/*    </DialogActions>*/}
                                        {/*</Dialog>*/}
                                        {/*<Button sx={{mb: 1.5}} variant="outlined"*/}
                                        {/*        onClick={handleClickOpen}>*/}
                                        {/*    Add copies of {singleCopy.Edition} edition*/}
                                        {/*</Button><br/>*/}

                                    </Card>

                                ))
                            }

                            <br/>
                            <Avatar sx={{bgcolor: "#E91E63"}}>
                                <CreateIcon/>
                            </Avatar>
                            <List>
                                {singleBook.AuthorObject.map((singleAuthor) => (
                                    <Chip clickable sx={{mr: 1.5, mt: 1}} label={singleAuthor.AuthorName}
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

                            <Avatar sx={{bgcolor: "#50CB88"}}>
                                <CategoryIcon/>
                            </Avatar>
                            <List>
                                {singleBook.GenreObject.map((singleGenre) => (
                                    <Chip clickable sx={{mr: 1.5, mt: 1}} label={singleGenre.GenreName}
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
