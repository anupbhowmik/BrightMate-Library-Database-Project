import React, {useEffect, useState} from "react";
import {setLoading, setTransferData, showToast, transferData, userInfo} from "../App";
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
import axios from "axios";

const Magazines = (props) => {

    var [isLoaded, setLoaded] = useState(false)
    useEffect(() => {
        setLoaded(false)

        setLoading(true);
        axios.get('/api/getMagazines')
            .then((res) => {
                    setLoading(false);
                    if (res.data.ResponseCode !== 0) {
                        setBooks(res.data)
                        showToast("All Magazines Loaded");
                        setLoaded(true)
                    } else {
                        showToast("Books Magazines failed");
                    }
                }
            ).catch((e) => {
            console.log(e)
        })


    }, []);

    var navigate = useNavigate();

    const [books, setBooks] = useState({
        ResponseCode: 0,
        ResponseDesc: "",
        Magazines: []
    });

    function showAllBooks() {
        setLoading(true);
        axios.get('/api/getMagazines')
            .then((res) => {
                    setLoading(false);
                    if (res.data.ResponseCode !== 0) {
                        setBooks(res.data)
                        showToast("All Magazines Loaded");
                        setLoaded(true)
                    } else {
                        showToast("Magazines loading failed");
                    }
                }
            ).catch((e) => {
            console.log(e)
        })
    }

    function showBookDetails(singleBook) {
        navigate("../magazinedetails")
        setTransferData(singleBook)

    }

    useEffect(() => {
        console.log("transferred data: ", transferData)
    }, [transferData])

    return (
        <Grid container spacing={1} padding={1}>
            <Grid item xs={12} md={12}>
                <h2>All Magazines</h2>
            </Grid>

            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <List>
                        {books.size === null ? <div>No Magazines found</div> :
                            books.Magazines?.map((book) => (

                                <Card style={{textAlign: 'left', marginBottom: '10px'}}
                                      onClick={() => showBookDetails(book)} key={book.MagazineID} elevation={0}
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
                                                        {book.MagazineTitle}
                                                    </Typography> </strong></b>
                                                </Grid>
                                            </Grid>

                                            Publisher: {book.Publisher}<br/>

                                            <List>
                                                {book.Genre.map((singleGenre) => (
                                                    <Chip sx={{mr: 1.5, mt: 1}} label={singleGenre.GenreName}
                                                    />
                                                ))}

                                            </List>




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
                        disableElevation>
                        {isLoaded ? <div>Refresh list</div> : <div>Show All Books</div>}

                    </Button>
                </center>
            </Grid>
            <Grid item xs={0} md={4}></Grid>
        </Grid>
    );
};

export default Magazines;
