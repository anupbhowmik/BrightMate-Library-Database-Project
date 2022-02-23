import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button, CardActionArea,
    Checkbox, Chip, CircularProgress, Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid, InputBase, InputLabel, List, ListItemIcon, ListItemText, OutlinedInput, Paper, Select,
    TextField
} from "@mui/material";
import {setLoading, setTransferData, showToast, transferData} from "../App";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import axios from 'axios'
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Box from "@mui/material/Box";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router";

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

    const [personName, setPersonName] = useState([]);
    const [loading, setLoading] = useState(false)

    const handleChange = (event) => {
        const {
            target: {value},
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [genreName, setGenreName] = React.useState([]);
    const handleChangeGenre = (event) => {
        const {
            target: {value},
        } = event;
        setGenreName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

    };

    var [state, setState] = React.useState({
        isFirstLoad: true,
        title: "",
        isYear: 0,
        year: "",
        isAuthor: 0,
        singleAuthorID: "",
        authorName: "",
        isGenre: 0,
        singleGenreID: 0,
        searchResultText: ""



    });

    var [genres, setGenre] = React.useState(
        // these are for getting genre list
        []
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

    const selectSingleAuthor = (authorID) => {
        state.singleAuthorID = authorID
        state.isAuthor = 1
        console.log('selected author id ', authorID)
        searchBook()
    }

    const selectSingleGenre = (genreID) => {
        state.singleGenreID = genreID
        state.isGenre = 1
        console.log('selected genre id ', genreID)
        searchBook()
    }


    useEffect(() => {

        state.isGenre = 0
        state.isAuthor = 0
        state.isYear = 0
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

        if(transferData){


            if(transferData.genreID !== null){
                showToast("Showing books of selected Genre ", transferData.genreName)
                state.singleGenreID = transferData.genreID
                state.isGenre = 1
            }
            if(transferData.authID !== null){

                console.log('transfer data author ', transferData.authName)
                showToast("Showing books of selected Author ", transferData.authName)
                state.singleAuthorID = transferData.authID
                state.isAuthor = 1
            }
            console.log('state at search ',state)

            searchBook()

            state.singleGenreID = transferData.genreID
            state.isGenre = 0
            state.singleAuthorID = transferData.authID
            state.isAuthor = 0


        }



    }, []);

    const [books, setBooks] = useState(
        []
    );

    useEffect(()=>{
        if(!state.isFirstLoad)
            searchBook();

    },[state])

    const onTextChange = (event) => {


        const value = event.target.value;
        setState({
            ...state, isFirstLoad: false,
            [event.target.name]: value,
        });

        console.log(event.target.value);

        // searchBook();   // this is calling before changing the state
    };

    function searchBook() {

        var isYear = (state.year === null || state.year === ""? 0 : 1)
        console.log('search req ', state)
        setLoading(true);

        axios.post("/api/search", {
            SEARCH_KEY: state.title,
            AUTHOR_OBJECT: {
                IS_AUTHOR_FILTER: state.isAuthor,
                AUTHOR_ID: state.singleAuthorID
            },
            GENRE_OBJECT: {
                IS_GENRE_FILTER: state.isGenre,
                GENRE_ID: state.singleGenreID
            },
            YEAR_OBJECT: {
                IS_YEAR_FILTER: isYear,
                YEAR: state.year
            }
        }).then((res) => {
            console.log('search res data ', res.data)
            setLoading(false);
            if (res.data.ResponseCode !== 0) {
                setBooks(res.data.SearchResult)

            } else {
                showToast("Search loading failed");
            }
            // console.log("search results here: ", books)


        }).catch((e) => {
            console.log(e)
        })
    }



    var navigate = useNavigate();

    function showBookDetails(singleBook) {
        navigate("../bookdetails/" + singleBook.BookID)
        setTransferData(singleBook)

    }

    return (
        <Grid padding={5} container spacing={1}>
            <Grid item xs={12} md={12}>
                <h2>Search a Book</h2>
            </Grid>

            <Grid item xs={0} md={3}>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper
                    component="form"
                    sx={{p: '2px 4px', display: 'flex', alignItems: 'center'}}
                >

                    <InputBase onChange={onTextChange}
                               sx={{ml: 1, flex: 1}}
                               name="title"
                               value={state.title}
                               placeholder="Search book..."
                               inputProps={{'aria-label': 'search google maps'}}
                    />
                    <IconButton onClick={searchBook} sx={{p: '10px'}} aria-label="search">
                        <SearchIcon/>
                    </IconButton>


                </Paper>
            </Grid>

            <Grid item xs={0} md={3}>
            </Grid>

            <Grid item xs={12} md={12}>
            </Grid>


            <Grid item xs={12} md={12}>
            </Grid>


            <Grid item xs={0} md={3}>
            </Grid>

            <Grid item xs={4} md={2}>
                <Box sx={{minWidth: 120}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select an Author</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={personName}
                            label="Select an Author"
                            style={{backgroundColor: "white"}}
                            onChange={handleChange}>

                            {authors === null ? <ListItemText primary={"No data found"}/> :

                                authors.AuthorList?.map((singleAuthor, index) => (
                                    <MenuItem onClick={() => {
                                        selectSingleAuthor(singleAuthor.AuthorID)
                                    }} key={singleAuthor.AuthorID} value={singleAuthor.AuthorName}>

                                        <ListItemText primary={singleAuthor.AuthorName}/>
                                    </MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>
                </Box>

            </Grid>


            <Grid item xs={4} md={2}>

                <Box sx={{minWidth: 120}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select a Genre</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={genreName}
                            label="Select a Genre"
                            style={{backgroundColor: "white"}}
                            onChange={handleChangeGenre}>

                            {genres === null ? <ListItemText primary={"No data found"}/> :

                                genres.GenreList?.map((singleGenre, index) => (
                                    <MenuItem onClick={() => {
                                        selectSingleGenre(singleGenre.GenreID)
                                    }} key={singleGenre.GenreID} value={singleGenre.GenreName}>


                                        <ListItemText primary={singleGenre.GenreName}/>
                                    </MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>
                </Box>

            </Grid>

            <Grid item xs={4} md={2}>
                <TextField
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


            <Grid item xs={12} md={12}>
            </Grid>


            <Grid item xs={12} md={12}>
                <center>
                    <Button onClick={searchBook} variant="contained" disableElevation>
                        {loading ? <Box sx={{display: 'flex'}}>
                            <CircularProgress color="inherit"/></Box> : <SearchIcon/>}

                    </Button>
                </center>
            </Grid>


            {/*here are the search results*/}



            <Grid container spacing={1} padding={1}>

                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <List>
                            {books.size === null ? <div>No books found</div> :
                                books?.map((book) => (

                                    <Card style={{textAlign: 'left', marginBottom: '10px'}}
                                          onClick={() => showBookDetails(book)} key={book.BookID} elevation={0}
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

                                                <List>
                                                    {book.AuthorObject.map((singleAuthor) => (
                                                        <Chip sx={{mr: 1.5, mt: 1}} label={singleAuthor.AuthorName}
                                                        />
                                                    ))}

                                                </List>

                                                {book.CopyObject.length == 0 ?
                                                    <Chip sx={{mr: 1.5, mt: 1}} label={"No copies available right now"}
                                                          variant="outlined"/> :
                                                    book.CopyObject.map((singleCopy) => (

                                                        <Card elevation={0}>

                                                            <Chip sx={{mr: 1.5, mt: 1, mb: 1}}
                                                                  label={"Edition " + singleCopy.Edition}
                                                                  variant="outlined"/>

                                                            <Typography color={"#3A7CFF"} variant="body1"
                                                                        component="div">
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
                                ))
                            }


                        </List>
                    </div>
                </Grid>


            </Grid>

        </Grid>
    );
};

export default SearchBookForm;
