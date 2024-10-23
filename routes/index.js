var express = require('express');
var router = express.Router();

const userModel = require("../models/userSchema");
const productModel = require("../models/productSchema");
const subscribesModel = require("../models/subscribeSchema");

const passport = require("passport")
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(userModel.authenticate()));

const upload = require("../utils/multer").single("view")

const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});


/* GET home page. */
router.get('/', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);
  res.render('index', { allcart:user.cart });
});

router.get("/register", (req, res, next) => {
  res.render("register")
})

router.post("/register", async (req, res, next) => {
  //  const newData = user_model.create({
  //   username:req.body.username,
  //   email:req.body.email,  
  //   password:req.body.password,
  //  })
  //  res.send("created");

  try {
    const { name, username, email, number, address, pincode, password } = req.body
    await userModel.register({ name, username, email, number, address, pincode }, password);
    res.redirect("/login")
    // res.send("Register")
  } catch (error) {
    res.send(error.message)
  }
})

router.get("/login", (req, res, next) => {
  res.render("login")
})


router.post("/login", passport.authenticate("local", {
  successRedirect: "/allproducts",
  failureRedirect: "/login",
}))


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

router.get("/profile", isLoggedIn, async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  // console.log(user.cart);
  res.render("profile", { user: req.user,allcart:user.cart })
})


router.get("/logout", (req, res, next) => {
  req.logOut(function (error) {
    if (error) { return next(error) }
  })
  res.redirect("/login")
})

router.get("/userforgetpassword", (req, res, next) => {
  res.render("userforgetpassword")
})


router.get("/resetpassword", (req, res, next) => {
  res.render("resetpassword")
})

router.post("/resetpassword", isLoggedIn, async (req, res, next) => {
  const password = req.body.password
  const user = await userModel.findOne({ _id: req.user._id })
  await user.setPassword(password)
  await user.save()

  res.redirect("/login")
});


router.get("/editprofile/:userId", isLoggedIn, async (req, res) => {
  const userId = req.params.userId
  const currentUser = await userModel.findById(userId)
  res.render("editprofile", { currentUser })
});

router.post("/editprofile/:userId", isLoggedIn, async (req, res, next) => {
  const userId = req.params.userId
  const currentUser = await userModel.findOne({ _id: userId })
  currentUser.name = req.body.name,
    currentUser.username = req.body.username,
    currentUser.email = req.body.email,
    currentUser.address = req.body.address,
    currentUser.pincode = req.body.pincode

  await currentUser.save()
  res.redirect("/profile");
});

router.get('/delete/:Id', isLoggedIn, async (req, res, next) => {
  const Id = req.params.Id

  await userModel.findOneAndDelete({
    _id: Id
  })

  res.redirect('/login')

})

router.get("/belts",isLoggedIn,async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);
  res.render("belts",{allcart:user.cart})
})



router.post("/create/orderId", (req, res, next) => {
  var options = {
    amount: 499 * 100,
    currency: "INR",
    receipt: "order_recipt_11"
  };

  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err)
      return res.status(500).send("something wrong")
    }
    console.log(order);
    res.send(order)
  });

});

router.get("/ladiesbelt",isLoggedIn,async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);

  res.render("ladiesbelt",{allcart:user.cart})
})

router.get("/ladieschild", isLoggedIn,async(req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);
  res.render("ladieschild",{allcart:user.cart})
})

router.get("/shoes",isLoggedIn, async  (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);

  res.render("shoes",{allcart:user.cart})
})

router.get("/wallets",isLoggedIn,async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);
  res.render("wallets",{allcart:user.cart})
})

router.get("/termscondition",isLoggedIn, async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);
  res.render("termscondition",{allcart:user.cart})
})

router.get("/contact", isLoggedIn, async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);
  res.render("contact" ,{allcart:user.cart})
})

router.post("/subscribe",async(req,res,next)=>{
 const subs = await subscribesModel.create({
  name:req.body.name,
  email:req.body.email
 })
 res.redirect("/")
})


router.get("/addcart", isLoggedIn, async(req,res,next)=>{
  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);
  
  
  res.render("addcart",{allcart:user.cart })
})

router.get("/deletecart/:id",isLoggedIn,async (req,res,next)=>{

// console.log(req.user.cart);
try {
  // Filter out the product ID from req.user.cart
  const updatedCart = req.user.cart.filter((elm) => elm === req.params.id);

  // Update req.user.cart with the filtered data
  req.user.cart = updatedCart;

  // Save the updated req.user object
  await req.user.save();


  
  // Continue with any other necessary logic

  // ...

  res.redirect("/allproducts")
} catch (error) {
  console.error("Error removing product from cart:", error);
  res.status(500).send("Internal server error");
}
  // const id = req.params.id
  //   await productModel.findByIdAndDelete({_id:id})
  //   res.redirect("/addcart")
})

// router.get("/addcart/:id", isLoggedIn,async (req, res, next) => {
//   console.log(req.params.id);



//   const user = await userModel.findOne({username:req.user.username})

//   user.cart.push(req.params.id)
//   await user.save()

//   // const allcart = await productModel.find()
//   // console.log(allcart)
//   // res.render("addcart", { allcart })
// })






router.get("/cartcollection",(req,res,next)=>{
  res.render("cartcollection")
})

router.get("/addcart/:id",isLoggedIn,async (req,res,next)=>{
//   console.log(req.params.id,"inside");
  
//  const product =  await productModel.findOne({_id:req.params.id})
//  product.cart = true
//  await product.save()
//  console.log(product);
await req.user.cart.push(req.params.id)
await req.user.save()
console.log(req.user);


 res.redirect("/addcart")
 
})



router.get("/dinkar/78/admin/addproduct",(req,res,next)=>{
  res.render("createproducts")
})

router.post("/addproduct", upload,async (req, res)=>{
  // console.log(req.body);
  try {
    const productImag = req.file.filename
    const{name ,description,price,category} = req.body
    productModel.create({name ,description,price,category,productImag});
    res.redirect("/allproducts")
  } catch (error) {
    res.send(error)
  }
  
})

router.get("/allproducts", isLoggedIn,async (req,res,next)=>{
  const products = await productModel.find().populate("product")

  const user = await userModel.findById(req.user._id).populate("cart")
  console.log(user);
  console.log(user.cart);

  

  res.render("allproducts",{products,allcart:user.cart})
})


// router.post("/admin",upload,async (req,res,next)=>{
//   try {
//     const profileimage = req.file.filename
//     const{name,username ,email,password}=req.body
//     await userModel.register({name,username,email,profileimage},password)
//     res.send("hello")
//   } catch (error) {
//     res.send(error.messege)
//   }
// })



// router.get("/admin/login",isadmin,(req, res, next) => {
//  res.send("hello")
// })
// function isadmin(req,res,next){
//    var Admin = admin.findOne({})
//   if(Admin.isadmin){
//     next()
//   }else{
//     res.redirect("/")
//   }
// }

router.get("/cartbuy/:id",isLoggedIn, async(req,res,next)=>{
  const products = await productModel.findById(req.params.id)
  console.log(products);
  const allcart = await productModel.find()
  res.render("cartbuy", {products, allcart})
  
})


module.exports = router;
