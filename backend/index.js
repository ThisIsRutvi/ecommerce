const port = 4000;
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path")//access to our backend directory in our express app
const cors = require("cors");
const { type } = require("os");

app.use(express.json());//whatever request we will get from response that will be automatically passed through json//for api to run on server
app.use(cors());//it will connect our react project to express app on 4000port

//database connection with mongodb
mongoose.connect("mongodb+srv://rutvidave:rutvi%40dave03@cluster0.iygot2o.mongodb.net/e-commerce")

//rutvi@dave03

// Api creation

app.get("/",(req,res)=>{
   res.send("express app is running")
})

// imge storage engine
//middleware is storage and will rename that img with the new name(return cb) and that img will be stored in imgs fldr
const storage = multer.diskStorage({
    destination:'./upload/imgs',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//upload enpoint

app.use('/imgs',express.static('upload/imgs'))//uploaded imgs will get stored in imgs folder that will get at/imgs//endpoint

app.post("/upload",upload.single('product'),(req,res)=>{
     res.json({
        success:1,//if img uploaded succesfully
        img_url:`http://localhost:${port}/imgs/${req.file.filename}`//file is a property added to the req object by multer middleware. It represents the uploaded file.filename is a property of the file object created by multer. It contains the name of the file as stored on the server.
     })
})
//schema for creating products

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
    if(products.length>0){//When you have a products array and you want to add a new product//in database
       let last_product_array =  products.slice(-1);//returns a new array containing only the last element of products.
       let last_product = last_product_array[0];//To access the actual last product object from the new array created by slice(-1).
       id=last_product.id+1;//To generate a new unique id for a new product.
    }
    else{//when databse hase no producat
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

//api for deleting products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({            //mongoose method
         id:req.body.id
    })
    console.log('removed');
    res.json({
        success:true,
        name:req.body.name
    })
})

//creating api for getting all produts

app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("all produts fetch");
    res.send(products);
})

// shema creating for user model

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
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now()
    }
    
})

// creating endpoint for registering the user
app.post('/signup',async(req,res)=>{
    let check = await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with samne email id"})
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

    await user.save();//save in db

    const data={//obj
        user:{
            id:user.id,
        }
    }

    const token = jwt.sign(data,'secret_ecom')//data will be emcrpted by one layer using salt
    res.json({success:true,token})
})

//creating endpoint for user login
app.post('/login',async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user){
        const passcom = req.body.password === user.password;
        if(passcom){
            const data ={
                user:{
                    id:user.id
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

// creating endpint for newcollection data
app.get('/newcollection',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("fetched");
    res.send(newcollection);
})

//creating and ponit for popular in women
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women)
})

//creating middlewear to fetch user

const fetchUser = async(req,res,next)=>{
     const token = req.header('auth-token');
     if (!token) {
        res.status(401).send({errors:"Please authenticate using valid token"})
     }
     else{
        try {
            const data= jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
     }
}

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

app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("getcart")
    let userData = await User.findOne({_id:req.user.id})
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error){
      console.log("server "+port)  
    }
    else{
        console.log("error :" +error)
    }
})