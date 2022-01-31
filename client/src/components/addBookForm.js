import React, {useEffect} from "react";
import {Button, Grid, TextField} from "@mui/material";
import {setLoading, showToast} from "../App";

const AddBookForm = (props) => {
    // need to handle duplicate entries

    var [state, setState] = React.useState({
        bookId: 0,
        bookName: "",
        bookVersion: 1,
    });

    function addBook() {
        const name = state.bookName;
        const id = state.bookId;
        const version = state.bookVersion;

        console.log(name, " ", id, " ", version);

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                BOOK_ID: id,
                BOOK_NAME: name,
                VERSION: version,
            }),
        };

        setLoading(true);
        showToast("Adding new book to Database...");
        fetch("/api/addbook", requestOptions)
            .then(() => {
                setLoading(false);
                showToast(name + " Added to Database");
            });
    }

    const onTextChange = (event) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value,
        });
        console.log(event.target.value);
    };

    return (
        <Grid padding={5} container spacing={1}>
            <Grid item xs={12} md={12}>
                <h2>Add a new Book</h2>
            </Grid>
            <Grid item xs={0} md={4}>
                {" "}
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    type="number"
                    onChange={onTextChange}
                    value={state.bookId}
                    name="bookId"
                    fullWidth
                    id="outlined-basic"
                    label="Book ID"
                    variant="outlined"
                />
            </Grid>

            <Grid item xs={0} md={4}>
                {" "}
            </Grid>
            <Grid item xs={0} md={4}>
                {" "}
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    value={state.bookName}
                    name="bookName"
                    fullWidth
                    id="outlined-basic"
                    label="Book Name"
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={0} md={4}>
                {" "}
            </Grid>

            <Grid item xs={0} md={4}>
                {" "}
            </Grid>

            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    value={state.bookVersion}
                    name="bookVersion"
                    fullWidth
                    id="outlined-basic"
                    label="Version"
                    variant="outlined"
                    type="number"
                />
            </Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={12} md={4}>
                <center>
                    <Button onClick={addBook} variant="contained" disableElevation>
                        Add this book
                    </Button>
                </center>
            </Grid>
            <Grid item xs={0} md={4}>
                {" "}
            </Grid>
        </Grid>
    );
};

export default AddBookForm;
