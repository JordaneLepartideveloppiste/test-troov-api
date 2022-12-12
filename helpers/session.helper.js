/**
 * Helper : Sessions
 */

/** Models */
const Sessions = require('../models/sessions.model')


/** Helpers & Utils */
const jwt = require('../utils/jwt.utils')

module.exports = {
    set: async function (user, expirationDays = 2) {
        try {
            const ExpirationDate = new Date(new Date().getTime() + (86400000 * expirationDays))
            const JWT = jwt.generateToken(user, expirationDays + "d")
            const newSession = new Sessions({
                user: user._id,
                JWT: JWT,
                expireAt: ExpirationDate
            }).save()
            if(!newSession) {
                return false
            } else {
                return newSession;
            }
        } catch (err) {
            return err.message
        }
    },
}
