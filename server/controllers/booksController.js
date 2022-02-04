const oracledb = require("oracledb");

const server = require("../serverInformation");
const syRegister = require("../util/syRegister");
const dbuser = server.user;
const dbpassword = server.password;
const connectionString = server.connectionString;
let responseObj = {};

async function addBook(req, resp) {
  let connection;
  let syRegisterBooks = 4;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let title = req.body.TITLE;
    let yearOfPublication = req.body.YEAR;
    let book_description = null;
    if (typeof req.body.DESCRIPTION !== "undefined") {
      book_description = req.body.DESCRIPTION;
    }
    let language = req.body.LANGUAGE;
    let authorArr = req.body.AUTHOR_ID;
    let edition = req.body.EDITION;
    let isbn = req.body.ISBN;
    let publisher_id = req.body.PUBLISHER_ID;
    let genreArr = req.body.GENRE;

    //Get Next Book Id
    let book_id;
    await syRegister
      .getNextId(connection, syRegisterBooks)
      .then(function (data) {
        book_id = parseInt(data);
      });

    console.log(book_id);

    let bookInsertQuery =
      "INSERT INTO BOOKS (BOOK_ID, BOOK_TITLE, YEAR_OF_PUBLICATION, DESCRIPTION, EDITION, ISBN, LANGUAGE, PUBLISHER_ID) " +
      "VALUES( :book_id, :title, :yearOfPublication, :book_description, :edition, :isbn, :language, :publisher_id)";
    let bookInsertResult = await connection.execute(bookInsertQuery, [
      book_id,
      title,
      yearOfPublication,
      book_description,
      edition,
      isbn,
      language,
      publisher_id,
    ]);

    console.log(bookInsertResult);

    for (let i = 0; i < authorArr.length; i++) {
      author_id = authorArr[i];
      let authorInsertQuery =
        "INSERT INTO BOOKS_AUTHORS(BOOK_ID, AUTHOR_ID) VALUES(:book_id, :author_id)";
      let authorInsertResult = await connection.execute(authorInsertQuery, [
        book_id,
        author_id,
      ]);

      console.log(authorInsertResult);
    }

    for (let i = 0; i < genreArr.length; i++) {
      genre_id = genreArr[i];
      let genreInsertQuery =
        "INSERT INTO BOOKS_GENRE(BOOK_ID, GENRE_ID) VALUES(:book_id, :genre_id)";
      let genreInsertResult = await connection.execute(genreInsertQuery, [
        book_id,
        genre_id,
      ]);

      console.log(genreInsertResult);
    }

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      BookID: book_id,
      Title: title,
      AuthorId: authorArr,
      Genre: genreArr,
      Publisher_id: publisher_id,
      YearOfPublication: yearOfPublication,
      Edition: edition,
      ISBN: isbn,
      Description: book_description,
      Language: language,
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

async function getBooks(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    bookSelectQuery = "SELECT * FROM BOOKS";
    let bookSelectResult = await connection.execute(bookSelectQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    console.log(bookSelectResult);

    if (bookSelectResult.rows.length === 0) {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA FOUND IN DATABASE",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let bookObject = [];
      for (let i = 0; i < bookSelectResult.rows.length; i++) {
        let bookItem = bookSelectResult.rows[i];

        let authorId = bookItem.AUTHOR_ID;
        let authorName;
        if (authorId != undefined) {
          let authorQuery =
            "SELECT AUTHOR_NAME FROM AUTHOR WHERE AUTHOR_ID = :authorId";
          authorName = await connection.execute(authorQuery, [authorId], {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          });
          authorName = authorName.rows[0].AUTHOR_NAME;
        }

        let publisherId = bookItem.PUBLISHER_ID;
        let publisherName;
        if (publisherId != undefined) {
          let publisherQuery =
            "SELECT PUBLISHER_NAME FROM PUBLISHER WHERE PUBLISHER_ID = :publisherId";
          publisherName = await connection.execute(
            publisherQuery,
            [publisherId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          publisherName = publisherName.rows[0].PUBLISHER_NAME;
        }

        bookObject.push({
          BookID: bookItem.BOOK_ID,
          Title: bookItem.BOOK_TITLE,
          Author: authorName,
          Publisher: publisherName,
          YearOfPublication: bookItem.YEAR_OF_PUBLICATION,
          Description: bookItem.DESCRIPTION,
          Language: bookItem.LANGUAGE,
          Edition: bookItem.EDITION,
          ISBN: bookItem.ISBN,
        });
      }
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        Books: bookObject,
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
  addBook,
  getBooks,
};
