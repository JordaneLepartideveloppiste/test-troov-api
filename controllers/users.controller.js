
/** Models */
const Users = require('../models/users.model')

/** Packages */
const bcrypt = require('bcrypt')


/** Utils */
const { signUpErrors } = require('../utils/errors.utils');
const { isValid } = require('../utils/validate.utils');


module.exports = {
  create: async (req, res) => {
    try {
        const {email, password} = req.body
        /**
         * Validations
         */
        if (!email || !password) {
            return res.status(400)
            .json("Missing email and/or password parameter");
        }
        if (!isValid(email, "email")) {
          return res.status(400)
          .json("Email format invalid", "USERS");
        }
      
        if (!isValid(password, "password")) {
          return res
            .status(400)
            .json("Password format invalid", "USERS");
        }
      

        /**
         * Serialize
         */
        email = email.toLowerCase();
        const alreadyUser = await Users.findOne({email})

        if (alreadyUser) {
            return res
                  .status(409)
                  .json("This email still exist", "USERS");
        } else {
            const saltRounds = 10;
            const hash = bcrypt.hash(password, saltRounds)
            if (!hash) {
                res.status(500).json("Cannot crypt user")
            } else {
                const newUser = new Users({
                    email: email,
                    password: hash,
                  }).save()
                  if(!newUser) {
                    res.status(500).json("Cannot create user")
                  } else {
                    res.status(200).json(newUser)
                  }
            }
            
        }
    } catch (err) {
      const errors = signUpErrors(err);
      res.status(200).send({errors});
    }
  },
  me: async (req, res) => {
    try {
      const userId = req.user._id;
    const userToShow = await Users.findByOne({_id: userId}).populate("things")

      if (!userToShow) {
        return res.status(404).json("User not found", "USERS");
      } else {
        return res.status(200).json(userToShow);
      }
    } catch (err) {
      return res.status(500).json("err : " + err.message)
    }
    
  },

  
  
};
