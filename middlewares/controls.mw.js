// Utils & helper
const jwt = require("../utils/jwt.utils");

// Models
const Sessions = require("../models/sessions.model");
const Users = require("../models/users.model");

// Others
const crypto = require("crypto");
const PRIVATE_KEY = process.env.API_PRIVATE_KEY;
const PUBLIC_KEY = process.env.API_PUBLIC_KEY;
const moment = require("moment");


module.exports = {
    /* Check PARTNERS api keys */
    auth: function (req, res, next) {
        try {
            console.log(req.originalUrl)
            const publicKey = req.headers["x-public-key"];
        const dateTime = req.headers["x-datetime"];
        const signature = req.headers["x-signature"];

        const method = req.method.toUpperCase();
        const uri = req.originalUrl;

        // Verify if all header elements are presents
        if (!publicKey || !dateTime || !signature) {
            return res
                .status(400)
                .json({'success' : false, 'message' :"Missing AUTH header parameters"});
        }
        // Checking public key
        if (publicKey !== PUBLIC_KEY) {
            return res.status(401).json({'success' : false, 'message' :"AUTH Unknown API key"});
        }

        // Check the time between request and asking
        let timeDiff = moment.utc().diff(Number(dateTime), "minutes");

        if (timeDiff > 5) {
            return res
                .status(409)
                .json({'success' : false, 'message' :"AUTH Request expired ; check x-datetime format"});
        }

        // Create the signature
        const serverSign = method + uri + dateTime;
        const cryptoSign = crypto
            .createHmac("sha1", PRIVATE_KEY)
            .update(serverSign, "utf-8")
            .digest("hex");

        if (signature.toString() !== cryptoSign.toString()) {
            return res.status(401).json({'success' : false, 'message' :"Unauthorized"});
        }

        return next();

        } catch(err) {
            return res.status(500).json({'success' : false, 'message' : err.message})
        }
        

        
    },

    /* Session Check (Json Web Token) */
    session: async function (req, res, next) {
    try {
            // Getting auth header
        const token = req.headers["authorization"].split(" ")[1];

        const userId = jwt.getUserId(token);

        
        if (!token) {
            throw new Error("Authentication failed!");
        }

        if (!userId) {
            return res
                .status(400)
                .json("user id is missing or not valid");
        }
    
        const sessionToFind = await Sessions.findOne({user: userId, JWT: token})
        if(!sessionToFind) {
            return res
                .status(400)
                .json("can't find Session, Token seems expired");
        }
        const userOnSession = Users.findOne({_id: sessionToFind.user})
        if(!userOnSession) {
            return res
                .status(400)
                .json("can't find User with Session");
        } else {
            req.user = {};
            req.user.session = {};
            req.user = userOnSession;
            req.user.session = sessionToFind;
            return next();
        }
        
    } catch(err) {
        return res.status(500).json("err : " + err.message)
    }
        

       
    },
};