const port = 4000;
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path")
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());

dotenv.config()
const client  = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

mongoose.connect("mongodb+srv://rutvidave:rutvi%40dave03@cluster0.iygot2o.mongodb.net/e-commerce")

app.get("/",(req,res)=>{
   res.send("express app is running")
})


const Admin = mongoose.model('Admin',{
    name:{
        type:String,
    },
    password:{
        type:String,
        unique:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    loggedIn:{
        type:Boolean,
        default:false,
    },
})

app.post('/adminlogin',async(req,res)=>{

    const count = await Admin.countDocuments({ loggedIn:true });
    if(count>=10){
        return res.status(403).json({success: false,})
    }
    let admin = await Admin.findOne({name:req.body.username, password:req.body.password})
    if(!admin){
        return res.status(400).json({success:false,errors:"admin does not exsits"})
    }
    if(admin.loggedIn){
        const token = jwt.sign({admin:{id:admin.id}},'secret-ecom')
    }
    await admin.save();

    const token = jwt.sign({ admin: { id: admin.id } },'secret-ecom')
    res.json({success:true,token})
})

const storage = multer.diskStorage({
    destination:'./upload/imgs',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

app.use('/imgs',express.static('upload/imgs'))

app.post("/upload",upload.single('product'),(req,res)=>{
     res.json({
        success:1,
        img_url:`http://localhost:${port}/imgs/${req.file.filename}`
     })
})

const Product = mongoose.model('Product',{
    id:{
        type:Number,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        require:true,
    },
    new_price:{
        type:Number,
        require:true,
    },
    old_price:{
        type:Number,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    available:{
        type:Boolean,
        default:true,
    }
    
})

app.post("/addproduct",async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
       let last_product_array =  products.slice(-1);
       let last_product = last_product_array[0]
       id=last_product.id+1;
    }
    else{
       id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name
    })
})

app.post('/removeproduct',async(req,res)=>{

    await Product.findOneAndDelete({            
         id:req.body.id
    })
    console.log('removed');
    res.json({
        success:true,
        name:req.body.name
    })
})


app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("all produts fetch");
    res.send(products);
})

const User = mongoose.model('User',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:function(){
            return this.authProvider === "local"
        }
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    authProvider:{
        type:String,
        enum:["local","google","local+google"],
        required:true
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now()
    }
    
})

app.post('/signup',async(req,res)=>{
    let check = await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email id"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })

    await user.save();

    const data={
        user:{
            id:user.id,
            email:user.email
        }
    }

    const token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token})
})

app.post('/login',async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user){
        const passcom = req.body.password === user.password;
        if(passcom){
            const data ={
                user:{
                    id:user.id,
                    email:user.email
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:'wrong password'})
        }
    }
    else{
        res.json({success:false,errors:"wrong email id"})
    }
})

app.post('/google',async(req,res)=>{
    try{
    const {token} = req.body

    const ticket = await client.verifyIdToken({
        idToken:token,
        audience:process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const {sub,email,name} = payload

    if(!sub){
        return res.status(401).json({message:'invalid google id'})
    }
      let user = await User.findOne({email})

    if(user ){

       if(!user.googleId){
       user.googleId = sub;
       user.authProvider = user.authProvider === 'local'
       ?"local+google":"google";
       await user.save()
       }
    }
    else {
  const cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  user = await User.create({
    name,
    email,
    googleId: sub,
    authProvider: "google",
    password: null,
    cartData: cart
  });
 }

 const jwttoken = jwt.sign(
  {
    user: {
      id: user._id,
      email: user.email
    }
  },
  'secret_ecom',
  { expiresIn: '7d' }
);

    res.json({
        success:true,
        token:jwttoken,
         user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
        },
    })
}catch(error){
console.error(error);
    res.status(401).json({ error: "Google authentication failed" });
}
})

app.get('/newcollection',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(-8);
    console.log("fetched");
    res.send(newcollection);
})

app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women)
})

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ error: "Auth token missing" });
  }

  try {
    const decoded = jwt.verify(token, "secret_ecom");

    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = {
      id: decoded.user.id,
      email: decoded.user.email
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("added",req.body.itemId)
    let userData = await User.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("added")
})

app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId)
    let userData = await User.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] >0)
    userData.cartData[req.body.itemId] -= 1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("removed")
})

app.post('/getcart', fetchUser, async (req, res) => {
  console.log("getcart");

  const userData = await User.findById(req.user.id);

  if (!userData) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(userData.cartData);
});

const Order =  mongoose.model('Order',{
    items:[
        {
        name: {type:String},
        size:{type:Number},
        quantity:{type:Number},
        imageUrl:{type:String},
        price:{type:Number},
        }
    ],
    totalamount:{type: Number, required:true},
    orderDate:{type:Date,default:Date.now},
    userEmail:{type:String,required:true},
})

app.post('/order',async (req,res)=>{
    const {items, totalamount} = req.body;
    try{
        const token = req.headers['auth-token'];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, 'secret_ecom'); 
        const userEmail = decoded.user.email;

        const newOrder = new Order({
            items,
            totalamount,
            userEmail
        });

        await newOrder.save();
        res.status(201).json({message:'Order placed successfully',order: newOrder});
    }
    catch (error)
    {
        console.error('Error creating order:',error);
        res.status(500).json({message: 'order failed',error:error.message})
    }
})

const Payment= mongoose.model('Payment',{
    
   pname:{
    type:String,
   },
   paymentemail:{
    type:String,
   },
   phoneNumber:
   {
    type:String,
   },
   address:{
    type:String,
    required:true
   },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

app.post('/payment',async (req,res)=>{
    const { pname, paymentemail, phoneNumber, address, amount } = req.body;

    try{
    const user = await User.findOne({ email: paymentemail });
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
       
       const newPayment = new Payment ({
        pname,
        paymentemail,
        phoneNumber,
        address,
        amount
       });

       await newPayment.save();


       res.status(201).json({message:'Payment confirmed',payment:newPayment})
    }
    catch (error){
        console.error('Error processing payment:', error);
       res.status(500).json({message: 'payment failed',error:error.message})
    }
})

const Feedback = mongoose.model('Feedback',{
    femail:{
        type:String,
        required:true,
    },
    feedback:{
        type:String
    }
})

app.post('/feedback',async(req,res)=>{
    const {femail,feedback} = req.body
    try{
        const newFeedback = new Feedback({
            femail,
            feedback
        });

        await newFeedback.save();
        res.status(201).json({message:'feedback is confirmed',feedback:newFeedback})

    }
    catch(error){
        console.error('Error processing feedback:', error);
        res.status(500).json({message: 'feedback failed',error:error.message})
    }
})

app.get('/feedbacklist',async(req,res) =>{
    try{
       const feedback = await Feedback.find();

       res.json({success:true , feedback});
    }
    catch(error){
       res.status(500).json({success:false,message: 'fail to fetch feedback',error:error.message});
    }
})

app.get('/userlist', async (req, res) => {
    try {
        const users = await User.find();
                res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
});

app.get('/orderlist',async (req,res)=>{
    try{
        const orders = await Order.find();

        res.json({success:true,orders})
    }
    catch (error){
        res.status(500).json({success:false,message:'failed',error:error.message});
    }
})

app.get('/paymentlist',async (req,res) =>{
    try{
        const pay = await Payment.find();

        res.json({success:true, pay});
    }catch (error){
        res.status(500).json({success:false, message:'failed to fetch payment info',error:error.message});
    }
})

app.get('/filterproduct',async(req,res)=>{
    try {
        const {category,minprice,maxprice} = req.query
        const filter ={}

   if (category && category.trim() !== '') {
  const categories = category.split(',').map(c => c.trim().toLowerCase());
  filter.category = { $in: categories };
}

        if(minprice || maxprice ){

            filter.new_price={}

            if(minprice) filter.new_price.$gte = Number(minprice)
            if(maxprice) filter.new_price.$lte = Number(maxprice)    
        }

        const products = await Product.find(filter)
        res.json(products)
    } catch (error) {
        res.status(500).json({success:false,message:'failed to search product',error:error.message})
    }
})

app.get('/search',async(req,res)=>{
    try {
        const {name} = req.query
        const filter ={}

        if(name){
            filter.name={$regex :name,$options:'i'}
        }

        const products = await Product.find(filter)
        res.json(products)
    } catch (error) {
        res.status(500).json({success:false,message:'failed to search product',error:error.message})
    }
})


app.listen(port,(error)=>{
    if(!error){
      console.log("server runing on"+port)  
    }
    else{
        console.log("error :" +error)
    }
})
