const oracledb = require('oracledb');
let nextValue;

async function getNextId(connection, registerId) {
    try{
        let nextValueQuery = 'SELECT sy_register_nextval FROM system_register WHERE sy_register_id = :registerId';
        nextValue = await connection.execute(nextValueQuery, [registerId], {outFormat: oracledb.OUT_FORMAT_OBJECT});
        nextValue = nextValue.rows[0].SY_REGISTER_NEXTVAL;

        let newValue = nextValue + 1;
        let updateValueQuery = 'UPDATE system_register SET sy_register_nextval = :newValue WHERE sy_register_id = :registerId';
        let updateValue = await connection.execute(updateValueQuery, [newValue, registerId]);
        
    } catch(err) {
        console.log(err);

    } finally {
        return nextValue;
    }
}

module.exports = {
    getNextId
}
