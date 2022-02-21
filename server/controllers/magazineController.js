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
        ResponseStatus: resp.statusCode,
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

async function editMagazine(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let magazine_id = req.body.MAGAZINE_ID;
    let magazine_title = req.body.TITLE;
    let language = req.body.LANGUAGE;
    let publisher_id = req.body.PUBLISHER_ID;
    let genreArr = req.body.GENRE;


      let magazineEditQuery =
        "UPDATE MAGAZINES SET MAGAZINE_TITLE = :magazine_title, PUBLISHER_ID = :publisher_id, LANGUAGE = :language WHERE MAGAZINE_ID = :magazine_id";
      let magazineEditResult = await connection.execute(magazineEditQuery, [
        magazine_title,
        publisher_id,
        language,
        magazine_id,
      ]);

      console.log(magazineEditResult);

      let genreDeleteQuery =
        "DELETE FROM MAGAZINES_GENRE WHERE MAGAZINE_ID = :magazine_id";
      let genreDeleteResult = await connection.execute(genreDeleteQuery, [
        magazine_id,
      ]);

      console.log(genreDeleteResult);
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
        ResponseStatus: resp.statusCode,
        MagazineID: magazine_id,
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
        ResponseStatus: resp.statusCode,
      };
    } else {
      let magazineObject = [];
      for (let i = 0; i < magazineSelectResult.rows.length; i++) {
        let magazineItem = magazineSelectResult.rows[i];
        let magazine_id = magazineItem.MAGAZINE_ID;

        let publisherId = magazineItem.PUBLISHER_ID;
        let publisherQuery =
          "SELECT PUBLISHER_NAME FROM PUBLISHER WHERE PUBLISHER_ID = :publisherId";
        let publisherName = await connection.execute(
          publisherQuery,
          [publisherId],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        publisherName = publisherName.rows[0].PUBLISHER_NAME;

        
      genreSelectQuery = "SELECT * FROM MAGAZINES_GENRE WHERE MAGAZINE_ID = :magazine_id";
      let genreSelectResult = await connection.execute(
        genreSelectQuery,
        [magazine_id],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      console.log(genreSelectResult);
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

        magazineObject.push({
          MagazineID: magazine_id,
          MagazineTitle: magazineItem.MAGAZINE_TITLE,
          Publisher: publisherName,
          Language: magazineItem.LANGUAGE,
          Genre: genreObject
        });
      }
      responseObj = {
        ResponseCode: 1,
        ResponseDesc: "SUCCESS",
        ResponseStatus: resp.statusCode,
        Magazines: magazineObject,
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

async function getMagazineInfo(req, resp) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbuser,
      password: dbpassword,
      connectString: connectionString,
    });
    console.log("DATABASE CONNECTED");

    let magazine_id = req.body.MAGAZINE_ID;

    magazineSelectQuery =
      "SELECT * FROM MAGAZINES WHERE MAGAZINE_ID = :magazine_id";
    let magazineSelectResult = await connection.execute(
      magazineSelectQuery,
      [magazine_id],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    console.log(magazineSelectResult);

    let magazineItem = magazineSelectResult.rows[0];

    let publisherId = magazineItem.PUBLISHER_ID;
    let publisherQuery =
      "SELECT PUBLISHER_NAME FROM PUBLISHER WHERE PUBLISHER_ID = :publisherId";
    let publisherName = await connection.execute(
      publisherQuery,
      [publisherId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    publisherName = publisherName.rows[0].PUBLISHER_NAME;

    
    genreSelectQuery = "SELECT * FROM MAGAZINES_GENRE WHERE MAGAZINE_ID = :magazine_id";
    let genreSelectResult = await connection.execute(
      genreSelectQuery,
      [magazine_id],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    console.log(genreSelectResult);
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

    responseObj = {
      ResponseCode: 1,
      ResponseDesc: "SUCCESS",
      ResponseStatus: resp.statusCode,
      MagazineID: magazineItem.MAGAZINE_ID,
      MagazineTitle: magazineItem.MAGAZINE_TITLE,
      Publisher: publisherName,
      PublisherId: publisherId,
      Language: magazineItem.LANGUAGE,
      Genre: genreObject
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
  addMagazine,
  editMagazine,
  getMagazines,
  getMagazineInfo,
};
