import React from "react";
import Books from "./components/books";
import SearchBookForm from "./components/searchBookForm";
import Carousel from "nuka-carousel";

import slide1 from "./slide1.jpg"
import slide2 from "./slide2.jpg"
import slide3 from "./slide3.jpg"
import slide4 from "./slide4.jpg"
import Card from "@mui/material/Card";
import {CardActionArea, CardMedia, Grid} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import booksImg from "./images/all_books.jpg";
import magImg from "./images/all_mag.jpg";
import {useNavigate} from "react-router";


function Home() {

    var navigate = useNavigate();
    return (
        <div style={{backgroundColor: "#F3F4F8"}}>
            <Carousel autoplay={true} height={600}>
                {/*<img src={slide1} />*/}
                <img src= {slide2} />
                <img src={slide3}/>
                <img src= {slide4}/>
            </Carousel>

            {/*<Books/>*/}



            <Grid container padding={12}>
                <Grid item sx={6} md={6}>
                    <Card onClick={()=>{
                        navigate('allBooks')
                    }} sx={{ marginRight: 2 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="240"
                                image={booksImg}
                                alt="all books"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Browse All Books
                                </Typography>
                                <Typography padding={4} variant="body1" color="text.secondary">
                                    As an intellectual object, a book is prototypically a composition of such great length that it takes a considerable investment of time to compose and still considered as an investment of time to read.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                <Grid item sx={6} md={6}>
                    <Card onClick={()=>{
                        navigate('allmagazines')
                    }}  sx={{ marginLeft: 2 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="240"
                                image={magImg}
                                alt="all books"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Browse All Magazines
                                </Typography>
                                <Typography padding={4} variant="body1" color="text.secondary">
                                    A magazine is a periodical publication, generally published on a regular schedule, containing a variety of content. They are generally financed by advertising, by a purchase price, by prepaid subscriptions, or by a combination of the three.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>



        </div>
    )
}

export default Home;