const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")
const userSchema = mongoose.Schema({
    name:String,
    username:String,
    email:String,
    address:String,
    pincode:String,
    password:String,
    number:String,
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        }
    ],
    // isSeller:false,
});
userSchema.plugin(plm);
module.exports = mongoose.model("user",userSchema);

