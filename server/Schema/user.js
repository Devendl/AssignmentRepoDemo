const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    medications: [
        {
          name: String,
          dosage: String, // or Number, depending on your needs
          dosesThisWeek: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0, 0], // 7 days: Mon–Sun
          },  
          color: {
            type:String, 
            default: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
          }
        }
      ],
    lastReset: { type: Date, default: new Date() },
    reminders: [
        {
          name: String,
          medicine: String,
          scheduledTime: Date 
        }
    ],
})

const userModel = mongoose.model("users", userSchema)
module.exports = userModel