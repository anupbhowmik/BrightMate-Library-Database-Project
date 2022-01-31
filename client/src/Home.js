import React from "react";
import Books from "./components/books";
import AddBookForm from "./components/addBookForm";


function Home() {
    return (
        <div>
            <Books/>
            <AddBookForm/>
        </div>
    )
}

export default Home;