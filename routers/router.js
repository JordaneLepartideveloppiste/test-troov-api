// Modules
const express = require('express');

// Middlewares
const controlSession = require('../middlewares/controls.mw').session;

// Controllers
const Sessions = require('../controllers/sessions.controller');
const Users = require('../controllers/users.controller');
const Things = require('../controllers/things.controller');


// Router
exports.router = (function () {

    const Router = express.Router();

    //Sessions
  
    Router.route("/session").post(Sessions.login);
    Router.route("/session").delete(controlSession, Sessions.logout);

    //Users
 
    Router.route("/users").get(Users.all);
    Router.route("/user/signup").post(Users.create);
    Router.route("/user").get(controlSession, Users.me);
    Router.route("/user/thing/new").post(controlSession, Things.create);
    Router.route("/user/thing/:thingId/update").put(controlSession, Things.update);
    Router.route("/user/thing/:thingId/delete").delete(controlSession, Things.delete);
    Router.route("/user/thing/:slug").get(controlSession, Things.oneThing);

    return Router;

})();