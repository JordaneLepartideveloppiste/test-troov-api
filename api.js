/**
 * Packages
 */
require('dotenv').config();
const express = require('express');


/**
* Init
*/
const app = express();


app.get("/", (req, res) => {
 res.json({message : "Hi"});
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