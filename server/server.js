const dotenv = require("dotenv");
dotenv.config();
const express = require("express")
const mongoose = require('mongoose');
const cors = require("cors")
const PORT = process.env.PORT;
const uri = process.env.ATLAS_URI ;
const userModel = require('./Schema/user')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(uri);

app.post('/SignIn', (req,res) =>{
    console.log("caught");
    const {email, password} = req.body;
    userModel.findOne({email: email})
    .then(users => {
        if(users){
            if(users.password===password){
                res.json("Success")
            }else{
                res.json("Fail")
            }
        }else{
            res.json("Fail")
        }
    })
    .catch(err => res.json(err))
})

app.post('/createA', (req,res) =>{
    console.log("caught")
    const {name,email, password} = req.body;
    userModel.findOne({email: email})
    .then(users => {
        if(users){
            res.json("Fail")
        }else{
            userModel.create(req.body)
            .then(users => res.json("Success"))
            .catch(err => res.json(err))
        }
    })
    .catch(err => res.json(err))
})

app.listen(PORT, ()=>{
    console.log("server is running")
})