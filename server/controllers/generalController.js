const oracledb = require("oracledb");

const server = require("../serverInformation");
const syRegister = require("../util/syRegister");
const dbuser = server.user;
const dbpassword = server.password;
const connectionString = server.connectionString;
let responseObj = {};

async function addAuthor(req, resp) {
  let connection;
  let syRegisterAuthors = 2;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let authorInsertQuery;

    let author_name = req.body.AUTHOR_NAME;
    let dateOfBirth = null;
    if (typeof req.body.DATE_OF_BIRTH !== "undefined") {
      dateOfBirth = new Date(req.body.DATE_OF_BIRTH);
    }
    let dateOfDeath = null;
    if (typeof req.body.DATE_OF_DEATH !== "undefined") {
      dateOfDeath = new Date(req.body.DATE_OF_DEATH);
    }
    let bio = req.body.BIO;

    //Get Next Author Id
    let author_id;
    await syRegister
      .getNextId(connection, syRegisterAuthors)
      .then(function (data) {
        author_id = parseInt(data);
      });

    console.log(author_id);

    authorInsertQuery =
      "INSERT INTO AUTHOR (AUTHOR_ID, AUTHOR_NAME, DATE_OF_BIRTH, DATE_OF_DEATH, BIO) VALUES( :author_id, :author_name, :dateOfBirth, :dateOfDeath, :bio)";
    let authorInsertResult = await connection.execute(authorInsertQuery, [
      author_id,
      author_name,
      dateOfBirth,
      dateOfDeath,
      bio,
    ]);

    console.log(authorInsertResult);

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      AuthorName: author_name,
      AuthorId: author_id,
      DateOfBirth: dateOfBirth,
      DateOfDeath: dateOfDeath,
      Bio: bio,
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

async function addPublisher(req, resp) {
  let connection;
  let syRegisterPublishers = 5;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let publisherInsertQuery;

    let publisher_name = req.body.PUBLISHER_NAME;
    let phone = req.body.PHONE;
    let addressLine = req.body.ADDRESS_LINE;
    let city = req.body.CITY;
    let postalCode = req.body.POSTAL_CODE;
    let country = req.body.COUNTRY;

    //Get Next Publisher Id
    let publisher_id;
    await syRegister
      .getNextId(connection, syRegisterPublishers)
      .then(function (data) {
        publisher_id = parseInt(data);
      });

    console.log(publisher_id);

    publisherInsertQuery =
      "INSERT INTO PUBLISHER (PUBLISHER_ID, PUBLISHER_NAME, PHONE, ADDRESS_LINE, CITY, POSTAL_CODE, COUNTRY) VALUES( :publisher_id, :publisher_name, :phone, :addressLine, :city, :postalCode, :country)";
    let publisherInsertResult = await connection.execute(publisherInsertQuery, [
      publisher_id,
      publisher_name,
      phone,
      addressLine,
      city,
      postalCode,
      country
    ]);

    console.log(publisherInsertResult);

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      PublisherName: publisher_name,
      PublisherId: publisher_id,
      Phone: phone,
      Address: address,
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

async function getGenre(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    genreSelectQuery = "SELECT * FROM GENRE";
    let genreSelectResult = await connection.execute(genreSelectQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    console.log(genreSelectResult);

    if (genreSelectResult.rows.length === 0) {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA FOUND IN DATABASE",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let genreObject = [];
      for (let i = 0; i < genreSelectResult.rows.length; i++) {
        let genreItem = genreSelectResult.rows[i];

        genreObject.push({
          GenreID: genreItem.GENRE_ID,
          GenreName: genreItem.GENRE_NAME,
        });
      }
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        GenreList: genreObject,
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

async function getAuthors(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    authorSelectQuery = "SELECT * FROM AUTHOR ORDER BY AUTHOR_NAME ASC";
    let authorSelectResult = await connection.execute(authorSelectQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    console.log(authorSelectResult);

    if (authorSelectResult.rows.length === 0) {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA FOUND IN DATABASE",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let authorObject = [];
      for (let i = 0; i < authorSelectResult.rows.length; i++) {
        let authorItem = authorSelectResult.rows[i];

        authorObject.push({
          AuthorID: authorItem.AUTHOR_ID,
          AuthorName: authorItem.AUTHOR_NAME,
          DateOfBirth: authorItem.DATE_OF_BIRTH,
          DateOfDeath: authorItem.DATE_OF_DEATH,
          Bio: authorItem.BIO,
        });
      }
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        AuthorList: authorObject,
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

async function search(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let searchKey = req.body.SEARCH_KEY;
    searchKey = "%" + searchKey + "%";

    let authorKey = req.body.AUTHOR_OBJECT;
    let is_author_filter = authorKey.IS_AUTHOR_FILTER;
    let author_name;
    let authorQuery;
    if(is_author_filter == 1){
      author_name = authorKey.AUTHOR_NAME;
      author_name = "%" + author_name + "%";
      authorQuery = " AND ba.AUTHOR_ID IN (SELECT AUTHOR_ID FROM AUTHOR WHERE UPPER(AUTHOR_NAME) LIKE UPPER(:author_name)) AND b.BOOK_ID = ba.BOOK_ID"
    }

    let genreKey = req.body.GENRE_OBJECT;
    let is_genre_filter = genreKey.IS_GENRE_FILTER;
    let genre_id;
    let genreQuery = "";
    if(is_genre_filter == 1){
      genre_id = genreKey.GENRE_ID;
      genreQuery = "";
    }

    let yearKey = req.body.YEAR_OBJECT;
    let is_year_filter = yearKey.IS_YEAR_FILTER;
    let year;
    let yearQuery = "";
    if(is_year_filter == 1){
      year = yearKey.YEAR;
      yearQuery = "";
    }

    let searchQuery =
      "SELECT ba.BOOK_ID, b.BOOK_TITLE, b.DESCRIPTION, b.LANGUAGE, b.PUBLISHER_ID, b.ISBN, b.AVAILABLE_COPIES" +
       " FROM BOOKS b, BOOKS_AUTHORS ba WHERE UPPER(b.BOOK_TITLE) LIKE UPPER(:searchKey) AND b.AVAILABLE_COPIES > 0 " +
       authorQuery + genreQuery + yearQuery + " ORDER BY b.YEAR_OF_PUBLICATION DESC";
       console.log(searchQuery);
      let searchResult = await connection.execute(searchQuery, [searchKey, author_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    console.log("searchResult:",searchResult);

    let searchObject = [];
    for (let i = 0; i < searchResult.rows.length; i++) {
      let bookItem = searchResult.rows[i];

      let book_id = bookItem.BOOK_ID;

      authorSelectQuery =
        "SELECT * FROM BOOKS_AUTHORS WHERE BOOK_ID = :book_id";
      let authorSelectResult = await connection.execute(
        authorSelectQuery,
        [book_id],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      console.log("authorSelectResult:",authorSelectResult);
      let authorNameArr = [];
      if (authorSelectResult.rows.length != 0) {
        for (let j = 0; j < authorSelectResult.rows.length; j++) {
          let authorId = authorSelectResult.rows[j].AUTHOR_ID;
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

      searchObject.push({
        BookID: book_id,
        Title: bookItem.BOOK_TITLE,
        Author: authorNameArr,
        Publisher: publisherName,
        AvailableCopies: bookItem.AVAILABLE_COPIES,
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
      SearchResult: searchObject,
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
  addAuthor,
  addPublisher,
  getGenre,
  getAuthors,
  search,
};
