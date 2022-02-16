const oracledb = require("oracledb");
const server = require("../serverInformation");
const syRegister = require("../util/syRegister");
const dbuser = server.user;
const dbpassword = server.password;
const connectionString = server.connectionString;
let responseObj = {};

async function rentBook(req, resp) {
  let connection;
  let syRegisterRentalHistory = 7;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let issue_date = new Date();
    let status = 1;
    let user_id = req.body.USER_ID;
    let user_password = req.body.USER_PASSWORD;
    let book_id = req.body.BOOK_ID;
    let edition = req.body.EDITION;
    
    //CHECKING USER

    let userCheckQuery = "SELECT * FROM USERS WHERE USER_ID = :user_id";
    let userCheckResult = await connection.execute(userCheckQuery, [user_id], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (user_password == userCheckResult.rows[0].PASSWORD_KEY && userCheckResult.rows[0].USER_TYPE_ID == 1) {
      //Get Next Rental History Id
      let rent_id;
      await syRegister
        .getNextId(connection, syRegisterRentalHistory)
        .then(function (data) {
          rent_id = parseInt(data);
        });

      console.log("rent_id = ",rent_id);
      console.log(book_id);
      console.log(edition);

      let copySelectQuery =
        "SELECT MIN(BOOK_COPY_ID) AS COP_ID FROM BOOK_COPY WHERE BOOK_ID = :book_id AND EDITION = :edition AND STATUS = 1";
      let copySelectResult = await connection.execute(copySelectQuery, [
        book_id,
        edition,
      ]);
      console.log(copySelectResult);
      let copy_id = copySelectResult.rows[0][0];
      console.log("copy_id = ",copy_id);

      let rentInsertQuery =
        "INSERT INTO RENTAL_HISTORY (RENTAL_HISTORY_ID, ISSUE_DATE, RENTAL_STATUS, USER_ID, BOOK_COPY_ID) " +
        "VALUES( :rent_id, :issue_date, :status, :user_id, :copy_id)";
      let rentInsertResult = await connection.execute(rentInsertQuery, [
        rent_id,
        issue_date,
        status,
        user_id,
        copy_id,
      ]);

      console.log(rentInsertResult);

      connection.commit();

      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        RentId: rent_id,
        BookID: book_id,
        CopyId: copy_id,
        Edition: edition,
        UserID: user_id,
        IssueDate: issue_date,
        Status: status,
      };
    }else{
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "PASSWORD NOT MATCHED OR INVALID USER ID",
        ResponseStatus: resp.statusCode,
      };
      resp.send(responseObj);
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
        console.log("INSERTED");
        resp.send(responseObj);
      }
    } else {
      console.log("NOT INSERTED");
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NOT INSERTED",
        ResponseStatus: resp.statusCode,
      };
      resp.send(responseObj);
    }
  }
}

async function returnBook(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let return_date = new Date();
    let status = 3; //3 means returned
    let rent_id = req.body.RENT_ID;
    let employee_id = req.body.EMPLOYEE_ID;
    let employee_password = req.body.EMPLOYEE_PASSWORD_KEY;

    let employeeSelectQuery =
      "SELECT PASSWORD_KEY, USER_TYPE_ID FROM USERS WHERE USER_ID = :employee_id";
    let employeeSelectResult = await connection.execute(employeeSelectQuery, [
      employee_id,
    ]);

    let employee_password_key = employeeSelectResult.rows[0][0];
    let user_type_id = employeeSelectResult.rows[0][1];

    if (employee_password == employee_password_key && user_type_id == 2) {
      let jobSelectQuery =
        "SELECT JOB_ID FROM USER_EMPLOYEE WHERE USER_ID = :employee_id";
      let jobSelectResult = await connection.execute(jobSelectQuery, [
        employee_id,
      ]);

      let job_id = jobSelectResult.rows[0][0];
      console.log(job_id);
      if (job_id == 1 || job_id == 3) {
        let rentUpdateQuery =
          "UPDATE RENTAL_HISTORY SET RETURN_DATE = :return_date, RENTAL_STATUS = :status WHERE RENTAL_HISTORY_ID = :rent_id";
        let rentUpdateResult = await connection.execute(rentUpdateQuery, [
          return_date,
          status,
          rent_id,
        ]);

        console.log(rentUpdateResult);
        responseObj = {
          ResponseCode: 1,
          ResponseDesc: "SUCCESS",
          ResponseStatus: resp.statusCode,
          RentId: rent_id,
          ReturnDate: return_date,
        };
      }
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "USER ODES NOT HAVE PERMISSION TO ACCEPT A BOOK",
        ResponseStatus: resp.statusCode,
      };
    }

    connection.commit();
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
        console.log("SUCCESS");
        resp.send(responseObj);
      }
    } else {
      console.log("FAILURE");
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "FAILURE",
        ResponseStatus: resp.statusCode,
      };
      resp.send(responseObj);
    }
  }
}

module.exports = {
  rentBook,
  returnBook,
};
