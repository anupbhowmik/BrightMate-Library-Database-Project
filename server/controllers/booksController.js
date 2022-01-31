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

module.exports = {
  addAuthor,
};
