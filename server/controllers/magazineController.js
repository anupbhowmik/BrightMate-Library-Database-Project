const oracledb = require("oracledb");

const server = require("../serverInformation");
const syRegister = require("../util/syRegister");
const dbuser = server.user;
const dbpassword = server.password;
const connectionString = server.connectionString;
let responseObj = {};


async function addMagazine(req, resp) {
    let connection;
    let syRegisterMagazines = 6;
  
    try {
      connection = await oracledb.getConnection({
        user: dbuser,
        password: dbpassword,
        connectString: connectionString,
      });
      console.log("DATABASE CONNECTED");
  
      let magazine_title = req.body.TITLE;
      let language = req.body.LANGUAGE;
      let publisher_id = req.body.PUBLISHER_ID;
      let genreArr = req.body.GENRE;
  
      //Get Next Magazine Id
      let magazine_id;
      await syRegister
        .getNextId(connection, syRegisterMagazines)
        .then(function (data) {
          magazine_id = parseInt(data);
        });
  
      console.log(magazine_id);
  
      let magazineInsertQuery =
        "INSERT INTO MAGAZINES (MAGAZINE_ID, MAGAZINE_TITLE, PUBLISHER_ID, LANGUAGE) " +
        "VALUES( :magazine_id, :magazine_title, :publisher_id, :language)";
      let magazineInsertResult = await connection.execute(magazineInsertQuery, [
        magazine_id,
        magazine_title,
        publisher_id,
        language,
      ]);
  
      console.log(magazineInsertResult);
  
      for (let i = 0; i < genreArr.length; i++) {
        genre_id = genreArr[i];
        let genreInsertQuery =
          "INSERT INTO MAGAZINES_GENRE (MAGAZINE_ID, GENRE_ID) VALUES(:magazine_id, :genre_id)";
        let genreInsertResult = await connection.execute(genreInsertQuery, [
          magazine_id,
          genre_id,
        ]);
  
        console.log(genreInsertResult);
      }
  
      connection.commit();
  
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        MagazineID: magazine_id,
        Title: magazine_title,
        Publisher_id: publisher_id,
        Language: language,
      };
    } catch (err) {
      console.log(err);
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "FAILURE",
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
        };
        resp.send(responseObj);
      }
    }
  }

  
async function getMagazines(req, resp) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({
        user: dbuser,
        password: dbpassword,
        connectString: connectionString,
      });
      console.log("DATABASE CONNECTED");
  
      magazineSelectQuery = "SELECT * FROM MAGAZINES";
      let magazineSelectResult = await connection.execute(
        magazineSelectQuery,
        [],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );
  
      console.log(magazineSelectResult);
  
      if (magazineSelectResult.rows.length === 0) {
        responseObj = {
          ResponseCode: 0,
          ResponseDesc: "NO DATA FOUND",
        };
      } else {
        let magazineObject = [];
        for (let i = 0; i < magazineSelectResult.rows.length; i++) {
          let magazineItem = magazineSelectResult.rows[i];
  
          let publisherId = magazineItem.PUBLISHER_ID;
          let publisherQuery =
            "SELECT PUBLISHER_NAME FROM PUBLISHER WHERE PUBLISHER_ID = :publisherId";
          let publisherName = await connection.execute(
            publisherQuery,
            [publisherId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          publisherName = publisherName.rows[0].PUBLISHER_NAME;
  
          magazineObject.push({
            MagazineID: magazineItem.MAGAZINE_ID,
            MagazineTitle: magazineItem.MAGAZINE_TITLE,
            Publisher: publisherName,
            Language: magazineItem.LANGUAGE,
          });
        }
        responseObj = {
          ResponseCode: 1,
          ResponseDesc: "SUCCESS",
          Magazines: magazineObject,
        };
      }
    } catch (err) {
      console.log(err);
      responseObj = {
        ResponseCode: 0,
        ResponseDesc: "FAILURE",
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
        };
        resp.send(responseObj);
      }
    }
  }

  

module.exports = {
    addMagazine,
    getMagazines
  };