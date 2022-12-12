const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            default: null,
            trim: true,
        },
        lastname: {
            type: String,
            default: null,
            trim: true,
        },
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
                ref: "Thing",
                index: true,
                default: null,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);