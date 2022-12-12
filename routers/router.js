// Modules
const express = require('express');

// Middlewares
const controls = require('../middlewares/controls.mw');

// Controllers
const Sessions = require('../controllers/sessions.controller');
const Users = require('../controllers/users.controller');


// Router
exports.router = (function () {

    const Router = express.Router();

    //Sessions
  
    Router.route("/login").post(Sessions.login);
    Router.route("/logout").delete(controls.session, Sessions.logout);

    //Users
    Router.route("user/signup").post(Users.create);
    Router.route("user/things").post(controls.session, Users.me);

})