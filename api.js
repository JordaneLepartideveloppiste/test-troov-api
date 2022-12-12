/**
 * Packages
 */
require('dotenv').config();
const express = require('express');


/**
* Init
*/
const app = express();

/**
 * Db
 */
const DB = require('./config/db');
DB.mongooseConnection();

/**
 * Routers
 */
const ROUTER = require(`./routers/router`).router;


app.get("/hello", (req, res) => {
 res.json({message : "Hello"});
});

app.all("*", function(req, res) {
   res.json({message: "Page not found"});
 });

app.listen(3000, () => {
 console.log("Server has started");
});