//Modules
const bcrypt = require('bcrypt');

//Models
const Sessions = require('../models/sessions.model');
const Users = require('../models/users.model');

//Utils & helpers
const setSession = require('../helpers/session.helper');
const { signInErrors } = require('../utils/errors.utils');


module.exports = {

    login: async (req, res) => {
        try {
            let {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json("email or password missing");
            }

            const userToFind = await Users.findOne({email})

            if (!userToFind) {
                return res.status(400).json("email is invalid");
            } else {
                const match = await bcrypt.compare(password, userToFind.password)
                if (!match) {
                    return res.status(400).json("Password is incorrect");
                } else {
                    const sessionCreated = await setSession.set(userToFind, 1)
                        if (sessionCreated) {
                            return res.status(200).json({token: sessionCreated.JWT});
                        } else {
                            return res.status(500).json(global.ERROR("Cannot set the session"));
                        }
                    
                }

            }

        } catch(err) {
            const errors = signInErrors(err);
            if (errors.email || errors.password) {
                res.status(500).json({errors});
              }
              res.status(500).json({"success" : false, "message" : err.message});
        }
       
        

    },
    logout: async (req, res) => {
        try {
            const id = req.user.session._id;

        if (!id) {
            return res.status(400).json("id is missing or not valid");
        }

        const sessionToDelete = await Sessions.deleteOne({_id: id})
            if (!sessionToDelete) {
                return res.status(500).json("Cannot logout user"); 
            } else {
                return res.status(200).json("Session deleted with success");
            }
        } catch (err) {
            return res.status(500).json("err : " + err.message);
        }

        
            
            
        

    },
};
