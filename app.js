const express= require('express');
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
// const encrypt=require('mongoose-encryption');
const bcrypt=require('bcrypt');
const cors=require('cors');
const saltRounds=10;
const app= express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));

  
mongoose.connect("mongodb+srv://@cluster0.5mq9p.mongodb.net/userDB?retryWrites=true&w=majority",{useNewUrlParser:true})

const userSchema= new mongoose.Schema({
    firstName:String,
    address:String,
    email:String,
    password:String,
    phone: Number,
    segments:Number
});


// const secret ="ogsnkahalhlogcvwhtzllczvsovntwvymfalvwtvaeyknykjdwemolxzrzspbcsx.";
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.send("HI");
}
)


app.post('/signup',(req,res)=>{
    const email=req.body.email;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
    
    User.findOne({email:email},(err,found)=>{
        if(err)
            res.send({message:"error"});
        else
        {
            if(found)
            {

                res.send({message:"user already exists"});
            }
            else
            {
                const newUser=new User({
                    firstName:req.body.firstName,
                    address:req.body.address,
                    email:req.body.email,
                    password:hash,
                    phone:req.body.phone,
                    segments:req.body.segments
                })
                newUser.save((errr)=>{
                    if(errr)
                        res.send({message:"error"});
                    else
                        res.send({message:"Success"});
                });
            }
        }
        
    });
});
      
});

app.post('/signin',(req,res)=>{

    const email=req.body.email;
    console.log(req.body);
    const password=req.body.password;
    const segments=req.body.segments;
   
    console.log(email,password);
    User.findOne({email:email},(err,found)=>{
        if(err)
        res.send({message:"error"})
        else
        {
            if(found)
            {
                bcrypt.compare(password, found.password, function(errr, result) {
                    if(result==true)
                    res.send({message:"User authenticated"});
                    else
                    res.send({message:"Password incorrect"});
                });
               
            }
            else
            res.send({message:"User doesn't exist"});
        }
        
    });
});

app.listen(4000,()=>{

});
