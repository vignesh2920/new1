const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    regNo:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetToken:{
        type: String,
    },
    tokenExpiration:{
        type: Date,
    },
    campus:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    section:{
        type: String,
        required: true
    },
    number:{
        type: Number,
        required: true
    },
    parentName:{
        type: String,
        required: true
    },
    parentNumber:{
        type: Number,
        required: true
    },
    teachOrstud:{
        type: String,
        required: true
    },
    tests: [{  
        subjectCode: {
            type: String,
            required: true
        },
        examRoom:  {
            type: String,
            required: true
        },
        Answer:[{
            Q:{
                type: String,
                required: true
            },
            ans:{
                type: String,
                required: true
            }
        }]
      }],
});


module.exports = mongoose.model('User',userSchema);