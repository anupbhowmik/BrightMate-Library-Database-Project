import React, {useState} from "react";
import {setLoading, showToast} from "../App";
import {
    Button, Card, CardActionArea, CardActions, CardContent,
    Grid, Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {MdOutlineAddTask, MdOutlineKeyboardArrowRight} from "react-icons/md";
import {useNavigate} from "react-router";

const Books = (props) => {
    var navigate = useNavigate();
    const [books, setBooks] = useState([]);

    function showAllBooks() {

        setLoading(true);
        fetch("/api/getbooks")
            .then((res) => res.json())
            .then((books) => setBooks(books))
            .then(() => {
                setLoading(false);
                showToast("All Books loaded")

            });
    }

    function showBookDetails(id) {
        // navigate("bookdetails")
        showToast("Showing book id: " + id);
    }

    return (
        <Grid container spacing={1} padding={1}>
            <Grid item xs={12} md={12}>
                <h2>All Books</h2>
            </Grid>

            <Grid item xs={0} md={2}>
                {" "}
            </Grid>
            <Grid item xs={12} md={8}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <List>
                        {books.map((book) => (
                            <Card sx={{maxWidth: 1000}}>
                                <CardActionArea>
                                    <CardContent >
                                        <ListItem >
                                            <ListItemIcon>
                                                <MenuBookIcon/>
                                            </ListItemIcon>

                                            <ListItemText onClick={() => showBookDetails(book.BOOK_ID)} key={book.BOOK_ID}
                                                primary=<font size="48px"> <b>{book.BOOK_NAME}</b></font>
                                                secondary={"Edition " + book.VERSION + "\nDescription here"}/>

                                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 Copies
                                                Available</h4>
                                        </ListItem>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <center>
                                        <Button size="large" color="primary">
                                            <MdOutlineAddTask/>&nbsp;&nbsp;&nbsp;
                                            Add to collection
                                        </Button>
                                    </center>
                                </CardActions>
                            </Card>
                        ))}

                    </List>

                </div>

            </Grid>

            <Grid item xs={0} md={2}>
                {" "}
            </Grid>

            <Grid item xs={0} md={4}>
                {" "}
            </Grid>

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
            <Grid item xs={0} md={4}>
                {" "}
            </Grid>
        </Grid>
    );
};


export default Books;
