const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const thingSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            default: null,
        },
        name: {
            type: String,
            default: null,
            trim: true,
        },
        material: {
            type: String,
            default: null,
            trim: true,
        },
        color: {
            type: String,
            default: null,
            trim: true,
        },
        brand: {
            type: String,
            default: null,
            trim: true,
            unique: true,
        },
        size: {
            type: String,
            default: null,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Thing", thingSchema);