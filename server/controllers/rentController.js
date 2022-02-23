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

    if (
      user_password == userCheckResult.rows[0].PASSWORD_KEY &&
      userCheckResult.rows[0].USER_TYPE_ID == 1
    ) {
      //Get Next Rental History Id
      let rent_id;
      await syRegister
        .getNextId(connection, syRegisterRentalHistory)
        .then(function (data) {
          rent_id = parseInt(data);
        });

      console.log("rent_id = ", rent_id);
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
      console.log("copy_id = ", copy_id);

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
    } else {
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
    let rental_status = 4; //4 means returned
    let rentalId = req.body.RENT_ID;

    let rentUpdateQuery =
      "UPDATE RENTAL_HISTORY SET RETURN_DATE = :return_date, RENTAL_STATUS = :rental_status WHERE RENTAL_HISTORY_ID = :rentalId";
    let rentUpdateResult = await connection.execute(rentUpdateQuery, [
      return_date,
      rental_status,
      rentalId,
    ]);
    console.log(rentUpdateResult);

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      RentId: rent_id,
      ReturnDate: return_date,
    };

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

async function clearDue(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let rentalStatus = 3; //3 means due cleared
    let rentalId = req.body.RENT_ID;

    let rentUpdateQuery =
      "UPDATE RENTAL_HISTORY SET RENTAL_STATUS = :rentalStatus WHERE RENTAL_HISTORY_ID = :rentalId";
    let rentUpdateResult = await connection.execute(rentUpdateQuery, [
      rentalStatus,
      rentalId,
    ]);
    console.log(rentUpdateResult);

    let fineQuery = "SELECT * FROM FINE_HISTORY WHERE RENTAL_HISTORY_ID = :rentalId";
    let fineResult = await connection.execute(fineQuery, [rentalId], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    console.log(fineResult);
    let feeAmount = fineResult.rows[0].FEE_AMOUNT;

    let paymentDate = new Date();
    let paymentStatus = 1; // 1 means due paid
    let fineUpdateQuery =
      "UPDATE FINE_HISTORY SET PAYMENT_STATUS = :paymentStatus, PAYMENT_DATE = :paymentDate WHERE RENTAL_HISTORY_ID = :rentalId";
    let fineUpdateResult = await connection.execute(fineUpdateQuery, [
      paymentStatus,
      paymentDate,
      rentalId,
    ]);
    console.log(fineUpdateResult);

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      RentId: rentalId,
      FeeAmount: feeAmount,
      PaymentStatus: paymentStatus,
      RentalStatus: rentalStatus,
      PaymentDate: paymentDate
    };
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
        responseObj = {
          ResponseCode: 0,
          ResponseDesc: "ERROR CLOSING CONNECTION",
          ResponseStatus: resp.statusCode,
        };
        resp.send(responseObj);
      }
      if (responseObj.ResponseCode == 1) {
        resp.send(responseObj);
      }
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "FAILURE",
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
    let rental_status = 4; //4 means returned
    let rentalId = req.body.RENT_ID;

    let rentUpdateQuery =
      "UPDATE RENTAL_HISTORY SET RETURN_DATE = :return_date, RENTAL_STATUS = :rental_status WHERE RENTAL_HISTORY_ID = :rentalId";
    let rentUpdateResult = await connection.execute(rentUpdateQuery, [
      return_date,
      rental_status,
      rentalId,
    ]);
    console.log(rentUpdateResult);

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      RentId: rentalId,
      ReturnDate: return_date,
    };

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

async function getAllRentalHistoryList(req, resp) {
  let connection;
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let rentalQuery = "SELECT * FROM RENTAL_HISTORY ORDER BY ISSUE_DATE ASC";
    let rentalResult = await connection.execute(rentalQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });


    let rentalObject = [];
    if (rentalResult.rows.length != 0) {
      for (let j = 0; j < rentalResult.rows.length; j++) {

        let user_id = rentalResult.rows[j].USER_ID;
        let bookCopyId = rentalResult.rows[j].BOOK_COPY_ID;

        let bookQuery = "SELECT * FROM BOOKS b, BOOK_COPY bc WHERE BOOK_COPY_ID = :bookCopyId AND b.BOOK_ID = bc.BOOK_ID";
        let bookResult = await connection.execute(bookQuery, [bookCopyId], {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        let userQuery = "SELECT * FROM USERS u, USER_READERS ur WHERE u.USER_ID = :user_id AND u.USER_ID = ur.USER_ID";
        let userResult = await connection.execute(userQuery, [user_id], {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
    
        rentalObject.push({
          RentalId: rentalResult.rows[j].RENTAL_HISTORY_ID,
          UserId: rentalResult.rows[j].USER_ID,
          UserName: userResult.rows[0].USER_NAME,
          LibraryCardNumber: userResult.rows[0].LIBRARY_CARD_NUMBER,
          BookCopyId: rentalResult.rows[j].BOOK_COPY_ID,
          BookId: bookResult.rows[0].BOOK_ID,
          BookTitle: bookResult.rows[0].BOOK_TITLE,
          Edition: bookResult.rows[0].EDITION,
          IssueDate: rentalResult.rows[j].ISSUE_DATE,
          ReturnDate: rentalResult.rows[j].RETURN_DATE,
          RentalStatus: rentalResult.rows[j].RENTAL_STATUS,
        });
      }

      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        RentalObject: rentalObject,
      };
      connection.commit();
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "FAILURE",
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

async function getAllFineHistoryList(req, resp) {
  let connection;
  let syRegisterFine = 8;
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let rentQuery =
      "SELECT RENTAL_HISTORY_ID, ISSUE_DATE, USER_ID, BOOK_COPY_ID, (ISSUE_DATE+14) AS FINE_STARTING_DATE FROM RENTAL_HISTORY WHERE RENTAL_STATUS = 1";
    let rentResult = await connection.execute(rentQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (rentResult.rows.length != 0) {
      for (let i = 0; i < rentResult.rows.length; i++) {
        let rentalResult = rentResult.rows[i];
        let rentalId = rentalResult.RENTAL_HISTORY_ID;
        let user_id = rentalResult.USER_ID;
        let issue_date = rentalResult.ISSUE_DATE;
        let fine_starting_date = rentalResult.FINE_STARTING_DATE;
        let today = new Date();

        const utc1 = Date.UTC(
          issue_date.getFullYear(),
          issue_date.getMonth(),
          issue_date.getDate()
        );
        const utc2 = Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const utc3 = Date.UTC(
          fine_starting_date.getFullYear(),
          fine_starting_date.getMonth(),
          fine_starting_date.getDate()
        );

        const delay = Math.floor((utc2 - utc1) / _MS_PER_DAY);

        if (delay >= 14) {
          let rentUpdateQuery =
            "UPDATE RENTAL_HISTORY SET RENTAL_STATUS = 2 WHERE RENTAL_HISTORY_ID = :rentalId"; //2 means overdue
          let rentUpdateResult = await connection.execute(rentUpdateQuery, [
            rentalId,
          ]);
          console.log(rentUpdateResult);
          //Get Next Fine Id
          let fine_id;
          await syRegister
            .getNextId(connection, syRegisterFine)
            .then(function (data) {
              fine_id = data;
            });

          const feeDays = Math.floor((utc2 - utc3) / _MS_PER_DAY);

          let fee_amount = 20 + feeDays * 2;
          let payment_status = 0;
          let fineInsertQuery =
            "INSERT INTO FINE_HISTORY (FINE_HISTORY_ID, USER_ID, FINE_STARTING_DATE, FEE_AMOUNT, PAYMENT_STATUS, RENTAL_HISTORY_ID)" +
            " VALUES(:fine_id, :user_id, :fine_starting_date, :fee_amount, :payment_status, :rentalId)";
          fineInsertResult = await connection.execute(fineInsertQuery, [
            fine_id,
            user_id,
            fine_starting_date,
            fee_amount,
            payment_status,
            rentalId,
          ]);
        }
      }
    }

    let fineQuery = "SELECT * FROM FINE_HISTORY";
    let fineResult = await connection.execute(fineQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (fineResult.rows.length != 0) {
      let fineObject = [];
      for (let j = 0; j < fineResult.rows.length; j++) {
        let fineId = fineResult.rows[j].FINE_HISTORY_ID;
        let fine_starting_date = fineResult.rows[j].FINE_STARTING_DATE;
        let today = new Date();

        const utc1 = Date.UTC(
          fine_starting_date.getFullYear(),
          fine_starting_date.getMonth(),
          fine_starting_date.getDate()
        );
        const utc2 = Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const days = Math.floor((utc2 - utc1) / _MS_PER_DAY);

        let fee_amount = 20 + days * 2;
        let fineUpdateQuery =
          "UPDATE FINE_HISTORY SET FEE_AMOUNT = :fee_amount WHERE FINE_HISTORY_ID = :fineId";
        let fineUpdateResult = await connection.execute(fineUpdateQuery, [
          fee_amount,
          fineId,
        ]);

        fineObject.push({
          FineId: fineId,
          RentalId: fineResult.rows[j].RENTAL_HISTORY_ID,
          UserId: fineResult.rows[j].USER_ID,
          FineStartingDate: fine_starting_date,
          FeeAmount: fee_amount,
          PaymentDate: fineResult.rows[j].PAYMENT_DATE,
          PaymentStatus: fineResult.rows[j].PAYMENT_STATUS,
        });
      }

      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        FineObject: fineObject,
      };
      connection.commit();
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA",
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
  rentBook,
  clearDue,
  returnBook,
  getAllRentalHistoryList,
  getAllFineHistoryList,
};
