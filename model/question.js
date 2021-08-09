const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
    examDate: {
        type: String,
        required: true
    },
    examTime: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    },
    numberOfSets: {
        type: Number,
        required: true
    },
    examDuriation: {
        type: Number,
        required: true
    },
    partAQuestion: {
        type: Number,
        required: true
    },
    partAMark: {
        type: Number,
        required: true
    },
    partAtime: {
        type: Number,
        required: true
    },
    partBQuestion: {
        type: Number,
        required: true
    },
    partBMark: {
        type: Number,
        required: true
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
   setA: [{  
        Q: {type:String,},
        contentQ:  {type:String,},
        imgQ:  {type:String,},
        a:  {type:String,},
        contenta:  {type:String,},
        imga:  {type:String,},
        b:  {type:String,},
        contentb:  {type:String,},
        imgb:  {type:String,},
        c:  {type:String,},
        contentc:  {type:String,},
        imgc:  {type:String,},
        d:  {type:String,},
        contentd:  {type:String,},
        imgd:  {type:String,},
      }],
    setB: [{
        Q: {type:String,},
        contentQ:  {type:String,},
        imgQ:  {type:String,},
        a:  {type:String,},
        contenta:  {type:String,},
        imga:  {type:String,},
        b:  {type:String,},
        contentb:  {type:String,},
        imgb:  {type:String,},
        c:  {type:String,},
        contentc:  {type:String,},
        imgc:  {type:String,},
        d:  {type:String,},
        contentd:  {type:String,},
        imgd:  {type:String,},
        }],
    setC: [{    
        Q: {type:String,},
        contentQ:  {type:String,},
        imgQ:  {type:String,},
        a:  {type:String,},
        contenta:  {type:String,},
        imga:  {type:String,},
        b:  {type:String,},
        contentb:  {type:String,},
        imgb:  {type:String,},
        c:  {type:String,},
        contentc:  {type:String,},
        imgc:  {type:String,},
        d:  {type:String,},
        contentd:  {type:String,},
        imgd:  {type:String,},
        }],
    setD: [{  
        Q: {type:String,},
        contentQ:  {type:String,},
        imgQ:  {type:String,},
        a:  {type:String,},
        contenta:  {type:String,},
        imga:  {type:String,},
        b:  {type:String,},
        contentb:  {type:String,},
        imgb:  {type:String,},
        c:  {type:String,},
        contentc:  {type:String,},
        imgc:  {type:String,},
        d:  {type:String,},
        contentd:  {type:String,},
        imgd:  {type:String,},
        }],
    setE: [{        
        Q: {type:String,},
        contentQ:  {type:String,},
        imgQ:  {type:String,},
        a:  {type:String,},
        contenta:  {type:String,},
        imga:  {type:String,},
        b:  {type:String,},
        contentb:  {type:String,},
        imgb:  {type:String,},
        c:  {type:String,},
        contentc:  {type:String,},
        imgc:  {type:String,},
        d:  {type:String,},
        contentd:  {type:String,},
        imgd:  {type:String,},
        }]

});

module.exports = mongoose.model('Questionpaper',examSchema);