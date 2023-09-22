const connection = require('./connection');

async function getAllLeaders(parameters = {}){

    let selectSql =   
    `SELECT leader.id, leader.leader, faction.alignment, faction.name
    FROM faction
    INNER JOIN leader ON faction.id = leader.faction_id`


        whereStatements = [],
        orderByStatements = [],
        queryParameters = [];

    if (typeof parameters.Leader !== 'undefined' && parameters.Leader.length > 0) {
        const Leader = parameters.Leader;
        whereStatements.push("leader.leader LIKE ?");
        queryParameters.push('%' + Leader + '%');
    }

    if (typeof parameters.alignment !== 'undefined' && parameters.alignment.length > 0) {
        const alignments = parameters.alignment;
        whereStatements.push("faction.alignment = ?");
        queryParameters.push(alignments);
    }

    if (typeof parameters.Factions !== 'undefined' && parameters.Factions.length > 0) {
        const factions = parameters.Factions;
        whereStatements.push("faction.name = ?");
        queryParameters.push(factions);
    }

    if (typeof parameters.sort !== 'undefined') {
        const sort = parameters.sort;
        if (sort === 'ASC') {
            orderByStatements.push('faction.name ASC');
        } else if (sort === 'DESC') {
            orderByStatements.push('faction.name DESC')
        }
    }

    //Dynamically add WHERE expressions to SELECT statements if needed
    if (whereStatements.length > 0) {
        selectSql = selectSql + ' WHERE ' + whereStatements.join(' AND ');
    }

    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (orderByStatements.length > 0) {
        selectSql = selectSql + ' ORDER BY ' + orderByStatements.join(', ');
    }

    //Dynamically add ORDER BY expressions to SELECT statements if needed
    if (typeof parameters.limit !== 'undefined' && parameters.limit > 0 &&  parameters.limit < 6) {
        selectSql = selectSql + ' LIMIT ' + parameters.limit;
    }


    return await connection.query(selectSql, queryParameters);
}

async function insert(parameters = {}) {
    let insertSql = `INSERT INTO leader(leader, role, sub_faction, faction_id) 
                        VALUES(?,?,?,?)`
   console.log(parameters);

    
        let insertParameters =[
        parameters.leader,
        parameters.sub_faction,
        parameters.role,
        parameters.faction_id
    ];
    
 
    console.log(insertParameters);
    return await connection.query(insertSql, insertParameters);
}




async function update(parameters = {}) {

    let updateSql = `UPDATE leader SET leader = ?, role = ?, sub_faction = ?, faction_id = ? WHERE id = ?`

    let updateParameters = [
        parameters.leader,
        parameters.role,
        parameters.sub_faction,
        parameters.faction_id,
        parameters.editId
    ]
    return await connection.query(updateSql, updateParameters);
}

async function Deleteform(id) {
    let deleteSql = 'DELETE FROM leader WHERE id = ?'

    let deleteParameters = [
        id
    ] 

    return await connection.query(deleteSql, deleteParameters);
}

async function getvalues(parameters) { 
    let insertSql = `SELECT * FROM leader WHERE id = ?`
    let queryParameters = [
        parseInt(parameters)
    ];

    return await connection.query(insertSql, queryParameters)
}




module.exports = {
    insert,
    update,
   Deleteform,
   getvalues,
   getAllLeaders

}

