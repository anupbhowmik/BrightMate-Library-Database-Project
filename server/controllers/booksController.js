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

    if (
      req.body.TITLE.length != 0 &&
      req.body.AUTHOR_ID.length != 0 &&
      req.body.PUBLISHER_ID.length != 0 &&
      req.body.GENRE.length != 0
    ) {
      console.log("all good");
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
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "INSUFFICIENT DATA",
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

async function getBooks(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    bookSelectQuery =
      "SELECT MIN(BOOK_ID) AS BID, COUNT(BOOK_ID) AS CNT, ISBN, BOOK_TITLE, EDITION, PUBLISHER_ID, DESCRIPTION, LANGUAGE FROM BOOKS WHERE AVAILABLE_STATUS = 1 GROUP BY ISBN, EDITION, BOOK_TITLE, PUBLISHER_ID, DESCRIPTION, LANGUAGE";
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

        let book_id = bookItem.BID;
        authorSelectQuery =
          "SELECT * FROM BOOKS_AUTHORS WHERE BOOK_ID = :book_id";
        let authorSelectResult = await connection.execute(
          authorSelectQuery,
          [book_id],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          }
        );

        console.log(authorSelectResult);
        let authorNameArr = [];
        let authorIdArr = [];
        if (authorSelectResult.rows.length != 0) {
          for (let j = 0; j < authorSelectResult.rows.length; j++) {
            let authorId = authorSelectResult.rows[j].AUTHOR_ID;
            authorIdArr[j] = authorId;
            let authorQuery =
              "SELECT AUTHOR_NAME FROM AUTHOR WHERE AUTHOR_ID = :authorId";
            authorNameResult = await connection.execute(authorQuery, [authorId], {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
            });
            authorNameArr[j] = authorNameResult.rows[0].AUTHOR_NAME;
          }
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
          BookID: book_id,
          Title: bookItem.BOOK_TITLE,
          AuthorId: authorIdArr,
          AuthorName: authorNameArr,
          Publisher: publisherName,
          CountOfBooks: bookItem.CNT,
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
