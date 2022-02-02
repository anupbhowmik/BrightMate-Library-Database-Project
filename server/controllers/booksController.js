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
    }
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
        }
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
      }
      resp.send(responseObj);
    }
  }
}

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

    let bookInsertQuery;
    
    let title = req.body.TITLE;
    let yearOfPublication = new Date(req.body.YEAR);
    let book_description = null;
    if (typeof req.body.DESCRIPTION !== "undefined") {
      book_description = req.body.DESCRIPTION;
    }
    let language = req.body.LANGUAGE;
    let author_id = req.body.AUTHOR_ID;
    let publisher_id = req.body.PUBLISHER_ID;

    //Get Next Book Id
    let book_id;
    await syRegister
      .getNextId(connection, syRegisterBooks)
      .then(function (data) {
        book_id = parseInt(data);
      });

    console.log(book_id);

    bookInsertQuery =
      "INSERT INTO BOOKS (BOOK_ID, BOOK_TITLE, YEAR_OF_PUBLICATION, DESCRIPTION, LANGUAGE, AUTHOR_ID, PUBLISHER_ID) "+
       "VALUES( :book_id, :title, :yearOfPublication, :book_description, :language, :author_id, :publisher_id)";
    let bookInsertResult = await connection.execute(bookInsertQuery, [
      book_id,
      title,
      yearOfPublication,
      book_description,
      language,
      author_id,
      publisher_id,
    ]);

    console.log(bookInsertResult);

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      BookID: book_id,
      Title: title,
      AuthorId: author_id,
      Publisher_id: publisher_id,
      YearOfPublication: yearOfPublication,
      Description: book_description,
      Language: language
    };
  } catch (err) {
    console.log(err);
    responseObj = {
      ResponseCode: 0,
      ResponseDesc: "FAILURE",
    }
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
        }
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
      }
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
    let address = req.body.ADDRESS;

    //Get Next Publisher Id
    let publisher_id;
    await syRegister
      .getNextId(connection, syRegisterPublishers)
      .then(function (data) {
        publisher_id = parseInt(data);
      });

    console.log(publisher_id);

    publisherInsertQuery =
      "INSERT INTO PUBLISHER (PUBLISHER_ID, PUBLISHER_NAME, PHONE, ADDRESS) VALUES( :publisher_id, :publisher_name, :phone, :address)";
    let publisherInsertResult = await connection.execute(publisherInsertQuery, [
      publisher_id,
      publisher_name,
      phone,
      address
    ]);

    console.log(publisherInsertResult);

    connection.commit();

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      PublisherName: publisher_name,
      PublisherId: publisher_id,
      Phone: phone,
      Address: address
    };
  } catch (err) {
    console.log(err);
    responseObj = {
      ResponseCode: 0,
      ResponseDesc: "FAILURE",
    }
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
        }
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
      }
      resp.send(responseObj);
    }
  }
}

module.exports = {
  addAuthor, addBook, addPublisher
};
