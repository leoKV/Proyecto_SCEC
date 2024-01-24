const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'linux123',
    database:'db_expediente',
    port: 3306
})

function getConnection(){
    return connection;
}

module.exports = {getConnection}