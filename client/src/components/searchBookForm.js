import React, {useEffect} from "react";
import {
    Button, CardActionArea,
    Checkbox, Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid, InputBase, InputLabel, ListItemText, OutlinedInput, Paper, Select,
    TextField
} from "@mui/material";
import {setLoading, showToast} from "../App";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import axios from 'axios'
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Box from "@mui/material/Box";

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

const SearchBookForm = (props) => {
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

        axios.get("/api/getGenre").then((res) => {
            setGenre(res.data)
            var arr = []
            res.data.GenreList.map(() => {
                arr.push(false)
            })

            console.log("genre ", res.data)


            selectGenre({
                selected: arr
            })

            axios.get("/api/getAuthors").then((res) => {
                setAuthors(res.data)
                var arr = []
                res.data.AuthorList.map(() => {
                    arr.push(false)
                })

                selectAuthor({
                    selecAuthors: arr
                })
                console.log("authors ", res.data)

            }).catch((e) => {
                console.log(e)
            })

        }).catch((e) => {
            console.log(e)
        })


    }, []);   // passing an empty array so that useEffect runs only once


    function searchBook() {
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


        console.log("post req", "book name ", name, " publisher id ", publisherID, " genre list ", genre, " author list ", author);

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

    };

    return (
        <Grid padding={5} container spacing={1}>
            <Grid item xs={12} md={12}>
                <h2>Search a Book</h2>
            </Grid>

            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >

                <InputBase onChange={onTextChange}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search book..."
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>


            </Paper>

            <Grid item xs={12} md={12}>
            </Grid>


            <Grid item xs={12} md={12}>
            </Grid>


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


            <Grid item xs={12} md={12}>


            </Grid>
            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={4}>

                {/*<FormControl required fullWidth sx={{minwidth: 300}}>*/}
                {/*    <InputLabel id="demo-multiple-checkbox-label">Author</InputLabel>*/}
                {/*    <Select*/}
                {/*        labelId="demo-multiple-checkbox-label"*/}
                {/*        id="demo-multiple-checkbox"*/}
                {/*        style={{backgroundColor: "white"}}*/}

                {/*        value={personName}*/}
                {/*        onChange={handleChange}*/}
                {/*        input={<OutlinedInput label="Authors"/>}*/}
                {/*        renderValue={(selected) => selected.join(', ')}*/}
                {/*        MenuProps={MenuProps}>*/}

                {/*        {authors === null ? <ListItemText primary={"No data found"}/> :*/}

                {/*            authors.AuthorList?.map((singleAuthor, index) => (*/}
                {/*                <MenuItem onClick={() => {*/}
                {/*                    handleAuthorSelection(singleAuthor.AuthorID - 1)*/}
                {/*                }} key={singleAuthor.AuthorID} value={singleAuthor.AuthorName}>*/}


                {/*                    /!*<div onClick={() => {*!/*/}
                {/*                    /!*    handleAuthorSelection(index)*!/*/}
                {/*                    /!*}} name="selectedAuthors" />*!/*/}
                {/*                    <ListItemText primary={singleAuthor.AuthorName}/>*/}
                {/*                </MenuItem>*/}
                {/*            ))*/}
                {/*        }*/}


                {/*    </Select>*/}
                {/*</FormControl>*/}


                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Author</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state.authorID}
                            label="authorID"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

            </Grid>

            <Grid item xs={0} md={4}></Grid>

            <Grid item xs={12} md={12}>
            </Grid>


            <Grid item xs={12} md={12}>
            </Grid>


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
                    <Button onClick={searchBook} variant="contained" disableElevation>
                        Search this book
                    </Button>
                </center>
            </Grid>
            <Grid item xs={0} md={4}></Grid>

        </Grid>
    );
};

export default SearchBookForm;
