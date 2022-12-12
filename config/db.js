const mongoose = require('mongoose');
const DB = process.env.DB_URL;


module.exports = {
    mongooseConnection: function () {
        // API Connection
        mongoose.set('strictQuery', true);
        mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        let db = mongoose.connection;
        
        //Database global connection
        db.on('error', console.error.bind(console, 'Error during DB connection'));
        db.once('open', function () {
            console.log("...DB is connected...");
        });
    },
}