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
  let syRegisterFine = 8;
  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let return_date = new Date();
    let rental_status = 3; //3 means returned
    let rentalId = req.body.RENT_ID;
    let employee_id = req.body.EMPLOYEE_ID;
    let employee_password = req.body.EMPLOYEE_PASSWORD;

    let employeeSelectQuery =
      "SELECT PASSWORD_KEY, USER_TYPE_ID FROM USERS WHERE USER_ID = :employee_id";
    let employeeSelectResult = await connection.execute(employeeSelectQuery, [
      employee_id,
    ]);

    let employee_password_key = employeeSelectResult.rows[0][0];
    let user_type_id = employeeSelectResult.rows[0][1];

    console.log("employee_password_key = ", employee_password_key);
    console.log("user_type_id = ", user_type_id);

    if (employee_password == employee_password_key && user_type_id == 2) {
      let jobSelectQuery =
        "SELECT JOB_ID FROM USER_EMPLOYEE WHERE USER_ID = :employee_id";
      let jobSelectResult = await connection.execute(jobSelectQuery, [
        employee_id,
      ]);

      let job_id = jobSelectResult.rows[0][0];
      console.log("job_id = ", job_id);

      if (job_id == 1 || job_id == 3) {
        //LIBRARIAN OR LIBRARY ASSISTANT ONLY

        let rentalQuery =
          "SELECT * FROM RENTAL_HISTORY WHERE RENTAL_HISTORY_ID = :rentalId";
        let rentalResult = await connection.execute(rentalQuery, [rentalId], {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        let returnObject = [];
        if (rentalResult.rows.length != 0) {
          rentalResult = rentalResult.rows[0];

          let user_id = rentalResult.USER_ID;
          let issue_date = rentalResult.ISSUE_DATE;
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
          const diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
          console.log("diff = ", diff);

          if (diff >= 14) {
            let fineQuery =
              "SELECT * FROM FINE_HISTORY WHERE RENTAL_HISTORY_ID = :rentalId";
            let fineResult = await connection.execute(fineQuery, [rentalId], {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
            });

            if (fineResult.rows.length != 0) {
              let fine_starting_date = fineResult.rows[0].FINE_STARTING_DATE;
              let fee_amount = fineResult.rows[0].FEE_AMOUNT;

              const utc3 = Date.UTC(
                fine_starting_date.getFullYear(),
                fine_starting_date.getMonth(),
                fine_starting_date.getDate()
              );
              const utc4 = Date.UTC(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const days = Math.floor((utc4 - utc3) / _MS_PER_DAY);
              console.log("days = ", days);
              fee_amount = 20 + days * 2;
              let fineUpdateQuery =
                "UPDATE FINE_HISTORY SET FEE_AMOUNT = :fee_amount, PAYMENT_STATUS = 1, PAYMENT_DATE = :today WHERE RENTAL_HISTORY_ID = :rentalId";
              let fineUpdateResult = await connection.execute(fineUpdateQuery, [
                fee_amount,
                today,
                rentalId,
              ]);

              console.log(fineUpdateResult);
            } else {
              //Get Next Fine Id
              let fine_id;
              await syRegister
                .getNextId(connection, syRegisterFine)
                .then(function (data) {
                  fine_id = data;
                });

              console.log("fine_id = ", fine_id);

              let fine_starting_date = issue_date + 14;

              const utc3 = Date.UTC(
                fine_starting_date.getFullYear(),
                fine_starting_date.getMonth(),
                fine_starting_date.getDate()
              );
              const utc4 = Date.UTC(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const days = Math.floor((utc4 - utc3) / _MS_PER_DAY);
              console.log("days = ", days);

              let fee_amount = 20 + days * 2;
              let payment_status = 1;
              let fineInsertQuery =
                "INSERT INTO FINE_HISTORY (FINE_HISTORY_ID, USER_ID, FINE_STARTING_DATE, FEE_AMOUNT, PAYMENT_STATUS, RENTAL_HISTORY_ID)" +
                " VALUES(:fine_id, :user_id, :today, :fee_amount, :payment_status, :rentalId)";
              fineInsertResult = await connection.execute(fineInsertQuery, [
                fine_id,
                user_id,
                fine_starting_date,
                fee_amount,
                payment_status,
                rentalId,
              ]);

              console.log(fineInsertResult);
            }
          }

          let rentUpdateQuery =
            "UPDATE RENTAL_HISTORY SET RETURN_DATE = :return_date, RENTAL_STATUS = :rental_status WHERE RENTAL_HISTORY_ID = :rentalId";
          let rentUpdateResult = await connection.execute(rentUpdateQuery, [
            return_date,
            rental_status,
            rentalId,
          ]);
          console.log(rentUpdateResult);
        }

        responseObj = {
          ResponseCode: 1,
          ResponseDesc: "SUCCESS",
          ResponseStatus: resp.statusCode,
          RentId: rent_id,
          ReturnDate: return_date,
        };
      }
      connection.commit();
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc:
          "NOT A LIBRARIAN OR LIBRARY ASSISTANT ACCOUNT / INVALID PASSWORD",
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
  let syRegisterFine = 8;
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let rentalQuery = "SELECT * FROM RENTAL_HISTORY";
    let rentalResult = await connection.execute(rentalQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    let rentalObject = [];
    if (rentalResult.rows.length != 0) {
      for (let j = 0; j < rentalResult.rows.length; j++) {
        let user_id = rentalResult.rows[j].USER_ID;
        let rentalId = rentalResult.rows[j].RENTAL_HISTORY_ID;

        let issue_date = rentalResult.rows[j].ISSUE_DATE;
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
        const diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);

        if (diff >= 14) {
          let fineQuery =
            "SELECT * FROM FINE_HISTORY WHERE RENTAL_HISTORY_ID = :rentalId";
          let fineResult = await connection.execute(fineQuery, [rentalId], {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          });

          if (fineResult.rows.length != 0) {
            let fine_starting_date = fineResult.rows[0].FINE_STARTING_DATE;

            const utc3 = Date.UTC(
              fine_starting_date.getFullYear(),
              fine_starting_date.getMonth(),
              fine_starting_date.getDate()
            );
            const utc4 = Date.UTC(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );
            const days = Math.floor((utc4 - utc3) / _MS_PER_DAY);

            let fee_amount = 20 + days * 2;
            let fineUpdateQuery =
              "UPDATE FINE_HISTORY SET FEE_AMOUNT = :fee_amount WHERE RENTAL_HISTORY_ID = :rentalId";
            let fineUpdateResult = await connection.execute(fineUpdateQuery, [
              fee_amount,
              rentalId,
            ]);

          } else {
            let rentUpdateQuery =
              "UPDATE RENTAL_HISTORY SET RENTAL_STATUS = 2 WHERE RENTAL_HISTORY_ID = :rentalId"; //2 means overdue
            let rentUpdateResult = await connection.execute(rentUpdateQuery, [
              rentalId,
            ]);

            //Get Next Fine Id
            let fine_id;
            await syRegister
              .getNextId(connection, syRegisterFine)
              .then(function (data) {
                fine_id = data;
              });

            let fine_starting_date = issue_date + 14;

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
            const diff2 = Math.floor((utc2 - utc1) / _MS_PER_DAY);
            
            let fee_amount = 20 + diff2 * 2;
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

        rentalObject.push({
          RentalId: rentalId,
          UserId: rentalResult.rows[j].USER_ID,
          BookCopyId: rentalResult.rows[j].BOOK_COPY_ID,
          IssueDate: issue_date,
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

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let fineQuery = "SELECT * FROM FINE_HISTORY";
    let fineResult = await connection.execute(fineQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    if (fineResult.rows.length != 0) {
      let fineObject = [];
      for (let j = 0; j < fineResult.rows.length; j++) {
        fineObject.push({
          FineId: fineResult.rows[j].FINE_HISTORY_ID,
          RentalId: fineResult.rows[j].RENTAL_HISTORY_ID,
          UserId: fineResult.rows[j].USER_ID,
          FineStartingDate: fineResult.rows[j].FINE_STARTING_DATE,
          FeeAmount: fineResult.rows[j].FEE_AMOUNT,
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

module.exports = {
  rentBook,
  returnBook,
  getAllRentalHistoryList,
  getAllFineHistoryList,
};
