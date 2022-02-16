import React, {useEffect} from "react";
import {
    Button, CardActionArea,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid, InputLabel, ListItemText, OutlinedInput, Select,
    TextField
} from "@mui/material";
import {setLoading, showToast} from "../App";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddBookForm = (props) => {
    // todo: handle exceptions

    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: {value},
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

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

    var [genres, setGenre] = React.useState(
        // these are for getting genre list
        null
    );

    var [authors, setAuthors] = React.useState(
        // these are for getting author list
        null
    );


    var [selectedGenres, selectGenre] = React.useState(
        {
            selected: []  // selectedGenres.selected stores the selected indices
        }
    );   //selected[0] = true means the genreID 1 is selected

    var [selectedAuthors, selectAuthor] = React.useState(
        {
            selecAuthors: []
        }
    );   //selectedAuthors[0] = true means the authorID 1 is selected


    const handleGenreSelection = (index) => {
        var selec = selectedGenres.selected
        selec[index] = !selec[index]
        selectGenre({
            selected: selec
        });
        console.log("Genres main array ", selectedGenres.selected);
    };

    const handleAuthorSelection = (index) => {
        var selec = selectedAuthors.selecAuthors
        selec[index] = !selec[index]
        selectAuthor({
            selecAuthors: selec
        });
        console.log("Authors main array ", selectedAuthors.selecAuthors);
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

        fetch("/api/getAuthors")
            .then((res) => res.json())
            .then((authors) => setAuthors(authors))
            .then(() => {
                var arr = []
                authors.AuthorList.map(() => {
                    arr.push(false)
                })


                selectAuthor({
                    selecAuthors: arr
                })
            });


    }, []);   // passing an empty array so that useEffect runs only once

    // useEffect(() => {
    //     // auto call while loading this component
    //     fetch("/api/getAuthors")
    //         .then((res) => res.json())
    //         .then((authors) => setAuthors(authors))
    //         .then(() => {
    //             var arr = []
    //             authors.AuthorList.map(() => {
    //                 arr.push(false)
    //             })
    //
    //
    //             selectAuthor({
    //                 selecAuthors: arr
    //             })
    //         });
    //
    // }, []);

    function addBook() {
        const name = state.title;
        const isbn = state.ISBN;
        const edition = state.edition;
        const year = state.year;
        const description = state.description;
        const publisherID = state.publisherID;
        const language = state.language;

        var genre = []
        var author = []


        selectedGenres.selected.map((singleGenre, index) => {
            if (singleGenre) {
                genre.push(index + 1);
            }

        })

        selectedAuthors.selecAuthors.map((singleAuthor, index) => {
            if (singleAuthor) {
                author.push(index + 1);
            }

        })


        console.log("post req", "book name ", name, " publisher id ", publisherID, " genre list " , genre, " author list ", author);

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                TITLE: name,
                YEAR: year,
                DESCRIPTION: description,
                LANGUAGE: language,
                PUBLISHER_ID: publisherID,
                ISBN: isbn,
                EDITION: edition,
                GENRE: genre,
                AUTHOR_ID: author,
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
        console.log("Author list: ", authors);
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

                <FormControl required fullWidth sx={{minwidth: 300}}>
                    <InputLabel id="demo-multiple-checkbox-label">Authors</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        style={{backgroundColor: "white"}}

                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput label="Authors"/>}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}>

                        {authors === null ? <ListItemText primary={"No data found"}/> :

                            authors.AuthorList?.map((singleAuthor, index) => (
                                    <MenuItem onClick={() => {
                                        handleAuthorSelection(singleAuthor.AuthorID - 1)
                                    }} key={singleAuthor.AuthorID} value={singleAuthor.AuthorName}>



                                        {/*<div onClick={() => {*/}
                                        {/*    handleAuthorSelection(index)*/}
                                        {/*}} name="selectedAuthors" />*/}
                                        <ListItemText primary={singleAuthor.AuthorName}/>
                                    </MenuItem>
                                ))
                        }


                    </Select>
                </FormControl>
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
                    type="number"/>
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

                                    {genres === null ? <div>No data found</div> :
                                        genres.GenreList?.map((singleGenre, index) => (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={selectedGenres.selected[index]} onChange={() => {
                                                            handleGenreSelection(singleGenre.GenreID - 1)
                                                        }} name="selectedGenres"/>
                                                    }
                                                    label={singleGenre.GenreName}/>
                                            ))
                                    }



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
