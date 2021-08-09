const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const Rooms = require('../model/room');
const User = require('../model/user');
const Questions = require('../model/question');
const { validationResult } = require('express-validator');

exports.postUser = async (req, res, next) => {  // /createaccount
      const errormm = validationResult(req);
      console.log(errormm.array());
    if(!errormm.isEmpty()){
     req.flash('error', errormm.array()[0].msg);
          return res.redirect(`/createaccount`);
    } else {
     let sublist;
     let ele;
     let testarray = [];
     const allsub = Object.keys(req.body);
     sublist = allsub.filter(word => word.includes(`sub`));
      const regg = req.body.regno;
 for(let i =0; i < 15;i++){
     ele = sublist.filter(word => word.includes(`sub-${i+1}-`));
     if(req.body[ele[0]].length > 0){
        try {
         const exam = await Questions.findOne({subjectCode: req.body[ele[0]]})
           if(exam){   
           if (req.body[ele[1]].length > 6) {
            const rooms = await Rooms.findOne({ roomId: req.body[ele[1]] })
           if(rooms) { 
           const foudd = rooms.students.find(element => element.RegNo === regg);
           if(typeof foudd === "undefined"){
              req.flash('error', `Can't Find ${regg} in given Room ID`);
              return res.redirect(`/updateAccount/${id}`);
           }   else { 
       const newobj = {
           subjectCode : exam.subjectCode,                   
           examRoom : rooms.roomId,
        }  
       testarray.push(newobj);
      }
            } else {
                req.flash('error', `Invalid RoomId`);
                return res.redirect(`/createaccount`);
            }
        } else {
            const newobj = {
                subjectCode : exam.subjectCode,                   
                examRoom : 'non',
            }  
            testarray.push(newobj);
        }
             } else {
                req.flash('error', 'Invalid Subject Code');
                return res.redirect(`/createaccount`);
             }
            } catch(err) {
                res.redirect('/errorOccur');
            }
      }
 }
 
         const body = req.body;
         const regno = body.regno;
         const name = body.name;
         const email = body.email;
         const password = body.password;
         const campus = body.campus.toLowerCase();
         const department = body.department.toLowerCase();
         const year = body.year;
         const section = body.section.toLowerCase();
         const number = body.number;
         const parentName = body.parentName;
         const parentNumber = body.parentNumber;
         const teachOrstud = body.teachOrstud;
         const staff =  req.session.user._id;

 
         User.findOne({ regNo : regno }).then((userDoc)=>{
      
                if (userDoc) {
                    req.flash('error','Account already Exist');
                    return res.redirect('/createaccount');
                } else {
 
                return bcrypt.hash(password, 14).then((hashpass)=>{
                     const user = new User ({
                         name: name,
                         createdBy: staff,
                         regNo: regno,
                         email: email,
                         password: hashpass,
                         campus: campus,
                         department: department,
                         year: year,
                         section: section,
                         number: number,
                         parentName: parentName,
                         parentNumber: parentNumber,
                         teachOrstud: teachOrstud,
                         tests: testarray,
                     });
                    return user.save().then((result)=>{
                        req.flash('succes', `Successfully Created`);
                        res.redirect('/home'); 
                     }).catch((err)=>{
                        res.redirect('/errorOccur');
                     });
                 }).catch((err)=>{ 
                    res.redirect('/errorOccur');
                 });
 
         }

 
         }).catch((err)=>{
            res.redirect('/errorOccur');
         });
        }
};




exports.getUser = (req, res, next) => {  // /createaccount
    let message = req.flash('error');
    const user = req.session.user.name;
    console.log(user);

    if(message.length > 0 ){
      message = message[0];
    } else {
      message = null;
    }
    res.render('createaccount',{ errMess: message , createby: user });
};





exports.getUpdateUser = (req, res, next) => { // /updateAccount
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('updateaccount',{errMess: message});
  //  res.render('createaccount');
};





exports.postUpdateUser = (req, res, next) => {  // /updateAccount

 const errormm = validationResult(req);
      console.log(errormm.array());
    if(!errormm.isEmpty()){
     req.flash('error', errormm.array()[0].msg);
          return res.redirect(`/updateAccount`);
    } else {
    const regno = req.body.regno;
    const campus = req.body.campus.toLowerCase();
    const department = req.body.department.toLowerCase();
    const year = req.body.year;
    const section = req.body.section.toLowerCase();
    User.findOne({regNo: regno}).then((userDoc)=>{
    
        if (userDoc) {
       
            if (userDoc.campus === campus && userDoc.department === department && userDoc.year === +year && userDoc.section === section) {
                
               return res.redirect(`/updateAccount/${userDoc._id}/${userDoc.regNo}`);
            } else {
               req.flash('error','Check the Information')
                return res.redirect('/updateAccount');
            }
        } else {
            req.flash('error','Account not found')
            return res.redirect('/updateAccount');
        }
       
    }).catch((err)=>{
        res.redirect('/errorOccur');
    });
    }
   
};




exports.getUpdatingUser = (req, res, next) => {  // /updateAccount/:updateId
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    const userId = req.params.updateId;
    const userReg = req.params.regNo;
    let updateuser;
    User.findOne({_id: userId, regNo: userReg}).then((userDoc)=>{
        updateuser = userDoc;
        res.render('updateaccid',{ user: updateuser, errMess: message });
    }).catch((err)=>{
        res.redirect('/errorOccur');
    });
   
};

exports.postUpdatingUser = async (req, res, next) => { // /updateAccount/updating
    const id = req.body.id;
    const regg = req.body.regNo;
    const errormm = validationResult(req);
    console.log(errormm.array());
  if(!errormm.isEmpty()){
   req.flash('error', errormm.array()[0].msg);
        return res.redirect(`/updateAccount/${id}`);
  }  else {
     const finding = await User.findOne({ _id: id, regNo: regg});
     if(finding) {
    if (req.body.saveOrdele === 'save') {  
        let sublist;
        let ele;
        let testarray = [];
        const allsub = Object.keys(req.body);
        sublist = allsub.filter(word => word.includes(`sub`));  
    try{
    for(let i =0; i < 15;i++){
        ele = sublist.filter(word => word.includes(`sub-${i+1}-`));
        if(req.body[ele[0]].length > 0){
            const exam = await Questions.findOne({subjectCode: req.body[ele[0]]})
              if(exam){  
                  if (req.body[ele[1]].length > 6) {
                    const rooms = await Rooms.findOne({ roomId: req.body[ele[1]] })
                    if(rooms) { 
                        const foudd = rooms.students.find(element => element.RegNo === regg);
                         if(typeof foudd === "undefined"){
                            req.flash('error', `Can't Find ${regg} in given Room ID`);
                            return res.redirect(`/updateAccount/${id}`);
                         }   else { 
                     const newobj = {
                         subjectCode : exam.subjectCode,                   
                         examRoom : rooms.roomId,
                     }  
                     testarray.push(newobj);
                    }
                   } else {
                       req.flash('error', `Can't Find RoomID`);
                       return res.redirect(`/updateAccount/${id}`);            
                   }
                  } else {
                    const newobj = {
                        subjectCode : exam.subjectCode,                   
                        examRoom : 'non',
                    }  
                    testarray.push(newobj);
                  }
                } else {
                    req.flash('error', `Can't Find Subject Code`);
                    return res.redirect(`/updateAccount/${id}`);
                }
         }
        
    }
} catch(err){
    res.redirect('/errorOccur');
}
    
    const name = req.body.name;
    const email = req.body.email;
    const campus = req.body.campus.toLowerCase();
    const department = req.body.department.toLowerCase();
    const year = req.body.year;
    const section = req.body.section.toLowerCase();
    const number = req.body.number;
    const parentName = req.body.parentName;
    const parentNumber = req.body.parentNumber;
  User.findOneAndUpdate({_id: id, regNo: regg},
  { name: name,email: email,campus: campus,department: department,year: year,section: section,number: number,parentName: parentName,parentNumber: parentNumber,tests: testarray}).then((user)=>{
    req.flash('succes', `Successfully Updated`);
     return res.redirect('/home');
  }).catch((err)=>{
    res.redirect('/errorOccur');
  });

    } else {
        User.findOneAndDelete({_id: id, regNo: regg}).then((result)=>{
            req.flash('succes', `Successfully Deleted`);
           return res.redirect('/home');
        }).catch((err)=>{
            res.redirect('/errorOccur');
        });
       
    }
} else {
    req.flash('error', `Can't Find Account`);
    return res.redirect(`/updateAccount/${id}`);

}
}
};