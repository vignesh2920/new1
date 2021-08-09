const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({   
    roomId:{
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },
    teacher:{
        type: String,
        required: true
    },
    students:[{
        num:{
            type: String,
        },
        RegNo:{
            type: String,
        }
    }]
});


module.exports = mongoose.model('Room',roomSchema);