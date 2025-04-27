const dotenv = require("dotenv");
dotenv.config();
const express = require("express")
const mongoose = require('mongoose');
const cors = require("cors")
const PORT = process.env.PORT;
const uri = process.env.ATLAS_URI ;
const userModel = require('./Schema/user')
const jwt = require('jsonwebtoken');
const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(uri);

app.post('/DashBoardInfo', authenticateToken, (req,res) =>{
    
    userModel.findOne({email: req.user.email})
    .then(users => {
        if(users){
            res.json({name: users.name})
        }else{
            res.sendStatus(403)
        }
    })
    .catch(err => res.sendStatus(403))
})

app.post('/addLog', (req,res) =>{
    console.log("receiveddd")
    const {medicine, dosage, today} = req.body;
    const day = new Date(today);
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
    })
    userModel.findOne({email: req.user.email})
    .then(users => {
        if(users){
           for(var i= 0;i<users.medications.length;i++){
               if(users.medications[i].name==medicine){
                    var num = users.medications[i].dosesThisWeek[day.getDay()] + parseInt(dosage);
                    console.log(num);
                    users.medications[i].dosesThisWeek[day.getDay()]= num;
                    break;
               }

           }
           users.save()
           res.json("Log added successfully");
        }else{
            console.log(err);
            res.sendStatus(403)
        }
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(403)

    })
})

app.post('/addReminder', (req,res) =>{
    console.log("received")
    const {rName, medicine, dateTime} = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
    })
    userModel.findOne({email: req.user.email})
    .then(users => {
        if(users){
            users.reminders.push({
                name: rName,
                medicine: medicine,
                scheduledTime: dateTime
            })
            users.save()
            .then(() => {
              res.json("Reminder added successfully");
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: "Error saving reminder" });
            });
        }else{
            res.sendStatus(403)
        }
    })
    .catch(err => res.sendStatus(403))
})

app.post('/checkReminders', authenticateToken, (req,res) =>{
    
    userModel.findOne({email: req.user.email})
    .then(users => {
        if(users){
            res.json({reminders: users.reminders})
        }else{
            res.sendStatus(403)
        }
    })
    .catch(err => res.sendStatus(403))
})


app.post('/addMeds', (req,res) =>{
    const {medicine, send} = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
    })
    userModel.findOne({email: req.user.email})
    .then(users => {
        if(users){
            users.medications.push({
                name: medicine,
                dosage: send,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
            })
            users.save()
            .then(() => {
              res.json("Medication added successfully");
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: "Error saving medication" });
            });
        }else{
            res.sendStatus(403)
        }
    })
    .catch(err => res.sendStatus(403))
})

app.post('/checkMeds', authenticateToken, (req,res) =>{
    
    userModel.findOne({email: req.user.email})
    .then(users => {
       
        if(users){
            const inDate = new Date(users.lastReset);
            
            const today = new Date();
            let save = false;
            users.save();
            while(inDate<today){
                inDate.setDate(inDate.getDate()+7);
                if(inDate<=today){
                    for(var i= 0;i<users.medications.length;i++){
                        users.medications[i].dosesThisWeek = [0,0,0,0,0,0,0];
                    }
                    users.lastReset = new Date(inDate);
                    save = true;
                }
            }
            if(save){
                users.save();
            }
            res.json({medications: users.medications})
            
        }else{
            res.sendStatus(403)
        }
    })
    .catch(err => res.sendStatus(403))
})

app.post('/SignIn', (req,res) =>{
    const {email, password} = req.body;
    userModel.findOne({email: email})
    .then(users => {
        console.log("sent")
        if(users){
            if(users.password===password){
                const token = jwt.sign({email: users.email}, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                console.log("sent")
                res.json({token})
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
            .then(users => {
                const today = new Date();
                const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                const lastSunday = new Date(today);
                lastSunday.setDate(today.getDate() - dayOfWeek); // Go back to last Sunday
                lastSunday.setHours(0, 0, 0, 0);
                users.lastReset = lastSunday;
                users.save();
                res.json("Success")
            })
            .catch(err => res.json(err))
        }
    })
    .catch(err => res.json(err))
})

function authenticateToken(req,res,next){
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(PORT, ()=>{
    console.log("server is running")
})