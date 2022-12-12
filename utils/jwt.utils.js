//Imports
const jwt = require('jsonwebtoken');

//Exported function
module.exports = {
    generateToken: function (user, expiration) {
        return jwt.sign(
            {
                userId: user.id,
            },
            process.env.JWT_TOKEN_SECRET,
            {
                expiresIn: expiration,
            }
        );
    },
    getUserId: function (token) {
        let userId = null;

        if (token != null) {
            try {
                let jwtToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

                if (jwtToken != null) {
                    userId = jwtToken.userId;
                    console.log(userId);

                }

            } catch (err) {
                console.log("token not good : " + err.message)

            }
        }
        return userId;
    }
}