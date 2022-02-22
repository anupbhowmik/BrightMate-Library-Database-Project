const loginAdmin = async() => {
    var responseObj;
    var loginObj = {
        EMAIL : document.getElementById("email").value,
        PASSWORD : document.getElementById("password").value
    }
    var loginJSON = JSON.stringify(loginObj);
    console.log(loginJSON);
    var response;
    if(loginObj.EMAIL == ""){
        window.alert("Email field empty");
        return;
    }else if(loginObj.PASSWORD == ""){
        window.alert("Password field empty");
        return;
    }else{
        response = await fetch('http://localhost:5000/api/adminSignIn',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: loginJSON
        });
        responseObj = await response.json();
        console.log(responseObj);

        if(responseObj.ResponseCode == 0){
            window.alert(responseObj.ResponseDesc);
        }else if(responseObj.ResponseCode == 1){
            sessionStorage.setItem("adminName", responseObj.Username);
            sessionStorage.setItem("adminId", responseObj.UserId);
            sessionStorage.setItem("adminPassword", responseObj.PasswordKey);
            window.location.replace("/adminPanel/adminDashboard");
        }
    }  
}