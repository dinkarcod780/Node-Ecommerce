const mongoose = require("mongoose")
const subscribeSchema = mongoose.Schema({
    name:String,
    email:String,
    subscribes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
})

module.exports = mongoose.model("subscribes",subscribeSchema);