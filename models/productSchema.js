const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  description:String,
  price:String,
  category:String,
  productImag:String,
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},

cart:{
  type:Boolean,
  default:false
},

})

module.exports = mongoose.model("product",productSchema);