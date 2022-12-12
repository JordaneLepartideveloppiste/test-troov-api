// Modules
const express = require('express');

// Middlewares
const controlSession = require('../middlewares/controls.mw').session;

// Controllers
const Sessions = require('../controllers/sessions.controller');
const Users = require('../controllers/users.controller');


// Router
exports.router = (function () {

    const Router = express.Router();

    //Sessions
  
    Router.route("/login").post(Sessions.login);
    Router.route("/logout").delete(controlSession, Sessions.logout);

    //Users
    Router.route("/hello").get(Users.sayHello);
    Router.route("/users").get(Users.all);
    Router.route("/user/signup").post(Users.create);
    Router.route("/user/things").post(controlSession, Users.me);

    return Router;

})();