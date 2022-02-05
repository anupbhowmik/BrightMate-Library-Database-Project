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
    let book_id = req.body.BOOK_ID;

    //Get Next Rental History Id
    let rent_id;
    await syRegister
      .getNextId(connection, syRegisterRentalHistory)
      .then(function (data) {
        rent_id = parseInt(data);
      });

    console.log(rent_id);

    let rentInsertQuery =
      "INSERT INTO RENTAL_HISTORY (RENTAL_HISTORY_ID, ISSUE_DATE, RENTAL_STATUS, USER_ID, BOOK_ID) " +
      "VALUES( :rent_id, :issue_date, :status, :user_id, :book_id)";
    let rentInsertResult = await connection.execute(rentInsertQuery, [
        rent_id,
        issue_date,
        status,
        user_id,
        book_id
    ]);

    console.log(rentInsertResult);

    
    let bookUpdateQuery = "UPDATE BOOKS SET AVAILABLE_STATUS = 0 WHERE BOOK_ID = :book_id";
    let bookUpdateResult = await connection.execute(bookUpdateQuery, [
        book_id
    ]);

    console.log(bookUpdateResult);

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      RentId: rent_id,
      BookID: book_id,
      BorrowerID: user_id,
      IssueDate: issue_date,
      Status: status,
    };
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

//-----------RETURN BOOK SHOULD BE HANDLED FROM ADMIN SIDE------------
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
      let status = 3;
      let rent_id = req.body.RENT_ID;
      let book_id = req.body.BOOK_ID;
  
      let rentUpdateQuery =
        "UPDATE RENTAL_HISTORY SET RETURN_DATE = :return_date, RENTAL_STATUS = :status WHERE RENTAL_HISTORY_ID = :rent_id";
      let rentUpdateResult = await connection.execute(rentUpdateQuery, [
          return_date,
          status,
          rent_id
      ]);
  
      console.log(rentUpdateResult);

      let bookUpdateQuery = "UPDATE BOOKS SET AVAILABLE_STATUS = 1 WHERE BOOK_ID = :book_id";
      let bookUpdateResult = await connection.execute(bookUpdateQuery, [
          book_id
      ]);
  
      console.log(bookUpdateResult);
  
      connection.commit();
  
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        RentId: rent_id,
        BookID: book_id,
        BorrowerID: user_id,
        IssueDate: issue_date,
        Status: status,
      };
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
  

module.exports = {
  rentBook
};
