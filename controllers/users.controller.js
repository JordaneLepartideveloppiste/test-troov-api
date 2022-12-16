
/** Models */
const Users = require('../models/users.model')

/** Packages */
const bcrypt = require('bcrypt')



module.exports = {
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
        let {name, email, password} = req.body
        /**
         * Validations
         */
        if (!email || !password) {
            return res.status(401)
            .json({"success" : false, "message" : "Missing email and/or password parameter"});
        }
        if (!email.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)) {
          return res.status(403)
          .json({"success" : false, "message" : "Email format invalid"});
        }
      
        if (password.length < 8) {
          return res
            .status(406)
            .json({"success" : false, "message" : "Password too short"});
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
                return res.status(500).json({"success" : false, "message" : err.message})
            } else {
                const newUser = new Users({
                    name,
                    email,
                    password: hash,
                  }).save()
                  if(!newUser) {
                    return res.status(500).json({"success" : false, "message" : "Cannot create user"})
                  } else {
                    return res.status(200).json(newUser)
                  }
            }
            })        
        }
    } catch (err) {
      return res.status(500).json({"success" : false, "message" : err.message});
      
    }
  },
  me: async (req, res) => {
    try {
     
      const userId = req.user.session.user.toString();
  
    const userToShow = await Users.findOne({_id: userId}).populate('things')

      if (!userToShow) {
        return res.status(404).json({"success" : false, "message" : "User not found"});
      } else {
        return res.status(200).json(userToShow);
      }
    } catch (err) {
      return res.status(500).json({"success" : false, "message" : err.message})
    }
    
  },

  
  
};
