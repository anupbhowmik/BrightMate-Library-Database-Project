import React, {useEffect} from "react";
import {
    Button, CardActionArea,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    TextField
} from "@mui/material";
import {setLoading, showToast} from "../App";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const AddBookForm = (props) => {
    // need to handle duplicate entries

    var [state, setState] = React.useState({
        ISBN: "",
        title: "",
        year: null,
        edition: 1,
        description: "",
        authorID: null,
        publisherID: null,
        language: "",
        genre: [], // an array of int
    });

    var [genres, setGenre] = React.useState({
        // these are for getting genre list
        ResponseCode: 0,
        ResponseDesc: "",
        GenreList: [],
    });

    var [selectedGenres, selectGenre] = React.useState(
        {
            selected: []  // selectedGenres.selected stores the selected indices
        }
    );   //selected[0] = true means the genreID 1 is selected

    const handleSelection = (index) => {
        var selec = selectedGenres.selected
        selec[index] = !selec[index]
        selectGenre({
            selected: selec
        });
        console.log("Genres main array ", selectedGenres.selected);
    };

    useEffect(() => {
        // auto call while loading this component
        fetch("/api/getGenre")
            .then((res) => res.json())
            .then((genres) => setGenre(genres))
            .then(() => {
                var arr = []
                genres.GenreList.map(() => {
                    arr.push(false)
                })


                selectGenre({
                    selected: arr
                })

            });

    }, []);   // passing an empty array so that useEffect runs only once

    function addBook() {
        const name = state.title;
        const isbn = state.ISBN;
        const edition = state.edition;
        const year = state.year;
        const description = state.description;
        const authorID = state.authorID;
        const publisherID = state.publisherID;
        const language = state.language;

        var genre = []

        selectedGenres.selected.map((singleGenre, index) => {
            if (singleGenre) {
                genre.push(index + 1);
            }

        })


        // const genre = state.genre;

        console.log("post req", "book name ", name, "author id ", authorID, " publisher id ", publisherID);

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                TITLE: name,
                YEAR: year,
                DESCRIPTION: description,
                LANGUAGE: language,
                AUTHOR_ID: authorID,
                PUBLISHER_ID: publisherID,
                ISBN: isbn,
                EDITION: edition,
                GENRE: genre,
            }),
        };

        setLoading(true);
        showToast("Adding new book to Database...");
        fetch("/api/addbook", requestOptions).then(() => {
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
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    required
                    style={{backgroundColor: "white"}}
                    onChange={onTextChange}
                    value={state.ISBN}
                    name="ISBN"
                    fullWidth
                    id="outlined-basic"
                    label="ISBN"
                    variant="outlined"
                />
            </Grid>

            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={12}>
            </Grid>

            <Grid item xs={0} md={4}>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    required
                    style={{backgroundColor: "white"}}
                    value={state.title}
                    name="title"
                    fullWidth
                    id="outlined-basic"
                    label="Book Name"
                    variant="outlined"
                />
            </Grid>


            <Grid item xs={0} md={4}>
            </Grid>
            <Grid item xs={12} md={12}>
            </Grid>
            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    required
                    value={state.edition}
                    style={{backgroundColor: "white"}}
                    name="edition"
                    fullWidth
                    id="outlined-basic"
                    label="Edition"
                    variant="outlined"
                    type="number"
                />
            </Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={12} md={12}>
            </Grid>

            <Grid item xs={0} md={4}>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    required
                    style={{backgroundColor: "white"}}
                    onChange={onTextChange}
                    value={state.year}
                    name="year"
                    fullWidth
                    id="outlined-basic"
                    label="Year"
                    variant="outlined"
                    type="number"
                />
            </Grid>

            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={12}>
            </Grid>

            <Grid item xs={0} md={4}>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    required
                    style={{backgroundColor: "white"}}
                    value={state.language}
                    name="language"
                    fullWidth
                    id="outlined-basic"
                    label="Language"
                    variant="outlined"
                />
            </Grid>


            <Grid item xs={0} md={4}>
            </Grid>
            <Grid item xs={12} md={12}>
            </Grid>
            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    required
                    value={state.authorID}
                    style={{backgroundColor: "white"}}
                    name="authorID"
                    fullWidth
                    id="outlined-basic"
                    label="Author ID"
                    variant="outlined"
                    type="number"

                />
            </Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={12} md={12}>
            </Grid>
            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    required
                    value={state.publisherID}
                    style={{backgroundColor: "white"}}
                    name="publisherID"
                    fullWidth
                    id="outlined-basic"
                    label="Publisher ID"
                    variant="outlined"
                    type="number"

                />
            </Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={12} md={12}>
            </Grid>
            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={4}>
                <TextField
                    onChange={onTextChange}
                    value={state.description}
                    style={{backgroundColor: "white"}}
                    name="description"
                    fullWidth
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"

                />
            </Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={0} md={2}></Grid>

            <Grid item xs={12} md={8}>
                <center>
                    <FormControl
                        required
                        component="fieldset"
                        sx={{m: 3}}
                        variant="standard">
                        <FormLabel component="legend">Pick at least one Genre</FormLabel>
                        <br/>
                        <FormGroup>
                            <Card style={{backgroundColor: "white"}} elevation={0} sx={{minWidth: 700}}>

                                <CardContent>

                                    {genres.GenreList.map((singleGenre, index) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={selectedGenres.selected[index]} onChange={() => {
                                                    handleSelection(index)
                                                }}
                                                          name="selectedGenres"/>
                                            }
                                            label={singleGenre.GenreName}/>
                                    ))}

                                </CardContent>


                            </Card>


                        </FormGroup>
                        <FormHelperText>You can select multiple Genres</FormHelperText>
                    </FormControl>
                </center>
            </Grid>
            <Grid item xs={0} md={2}> </Grid>


            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={12} md={4}>
                <center>
                    <Button onClick={addBook} variant="contained" disableElevation>
                        Add this book
                    </Button>
                </center>
            </Grid>
            <Grid item xs={0} md={4}></Grid>

        </Grid>
    );
};

export default AddBookForm;
