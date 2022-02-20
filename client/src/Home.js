import React from "react";
import Books from "./components/books";
import SearchBookForm from "./components/searchBookForm";
import Carousel from "nuka-carousel";

import slide1 from "./slide1.jpg"
import slide2 from "./slide2.jpg"
import slide3 from "./slide3.jpg"
import slide4 from "./slide4.jpg"

function Home() {

    return (
        <div style={{backgroundColor: "#F3F4F8"}}>
            <Carousel autoplay={true} height={600}>
                {/*<img src={slide1} />*/}
                <img src= {slide2} />
                <img src={slide3}/>
                <img src= {slide4}/>
            </Carousel>

            {/*<Books/>*/}
            <SearchBookForm/>
        </div>
    )
}

export default Home;