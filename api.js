/**
 * Packages
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const morgan = require("morgan");

/**
 * Configuration
 */
moment.locale('fr');

/**
 * Middlewares
 */
const CONTROLS = require(`./middlewares/controls.mw`);

/**
 * Db
 */
const DB = require('./config/db');
DB.mongooseConnection();

/**
 * Routers
 */
const ROUTER = require(`./routers/router`).router;

/**
* Init
*/
const app = express();

/**
 * Express setup
 */
app.use(cors());
app.use(morgan("tiny")); 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

/**
 * app Router
 */
app.use('/api/', CONTROLS.auth, ROUTER);

/**
 * Catch 404
 */
app.use(function (req, res) {
    res.status(404).json({success: false, message: "Route doesn't exist"});
  });


app.get("/hello", (req, res) => {
 res.json({message : "Hello"});
});

app.all("*", function(req, res) {
   res.json({message: "Page not found"});
 });

app.listen(3000, () => {
 console.log("Server has started");
});