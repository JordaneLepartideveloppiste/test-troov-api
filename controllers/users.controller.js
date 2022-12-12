
/** Models */
const Users = require('../models/users.model')

/** Packages */
const bcrypt = require('bcrypt')


/** Utils */
const { signUpErrors } = require('../utils/errors.utils');
const { isValid } = require('../utils/validate.utils');


module.exports = {
  sayHello: (req, res) => {
    console.log('hello')
  },
  all: async (req, res) => {
    try{
      const allUsers = await Users.find();
      if(!allUsers) {
        res.status(400).send({"success" : false, "message" : "Can't get all users"});
      }
      res.status(200).json(allUsers)
    } catch (err) {
      res.status(400).send({"success" : false, "message" : err.message});
    }
  },
  create: async (req, res) => {
    try {
        let {email, password} = req.body
        /**
         * Validations
         */
        if (!email || !password) {
            return res.status(400)
            .json({"success" : false, "message" : "Missing email and/or password parameter"});
        }
        if (!isValid(email, "email")) {
          return res.status(400)
          .json({"success" : false, "message" : "Email format invalid"});
        }
      
        if (!isValid(password, "password")) {
          return res
            .status(400)
            .json({"success" : false, "message" : "Password format invalid"});
        }
      

        /**
         * Serialize
         */
        email = email.toLowerCase();
        const alreadyUser = await Users.findOne({email})

        if (alreadyUser) {
            return res
                  .status(409)
                  .json({"success" : false, "message" : "This email still exist"});
        } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function(err, hash) {
              console.log(hash)
              if (err) {
                res.status(500).json({"success" : false, "message" : err.message})
            } else {
                const newUser = new Users({
                    email: email,
                    password: hash,
                  }).save()
                  if(!newUser) {
                    res.status(500).json({"success" : false, "message" : "Cannot create user"})
                  } else {
                    res.status(200).json(newUser)
                  }
            }
            })        
        }
    } catch (err) {
      let errors = signUpErrors(err);
      if (errors.email || errors.password) {
        res.status(500).json({errors});
      }
      res.status(500).json({"success" : false, "message" : err.message});
      
    }
  },
  me: async (req, res) => {
    try {
      const userId = req.user._id;
    const userToShow = await Users.findByOne({_id: userId}).populate("things")

      if (!userToShow) {
        return res.status(404).json({"success" : false, "message" : "User not found"});
      } else {
        return res.status(200).json({"success" : true, userToShow});
      }
    } catch (err) {
      return res.status(500).json({"success" : false, "message" : err.message})
    }
    
  },

  
  
};
