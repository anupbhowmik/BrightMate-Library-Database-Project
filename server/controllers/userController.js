const oracledb = require("oracledb");
const bcrypt = require("bcrypt");
const server = require("../serverInformation");
const syRegister = require("../util/syRegister");
const dbuser = server.user;
const dbpassword = server.password;
const connectionString = server.connectionString;
let responseObj = {};

async function signUp(req, resp) {
  let connection;
  let result;
  let userExistsAlready = 1;
  let syRegisterUsers = 1;

  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let user_name = req.body.USER_NAME;
    let email = req.body.EMAIL;
    let user_password = req.body.PASSWORD;
    let mobile = req.body.MOBILE;
    let gender = req.body.GENDER;
    let user_type_id = 1;

    let userCheckQuery = "SELECT * FROM USERS WHERE EMAIL = :email";
    let user_exists = await connection.execute(userCheckQuery, [email], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(user_exists);

    if (user_exists.rows.length == 0) {
      //user does not exist
      console.log("user does not exist");
      userExistsAlready = 0;

      //Get Next User Id
      let user_id;
      await syRegister
        .getNextId(connection, syRegisterUsers)
        .then(function (data) {
          user_id = data;
        });

      console.log(user_id);
      console.log(user_password, " ", salt);
      const hash = bcrypt.hashSync(user_password, salt);

      let userInsertQuery =
        "INSERT INTO USERS (USER_ID, USER_NAME, EMAIL, PASSWORD_KEY, MOBILE, GENDER, USER_TYPE_ID) VALUES( :user_id, :user_name, :email, :hash, :mobile, :gender, :user_type_id)";
      let userInsertResult = await connection.execute(userInsertQuery, [
        user_id,
        user_name,
        email,
        hash,
        mobile,
        gender,
        user_type_id,
      ]);

      console.log(userInsertResult);

      library_card_num = 1;
      today = new Date();

      let readerInsertQuery =
        "INSERT INTO USER_READERS (USER_ID, LIBRARY_CARD_NUMBER, MEMBERSHIP_TAKEN_DATE) VALUES( :user_id, :library_card_num, :today)";
      result = await connection.execute(readerInsertQuery, [
        user_id,
        library_card_num,
        today,
      ]);

      console.log(result);

      connection.commit();

      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        Username: user_name,
        UserId: user_id,
        Email: email,
        Mobile: mobile,
        Gender: gender,
        LibraryCardNumber: library_card_num,
      };
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "FAILURE",
      };
      console.log("USER EXISTS ALREADY");
    }
  } catch (err) {
    console.log(err);
    resp.send(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("CONNECTION CLOSED");
      } catch (err) {
        console.log("Error closing connection");
        resp.send(err);
      }
      if (userExistsAlready == 0) {
        if (responseObj.ResponseCode == 1) {
          console.log("INSERTED");
          resp.send(responseObj);
        }
      } else {
        console.log("NOT INSERTED");
        resp.send(responseObj);
      }
    }
  }
}

async function signIn(req, resp) {
  let connection;
  let userExistsAlready = 0;
  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    email = req.body.EMAIL;
    userPassword = req.body.PASSWORD;

    let userCheckQuery = "SELECT * FROM USERS WHERE EMAIL = :email";
    let userInfo = await connection.execute(userCheckQuery, [email], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(userInfo);
    if (userInfo.rows.length == 0) {
      //user does not exist
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "USER DOES NOT EXIST",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let passwordKey = userInfo.rows[0].PASSWORD_KEY;
      let user_id = userInfo.rows[0].USER_ID;
      let user_name = userInfo.rows[0].USER_NAME;
      let email = userInfo.rows[0].EMAIL;
      let mobile = userInfo.rows[0].MOBILE;
      let gender = userInfo.rows[0].GENDER;
      let user_type_id = userInfo.rows[0].USER_TYPE_ID;

      let passwordCorrect = bcrypt.compareSync(userPassword, passwordKey);
      if (passwordCorrect) {
        responseObj = {
          ResponseCode: 1,
          ResponseDesc: "SUCCESS",
          ResponseStatus: resp.statusCode,
          UserId: user_id,
          Username: user_name,
          Email: email,
          Mobile: mobile,
          Gender: gender,
          UserTypeId: user_type_id,
        };
      } else {
        responseObj = {
          ResponseCode: 0,
          ResponseDesc: "PASSWORD INCORRECT",
          ResponseStatus: resp.statusCode,
        };
      }
    }
    //connection.commit();
  } catch (err) {
    console.log(err);
    responseObj = {
      ResponseCode: 0,
      ResponseDesc: "FAILURE",
      ResponseStatus: resp.statusCode,
    };
    resp.send(responseObj);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("CONNECTION CLOSED");
      } catch (err) {
        console.log("Error closing connection");
        responseObj = {
          ResponseCode: 0,
          ResponseDesc: "FAILURE",
          ResponseStatus: resp.statusCode,
        };
        resp.send(responseObj);
      }
      if (userExistsAlready == 1) {
        if (responseObj.ResponseCode == 1) {
          console.log("USER LOGGED IN SUUCCESSFULLY");
          resp.send(responseObj);
        } else {
          console.log("NOT LOGGED IN");
          resp.send(responseObj);
        }
      } else {
        console.log("NOT LOGGED IN");
        resp.send(responseObj);
      }
    }
  }
}

async function addEmployee(req, resp) {
  let connection;
  let userExistsAlready = true;
  let syRegisterUsers = 1;

  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let user_name = req.body.USER_NAME;
    let email = req.body.EMAIL;
    let user_password = req.body.PASSWORD;
    let mobile = req.body.MOBILE;
    let gender = req.body.GENDER;
    let job_id = req.body.JOB_ID;
    let user_type_id = 2; //EMPLOYEE

    let userCheckQuery = "SELECT * FROM USERS WHERE EMAIL = :email";
    let user_exists = await connection.execute(userCheckQuery, [email], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(user_exists);

    if (user_exists.rows.length == 0) {
      //user does not exist
      console.log("user does not exist");
      userExistsAlready = false;

      //Get Next User Id
      let user_id;
      await syRegister
        .getNextId(connection, syRegisterUsers)
        .then(function (data) {
          user_id = data;
        });

      console.log(user_id);
      console.log(user_password, " ", salt);
      const hash = bcrypt.hashSync(user_password, salt);

      let userInsertQuery =
        "INSERT INTO USERS (USER_ID, USER_NAME, EMAIL, PASSWORD_KEY, MOBILE, GENDER, USER_TYPE_ID) VALUES( :user_id, :user_name, :email, :hash, :mobile, :gender, :user_type_id)";
      let userInsertResult = await connection.execute(userInsertQuery, [
        user_id,
        user_name,
        email,
        hash,
        mobile,
        gender,
        user_type_id,
      ]);

      console.log(userInsertResult);

      join_date = new Date();

      let employeeInsertQuery =
        "INSERT INTO USER_EMPLOYEE (USER_ID, JOIN_DATE, JOB_ID) VALUES( :user_id, :join_date, :job_id)";
      employeeInsertresult = await connection.execute(employeeInsertQuery, [
        user_id,
        join_date,
        job_id,
      ]);

      console.log(employeeInsertresult);

      connection.commit();

      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        Username: user_name,
        UserType: 2,
        UserId: user_id,
        Email: email,
        Mobile: mobile,
        Gender: gender,
        JobID: job_id,
      };
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "FAILURE",
        ResponseStatus: resp.statusCode,
      };
      console.log("USER EXISTS ALREADY");
    }
  } catch (err) {
    console.log(err);
    responseObj = {
      ResponseCode: 0,
      ResponseDesc: "FAILURE",
      ResponseStatus: resp.statusCode,
    };
    resp.send(responseObj);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("CONNECTION CLOSED");
      } catch (err) {
        console.log("Error closing connection");
        responseObj = {
          ResponseCode: 0,
          ResponseDesc: "Error closing connection",
          ResponseStatus: resp.statusCode,
        };
        resp.send(responseObj);
      }
      if (responseObj.ResponseCode == 1) {
        console.log("INSERTED");
        resp.send(responseObj);
      } else {
        console.log("NOT INSERTED");
        responseObj = {
          ResponseCode: 0,
          ResponseDesc: "USER EXISTS ALREADY",
          ResponseStatus: resp.statusCode,
        };
        resp.send(responseObj);
      }
    }
  }
}

async function getJobs(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    jobSelectQuery = "SELECT * FROM JOBS";
    let jobSelectResult = await connection.execute(jobSelectQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    console.log(jobSelectResult);

    if (jobSelectResult.rows.length === 0) {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA FOUND",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let jobObject = [];
      for (let i = 0; i < jobSelectResult.rows.length; i++) {
        let jobItem = jobSelectResult.rows[i];

        jobObject.push({
          JobID: jobItem.JOB_ID,
          JobTitle: jobItem.JOB_TITLE,
          Salary: jobItem.SALARY,
        });
      }
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        Jobs: jobObject,
      };
    }
  } catch (err) {
    console.log(err);
    responseObj = {
      ResponseCode: 0,
      ResponseDesc: "FAILURE",
      ResponseStatus: resp.statusCode,
    };
    resp.send(responseObj);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("CONNECTION CLOSED");
      } catch (err) {
        console.log("Error closing connection");
        responseObj = {
          ResponseCode: 0,
          ResponseDesc: "ERROR CLOSING CONNECTION",
          ResponseStatus: resp.statusCode,
        };
        resp.send(responseObj);
      }
      if (responseObj.ResponseCode == 1) {
        console.log("FOUND");
        resp.send(responseObj);
      }
    } else {
      console.log("NOT FOUND");
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NOT FOUND",
        ResponseStatus: resp.statusCode,
      };
      resp.send(responseObj);
    }
  }
}

module.exports = {
  signUp,
  signIn,
  addEmployee,
  getJobs,
};
