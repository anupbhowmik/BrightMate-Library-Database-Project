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

    let author_name = req.body.AUTHOR_NAME;
    let dateOfBirth = req.body.DATE_OF_BIRTH;
    if (dateOfBirth != "") {
      dateOfBirth = new Date(dateOfBirth);
    }
    let dateOfDeath = req.body.DATE_OF_DEATH;
    if (dateOfDeath != "") {
      dateOfDeath = new Date(dateOfDeath);
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

    let authorInsertQuery =
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

async function editAuthor(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let author_id = req.body.AUTHOR_ID;
    let author_name = req.body.AUTHOR_NAME;
    let dateOfBirth = req.body.DATE_OF_BIRTH;
    if (dateOfBirth != "") {
      dateOfBirth = new Date(dateOfBirth);
    }
    let dateOfDeath = req.body.DATE_OF_DEATH;
    if (dateOfDeath != "") {
      dateOfDeath = new Date(dateOfDeath);
    }
    let bio = req.body.BIO;

    let authorEditQuery =
      "UPDATE AUTHOR SET AUTHOR_NAME = :author_name, DATE_OF_BIRTH = :dateOfBirth, DATE_OF_DEATH = :dateOfDeath, BIO = :bio WHERE AUTHOR_ID = :author_id";
    let authorEditResult = await connection.execute(authorEditQuery, [
      author_name,
      dateOfBirth,
      dateOfDeath,
      bio,
      author_id,
    ]);

    console.log(authorEditResult);

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      AuthorId: author_id,
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

    let publisherInsertQuery =
      "INSERT INTO PUBLISHER (PUBLISHER_ID, PUBLISHER_NAME, PHONE, ADDRESS_LINE, CITY, POSTAL_CODE, COUNTRY) VALUES( :publisher_id, :publisher_name, :phone, :addressLine, :city, :postalCode, :country)";
    let publisherInsertResult = await connection.execute(publisherInsertQuery, [
      publisher_id,
      publisher_name,
      phone,
      addressLine,
      city,
      postalCode,
      country,
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
      AddressLine: addressLine,
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

async function editPublisher(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let publisher_id = req.body.PUBLISHER_ID;
    let publisher_name = req.body.PUBLISHER_NAME;
    let phone = req.body.PHONE;
    let addressLine = req.body.ADDRESS_LINE;
    let city = req.body.CITY;
    let postalCode = req.body.POSTAL_CODE;
    let country = req.body.COUNTRY;

    let publisherEditQuery =
      "UPDATE PUBLISHER SET PUBLISHER_NAME = :publisher_name, PHONE = :phone, ADDRESS_LINE = :addressLine, CITY = :city, POSTAL_CODE = :postalCode, COUNTRY = :country WHERE PUBLISHER_ID = :publisher_id";
    let publisherEditResult = await connection.execute(publisherEditQuery, [
      publisher_name,
      phone,
      addressLine,
      city,
      postalCode,
      country,
      publisher_id,
    ]);

    console.log(publisherEditResult);

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      PublisherId: publisher_id,
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

async function getPublishers(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    publisherSelectQuery =
      "SELECT * FROM PUBLISHER ORDER BY PUBLISHER_NAME ASC";
    let publisherSelectResult = await connection.execute(
      publisherSelectQuery,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    if (publisherSelectResult.rows.length === 0) {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA FOUND IN DATABASE",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let publisherObject = [];
      for (let i = 0; i < publisherSelectResult.rows.length; i++) {
        let publisherItem = publisherSelectResult.rows[i];

        publisherObject.push({
          PublisherID: publisherItem.PUBLISHER_ID,
          PublisherName: publisherItem.PUBLISHER_NAME,
          Phone: publisherItem.PHONE,
          AddressLine: publisherItem.ADDRESS_LINE,
          City: publisherItem.CITY,
          PostalCode: publisherItem.POSTAL_CODE,
          Country: publisherItem.COUNTRY,
        });
      }
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        PublisherList: publisherObject,
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
    let authorQuery = "";
    let authorFromQuery = "";
    if (is_author_filter == 1) {
      author_id = authorKey.AUTHOR_ID;
      authorFromQuery = " , BOOKS_AUTHORS ba ";
      authorQuery =
        " AND ba.AUTHOR_ID = " + author_id + " AND b.BOOK_ID = ba.BOOK_ID";
    }

    let genreKey = req.body.GENRE_OBJECT;
    let is_genre_filter = genreKey.IS_GENRE_FILTER;
    let genre_id;
    let genreQuery = "";
    let genreFromQuery = "";
    if (is_genre_filter == 1) {
      genre_id = genreKey.GENRE_ID;
      genreFromQuery = " , BOOKS_GENRE bg ";
      genreQuery =
        " AND bg.GENRE_ID = " + genre_id + " AND b.BOOK_ID = bg.BOOK_ID ";
    }

    let yearKey = req.body.YEAR_OBJECT;
    let is_year_filter = yearKey.IS_YEAR_FILTER;
    let year;
    let yearQuery = "";
    if (is_year_filter == 1) {
      year = yearKey.YEAR;
      yearQuery = " AND b.YEAR_OF_PUBLICATION = " + year;
    }

    let searchQuery =
      "SELECT b.BOOK_ID, b.BOOK_TITLE, b.DESCRIPTION, b.LANGUAGE, b.PUBLISHER_ID, b.ISBN, b.AVAILABLE_COPIES, b.YEAR_OF_PUBLICATION " +
      " FROM BOOKS b " +
      authorFromQuery +
      genreFromQuery +
      " WHERE UPPER(b.BOOK_TITLE) LIKE UPPER(:searchKey) AND b.AVAILABLE_COPIES > 0 " +
      authorQuery +
      genreQuery +
      yearQuery +
      " ORDER BY b.YEAR_OF_PUBLICATION DESC";
    console.log(searchQuery);
    let searchResult = await connection.execute(searchQuery, [searchKey], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    console.log("searchResult:", searchResult);

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

      let authorObject = [];
      if (authorSelectResult.rows.length != 0) {
        for (let j = 0; j < authorSelectResult.rows.length; j++) {
          let authorId = authorSelectResult.rows[j].AUTHOR_ID;
          let authorQuery =
            "SELECT AUTHOR_NAME FROM AUTHOR WHERE AUTHOR_ID = :authorId";
          authorNameResult = await connection.execute(authorQuery, [authorId], {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          });
          authorObject.push({
            AuthorId: authorId,
            AuthorName: authorNameResult.rows[0].AUTHOR_NAME,
          });
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

      genreSelectQuery = "SELECT * FROM BOOKS_GENRE WHERE BOOK_ID = :book_id";
      let genreSelectResult = await connection.execute(
        genreSelectQuery,
        [book_id],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      let genreObject = [];
      if (genreSelectResult.rows.length != 0) {
        for (let j = 0; j < genreSelectResult.rows.length; j++) {
          let genreId = genreSelectResult.rows[j].GENRE_ID;
          let genreQuery =
            "SELECT GENRE_NAME FROM GENRE WHERE GENRE_ID = :genreId";
          genreNameResult = await connection.execute(genreQuery, [genreId], {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
          });
          let genreName = genreNameResult.rows[0].GENRE_NAME;
          genreObject.push({
            GenreId: genreId,
            GenreName: genreName,
          });
        }
      }

      copySelectQuery =
        "SELECT COUNT(BOOK_COPY_ID) AS CNT, BOOK_ID, EDITION FROM BOOK_COPY WHERE STATUS = 1 GROUP BY BOOK_ID, EDITION HAVING BOOK_ID = :book_id";
      let copySelectResult = await connection.execute(
        copySelectQuery,
        [book_id],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      let copyObject = [];
      if (copySelectResult.rows.length != 0) {
        for (let k = 0; k < copySelectResult.rows.length; k++) {
          let copyCount = copySelectResult.rows[k].CNT;
          let edition = copySelectResult.rows[k].EDITION;
          copyObject.push({
            CopyCount: copyCount,
            Edition: edition,
          });
        }
      }

      searchObject.push({
        BookID: book_id,
        Title: bookItem.BOOK_TITLE,
        Publisher: publisherName,
        AuthorObject: authorObject,
        CopyObject: copyObject,
        GenreObject: genreObject,
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

async function getAuthorById(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let authorId = req.body.AUTHOR_ID;

    authorSelectQuery =
      "SELECT * FROM AUTHOR WHERE AUTHOR_ID = :authorId ORDER BY AUTHOR_NAME ASC";
    let authorSelectResult = await connection.execute(
      authorSelectQuery,
      [authorId],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    if (authorSelectResult.rows.length === 0) {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA FOUND IN DATABASE",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let authorItem = authorSelectResult.rows[0];

      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        AuthorID: authorItem.AUTHOR_ID,
        AuthorName: authorItem.AUTHOR_NAME,
        DateOfBirth: authorItem.DATE_OF_BIRTH,
        DateOfDeath: authorItem.DATE_OF_DEATH,
        Bio: authorItem.BIO,
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
        resp.send(responseObj);
      }
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NOT FOUND",
        ResponseStatus: resp.statusCode,
      };
      resp.send(responseObj);
    }
  }
}

async function getPublisherById(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let publisherId = req.body.PUBLISHER_ID;

    publisherSelectQuery =
      "SELECT * FROM PUBLISHER WHERE PUBLISHER_ID = :publisherId ORDER BY PUBLISHER_NAME ASC";
    let publisherSelectResult = await connection.execute(
      publisherSelectQuery,
      [publisherId],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    if (publisherSelectResult.rows.length === 0) {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NO DATA FOUND IN DATABASE",
        ResponseStatus: resp.statusCode,
      };
    } else {
      let publisherItem = publisherSelectResult.rows[0];

      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        PublisherID: publisherItem.PUBLISHER_ID,
        PublisherName: publisherItem.PUBLISHER_NAME,
        Phone: publisherItem.PHONE,
        AddressLine: publisherItem.ADDRESS_LINE,
        City: publisherItem.CITY,
        PostalCode: publisherItem.POSTAL_CODE,
        Country: publisherItem.COUNTRY,
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
        resp.send(responseObj);
      }
    } else {
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "NOT FOUND",
        ResponseStatus: resp.statusCode,
      };
      resp.send(responseObj);
    }
  }
}

async function searchByAuthor(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    searchString = req.body.SEARCH_KEY;
    searchString = "%" + searchString + "%";

    authorSelectQuery = "SELECT * FROM AUTHOR WHERE UPPER(AUTHOR_NAME) LIKE UPPER(:searchString)";
    let authorSelectResult = await connection.execute(authorSelectQuery, [searchString], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

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
  editAuthor,
  addPublisher,
  editPublisher,
  getGenre,
  getAuthors,
  getPublishers,
  getAuthorById,
  getPublisherById,
  search,
  searchByAuthor
};
