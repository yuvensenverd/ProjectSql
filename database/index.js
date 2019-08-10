var mysql = require('mysql')
var db = mysql.createConnection({
    host : 'localhost',
    user : 'enverd',
    password : '123123123',
    database : 'projectjc',
    port : 3306
})

db.connect(function(err) {
    if (err) throw err;

    console.log("Connected!");
  });

module.exports = db