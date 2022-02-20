import React, {useEffect} from "react";
import {
    Button, CardActionArea,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid, InputLabel, Select,
    TextField
} from "@mui/material";
import {setLoading, showToast} from "./App";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {useNavigate} from "react-router";
import MenuItem from "@mui/material/MenuItem";

const Register = (props) => {

    var navigate = useNavigate();

    var [state, setState] = React.useState({
        user_name: "",
        email: "",
        password: "",
        mobile_no: "",
        gender: ""

    });

    const [gender, setGender] = React.useState('');

    const handleChange = (event) => {
        setGender(event.target.value);
        state.gender = gender;
        console.log("gender changed ", state.gender)
    };

    function register() {
        const name = state.user_name;
        const email = state.email;
        const pass = state.password;
        const mbl = state.mobile_no;



        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                USER_NAME: name,
                EMAIL: email,
                PASSWORD: pass,
                MOBILE: mbl,
                GENDER: gender,
            }),
        };

        if (name == "" || email === "" || pass == "" || email === "" || mbl == "" ){
            showToast("Don't keep any of the required fields empty")
        } else {
            setLoading(true);
            showToast("Creating new account...");
            fetch("/api/signUp", requestOptions).then(() => {
                setLoading(false);
                showToast("Please login to continue");
                navigate("../login")
            });
        }


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
                <h2>Create a new Account</h2>
            </Grid>
            <Grid item xs={0} md={4}>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    required
                    style={{backgroundColor: "white"}}
                    onChange={onTextChange}
                    value={state.user_name}
                    name="user_name"
                    fullWidth
                    id="outlined-basic"
                    label="User Name"
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
                    value={state.email}
                    name="email"
                    fullWidth
                    id="outlined-basic"
                    label="E-mail"
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
                    value={state.password}
                    style={{backgroundColor: "white"}}
                    name="password"
                    fullWidth
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    type="password"
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
                    value={state.mobile_no}
                    name="mobile_no"
                    fullWidth
                    id="outlined-basic"
                    label="Mobile No."
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
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        label="Gender"
                        onChange={handleChange}>
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                        <MenuItem value={"Rather not say"}>Rather not say</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={0} md={4}>
            </Grid>

            <Grid item xs={12} md={12}>
            </Grid>
            <Grid item xs={0} md={4}>
            </Grid>


            <Grid item xs={12} md={4}>
                <center>
                    <Button onClick={register} variant="contained" disableElevation>
                        Register
                    </Button>
                </center>
            </Grid>
            <Grid item xs={0} md={4}></Grid>

        </Grid>
    );
};

export default Register;
