const mongoose = require('mongoose');
//Create Schema
const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    ,
    price: {
        type: String,
        required: true,
        trim: true
    }
});
//Create and instantiate model with schema
const Items = mongoose.model("Items", ItemSchema);
module.exports = Items;