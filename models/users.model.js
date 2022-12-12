const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        email: {
            type: String,
            default: null,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            default: null,
            trim: true,
        },
        token: {
            type: String,
            default: null,
            trim: true,
        },
        things: [
            {
                type: Schema.Types.ObjectId,
                ref: "Things",
                index: true,
                default: null,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Users", usersSchema);