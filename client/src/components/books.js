import React, {useEffect, useState} from "react";
import {setLoading, setTransferData, showToast, transferData} from "../App";
import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent, Chip,
    Grid,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {MdOutlineAddTask} from "react-icons/md";
import {useNavigate} from "react-router";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Typography from "@mui/material/Typography";

const Books = (props) => {
    var navigate = useNavigate();
    const [books, setBooks] = useState({
        ResponseCode: 0,
        ResponseDesc: "",
        Books: []
    });

    function showAllBooks() {
        setLoading(true);
        fetch("/api/getbooks")
            .then((res) => res.json())
            .then((books) => setBooks(books))
            .then(() => {
                setLoading(false);
                showToast("All Books loaded");

            });
    }

    function showBookDetails(singleBook) {
        navigate("bookdetails")
        setTransferData(singleBook)

        showToast("Showing book id: " + singleBook.BookID)
    }

    useEffect(() => {
        console.log("transferred data: ", transferData)
    }, [transferData])

    return (
        <Grid container spacing={1} padding={1}>
            <Grid item xs={12} md={12}>
                <h2>All Books</h2>
            </Grid>

            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <List >
                        {books.Books.map((book) => (

                            <Card style={{textAlign:'left',marginBottom:'10px'}} onClick={() => showBookDetails(book)} key={book.BookID} elevation={0}
                                  sx={{minWidth: 700}}>
                                <CardActionArea>
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
                                                    {book.Title}
                                                </Typography> </strong></b>
                                            </Grid>
                                        </Grid>





                                            ISBN: {book.ISBN}<br/>


                                        {book.CopyObject.length == 0 ?
                                            <Chip sx={{mr: 1.5, mt: 1}} label={"No copies available right now"}
                                                  variant="outlined"/> :
                                            book.CopyObject.map((singleCopy) => (

                                                <Card elevation={0}>

                                                    <Chip sx={{mr: 1.5, mt: 1, mb: 1}}
                                                          label={singleCopy.Edition + " Edition"}
                                                          variant="outlined"/>

                                                    <Typography color={"#3A7CFF"} variant="body1" component="div">
                                                        {"Copies Available: " + singleCopy.CopyCount}
                                                    </Typography>

                                                </Card>


                                            ))
                                        }


                                    </CardContent>
                                </CardActionArea>
                                {/*<CardActions>*/}
                                {/*    <center>*/}
                                {/*        <Button size="large" color="primary">*/}
                                {/*            <MdOutlineAddTask/>*/}
                                {/*            &nbsp;&nbsp;&nbsp; Add to collection*/}
                                {/*        </Button>*/}
                                {/*    </center>*/}
                                {/*</CardActions>*/}
                            </Card>
                        ))}
                    </List>
                </div>
            </Grid>

            <Grid item xs={0} md={2}></Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={12} md={4}>
                <center>
                    <Button
                        onClick={showAllBooks}
                        variant="contained"
                        id="showAllBooksBtn"
                        disableElevation
                    >
                        Show All Books
                    </Button>
                </center>
            </Grid>
            <Grid item xs={0} md={4}></Grid>
        </Grid>
    );
};

export default Books;
