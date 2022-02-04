import React, {useEffect, useState} from "react";
import {dataTransfer, setLoading, setTransferData, showToast, transferData} from "../App";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { MdOutlineAddTask } from "react-icons/md";
import { useNavigate } from "react-router";

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

  useEffect(()=>{
      console.log("transferred data: ", transferData)
  }, [transferData])

  return (
    <Grid container spacing={1} padding={1}>
      <Grid item xs={12} md={12}>
        <h2>All Books</h2>
      </Grid>

      <Grid item xs={0} md={2}></Grid>
      <Grid item xs={12} md={8}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <List >
            {books.Books.map((book) => (

              <Card key={book.BookID} elevation={0} sx={{ minWidth: 700 }}>
                <CardActionArea>
                  <CardContent>

                    <ListItem divider={false}>

                      <ListItemIcon>
                        <MenuBookIcon />
                      </ListItemIcon>

                      <ListItemText
                        onClick={() => showBookDetails(book)}
                        key={book.BookID}
                        primary={book.Title}
                        secondary={
                          "Edition " + book.Edition } />
                        <h1>&nbsp;&nbsp;&nbsp;&nbsp;</h1><h4>2 Copies Available</h4>

                    </ListItem>

                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <center>
                    <Button size="large" color="primary">
                      <MdOutlineAddTask />
                      &nbsp;&nbsp;&nbsp; Add to collection
                    </Button>
                  </center>
                </CardActions>
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
