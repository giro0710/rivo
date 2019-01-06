"use strict"

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "company.cij9fbknsyci.ap-southeast-1.rds.amazonaws.com",
  user: "company",
  password: "Company10",
  database: "bot_db",
  multipleStatements: true
});
 
con.connect(function (err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

module.exports.connection = con;