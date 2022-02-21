import "./App.css";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {TailSpin} from "react-loader-spinner";
import React, {useEffect, useState} from "react";
import {Dialog, DialogContent} from "@mui/material";
import ResponsiveAppBar from "./components/topNavBar";

import Home from "./Home";
import About from "./About";
import SearchResult from "./SearchResult";
import SingleBookDetails from "./SingleBookDetails";
import Login from "./Login";
import Register from "./Register";

import {Route, Routes} from "react-router-dom";

import Cookies from 'universal-cookie';
import UserDashboard from "./UserDashboard";
import AllBooks from "./AllBooks";
import AllMagazines from "./AllMagazines";
import SingleMagazineDetails from "./SingleMagazineDetails";
const cookies = new Cookies();

var showToast;
var setLoading;

var transferData
var setTransferData

var isLoggedIn
var setLoggedIn
var isAdmin
var setAdminStatus
var userInfo
var setUserInfo

function App() {
    [transferData, setTransferData] = useState(null);

    [isLoggedIn, setLoggedIn] = useState(false);
    [isAdmin, setAdminStatus] = useState(false);
    [userInfo, setUserInfo] = useState(null)

    useEffect(()=>{
        if(cookies.get('auth')!=undefined && cookies.get('auth')!=null){
            setLoggedIn(true)
            setUserInfo(cookies.get('auth'))
            console.log(cookies.get('auth'))
        }
    },[])


    const [loading, setL] = useState(false);
    setLoading = setL;
    showToast = (message) => {
        toast.dark(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Dialog open={loading}>
                <DialogContent>
                    <TailSpin color="#00BFFF" height={100} width={100}/>
                </DialogContent>
            </Dialog>

            <div className="App">
                <ResponsiveAppBar/>

                <div className="Content">

                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/about" element={<About/>}/>
                        <Route exact path="/bookdetails/:id" element={<SingleBookDetails/>}/>
                        <Route exact path="/searchresult" element={<SearchResult/>}/>
                        <Route exact path="/login" element={<Login/>}/>
                        <Route exact path="/register" element={<Register/>}/>
                        <Route exact path="/dashboard/:id" element={<UserDashboard/>}/>
                        <Route exact path="/allbooks" element={<AllBooks/>}/>
                        <Route exact path="/allmagazines" element={<AllMagazines/>}/>
                        <Route exact path="/magazinedetails/:id" element={<SingleMagazineDetails/>}/>

                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
export {showToast, setLoading};
export {transferData, setTransferData, isLoggedIn, setLoggedIn, isAdmin, setAdminStatus, userInfo, setUserInfo}