const connection = require('./connection');


async function getfaction(parameters = {}) { 
    let insertSql = 'SELECT * FROM faction'
    console.log(parameters);
    let queryParameters = [
        parseInt(parameters.editId)
    ];

    return await connection.query(insertSql, queryParameters)
} 

async function getvalues(parameters) { 
    let insertSql = `SELECT * FROM leader WHERE id = ?`
    let queryParameters = [
        parseInt(parameters)
    ];

    return await connection.query(insertSql, queryParameters)
}



module.exports = {
    getfaction,
    getvalues,
}
