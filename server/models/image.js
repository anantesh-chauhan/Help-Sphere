const mongoose = require('mongoose');

const imageSchema= mongoose.Schema({
    title:String,
    url:String,
    
})

const Image = new mongoose.model("Image",imageSchema);

module.exports = Image;