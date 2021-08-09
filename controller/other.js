const User = require('../model/user');
const Room = require('../model/room');
const examQuestion = require('../model/question');
const bcrypt = require('bcryptjs');
const { v4: uuidV4 } = require('uuid');
const { validationResult } = require('express-validator');



 
function timeing(date,time,duriation){
    let date1 = date;
    let time1 = time;
    date1 = date.split("-");
    time1 = time.split(":");
    let dateTime = new Date(+date1[0], +date1[1] - 1, +date1[2], +time1[0], +time1[1]).getTime();
    let now = new Date().getTime();
    now = dateTime - now;
    if(now < 1800000){
     
      if(now < (duriation * 1000 * 60 * -1)){
        return 'COMPLETED'
      } else {
      return 'ALLOW';
      }
    } else {
      return 'NOTALLOW';
    }
    
}

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
      message = message[0];
    } else {
      message = null;
    }
   res.render('login',{ errorMess: message}); 
};

exports.postLogin = (req, res, next) => {
  
    const regno = req.body.regno;
    const password = req.body.password;
    const error = validationResult(req);
       console.log(error.array());
    if(!error.isEmpty()){
      req.flash('error', error.array()[0].msg);
           return res.redirect('/login');
    }
    else{
       User.findOne({ regNo: regno }).then((curUser)=>{
         if (!curUser) {  
            req.flash('error','Please ask your Staff to create an account');
           return res.redirect('/login');
         } else {
           bcrypt.compare(password,curUser.password).then((doMatch)=>{
             if (doMatch) {
             
              req.session.isLoggedin = true;
              req.session.user = curUser;
             return req.session.save((err)=>{
                console.log(err);
                 res.redirect('/home');
              });
             } else {
              req.flash('error','Invalid Password');
              return res.redirect('/login');
             }
  
           }).catch((err)=>{ 
             return res.redirect('/login');
             });
        }
       }).catch((err)=>{  
        return res.redirect('/login');
       });
      }
};

exports.getHome = (req, res, next) => {

  let message = req.flash('succes');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
    const userName = req.session.user.name;
    const userRegNo = req.session.user.regNo;
    const userIsTeach = req.session.user.teachOrstud;
 
   res.render('home' ,{ userName: userName,  userRegNo: userRegNo,  userIsTeach: userIsTeach, errorMess: message});
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        console.log(err);
       res.redirect('/login'); 
      });
};

exports.getPrecheck = (req, res, next) => {
    res.render('precheck');
};

exports.getTests= async (req, res, next) => { 
  const user = req.session.user.teachOrstud;
  const userReg = req.session.user.regNo;

  if(user === 'teacher') { 
     const usrId = req.session.user._id;
     Room.find({teacher: userReg}).then((rooms)=>{
      res.render('tests',{ tests: rooms, userId: usrId ,techstud : 'TEACHER'});
     }).catch((err)=>{
      res.redirect('/errorOccur');
     });

  } else {
     
    let displaytest =[];
    const tests = req.session.user.tests;

    for(let i =0;i < tests.length;i++){
      let subcode = tests[i].subjectCode;
      let roomId = tests[i].examRoom;
  try{
      let exam = await examQuestion.findOne({ subjectCode: subcode });
      if (exam) {
        const allowtime = timeing(exam.examDate, exam.examTime, exam.examDuriation);
        let rooms = await Room.findOne({ roomId: roomId });

        if (rooms) {
          const foudd = rooms.students.find(element => element.RegNo === userReg);
          if(typeof foudd === "undefined"){
            res.redirect('/errorOccur');
          }   else { 
            let newobj = {
              testid : exam._id,
              roomid : rooms._id,
              testcode : exam.subjectCode,
              testname : exam.subjectName,
              testtime : `${exam.examDate} ${exam.examTime}`,
              allowing : allowtime,
            }
            displaytest.push(newobj);
     }
     } else { 
      res.redirect('/errorOccur');
      }
      } else {
        res.redirect('/errorOccur');
      }
    } catch(err) {
      res.redirect('/errorOccur');
    }
    }  
    res.render('tests',{tests: displaytest,userId: '0000', techstud : 'STUDENT'});  
  }
};


exports.getTestdetails = (req, res, next) => {
    res.render('testdetails');
};


exports.getTestQuestIdPrecheck = (req, res, next) => {
  if(req.session.user.teachOrstud === "teacher"){
    const roomMId = req.params.questId;
    const userId = req.params.roomId;
    const roomIdr = req.query.examRoom; 
    User.findOne({_id:userId,regNo:req.session.user.regNo}).then((finusr)=>{
      if(finusr){
      Room.findOne({_id:roomMId,roomId:roomIdr}).then((findroom)=>{
        if(findroom && findroom.teacher === finusr.regNo ){
          let precUser = {
            name: finusr.name,
            regNo: finusr.regNo, 
          }
          return res.render('precheck',{question: finusr._id, room: roomMId , subcode: finusr.regNo, roomId:roomIdr, uusr: precUser });
        }else {
          res.redirect('/errorOccur');
        }
    }).catch((err)=>{
      res.redirect('/errorOccur');
    });
  } else {
    res.redirect('/errorOccur');
  }
    }).catch((err)=>{
      res.redirect('/errorOccur');
    }); 


  } else {
    const quest = req.params.questId;
    const room = req.params.roomId;
    const subcode = req.query.examCode;
    examQuestion.findOne({ _id: quest, subjectCode: subcode}).then((question)=>{
      if (question) {
       const allow = timeing(question.examDate,question.examTime,question.examDuriation)
       if (allow === 'ALLOW' ) {
        let finded = req.session.user.tests.filter(word => word.subjectCode.includes(question.subjectCode));
        if(finded[0]){
          Room.findOne({ _id: room, roomId: finded[0].examRoom}).then((room)=>{
            let finstud = room.students.filter(word => word.RegNo.includes(req.session.user.regNo));
            const roomiid = room._id;
            if (finstud[0]) {
              User.findOne({_id:req.session.user._id,regNo:req.session.user.regNo}).then((fstyusr)=>{
                      if (fstyusr.teachOrstud === 'student') {
                        let precUser = {
                          name: fstyusr.name,
                          regNo: fstyusr.regNo, 
                        }
                        return res.render('precheck',{question: quest, room: roomiid , subcode: subcode, roomId: finded[0].examRoom ,uusr: precUser});
                      } else {
                        res.redirect('/errorOccur');
                      }
              }).catch((err)=>{
                 res.redirect('/errorOccur');
              })
            

            } else {
              res.redirect('/tests');
            }
          }).catch((err)=>{ 
            res.redirect('/errorOccur');
          });
         
        } 
       } else  {
        res.redirect('/tests');
       }
       
      } else {
        res.redirect('/tests');
      }
    }).catch((err)=>{
      res.redirect('/errorOccur');
    });
  }
};

exports.getExamRoomExamQuestionsRoom = async (req, res, next) => {
  const userId = req.session.user._id;
const userReg = req.session.user.regNo;
const teachorstud = req.session.user.teachOrstud;
   if(teachorstud === 'student' ) { 
    const examId = req.params.examQuestions;
    const roomMId = req.params.roomMId;
    const examCd = req.params.examCode;
    const roomId = req.params.roomId;
  
     User.findOne({_id: userId,regNo: userReg}).then((studDoc)=>{ 
      if(studDoc){
        
        examQuestion.findOne({_id: examId, subjectCode:examCd}).then((questions)=>{
         
        if (questions) {

          let date1 = questions.examDate; 
          let time1 = questions.examTime;
          date1 = questions.examDate.split("-");
          time1 = questions.examTime.split(":");
          let dateeee = new Date(+date1[0], +date1[1] - 1, +date1[2], +time1[0], +time1[1], 0, 0);

          const examtime = new Date(dateeee).getTime(); 
          const currtime = new Date().getTime();
          const gap = examtime - currtime ; 



          let finded = studDoc.tests.filter(word => word.subjectCode.includes(questions.subjectCode));
          if(finded[0] && finded.length === 1){
            if(finded[0].examRoom === roomId){
              Room.findOne({_id:roomMId, roomId: roomId}).then((finroom)=>{
                if (finroom) {
                  const finsturo = finroom.students.filter(word => word.RegNo.includes(req.session.user.regNo));
                  if(finsturo[0] && finsturo.length === 1){
                    let answed = studDoc.tests.findIndex(element => element.subjectCode === questions.subjectCode);
                    if (answed > -1) {
                      answed =  studDoc.tests[answed].Answer;
                      let quans = questions.setA.map((x)=>{
                           for(let i=0; i < answed.length; i++){
                             if(x.Q === answed[i].Q){
                                return answed[i];
                             } else { 
                               // this soud be emty
                             }
                           }
                      });
                      let studett = {
                        name: studDoc.name,
                        regNo: studDoc.regNo,
                        num: studDoc.number,
                      }
                      User.findOne({regNo: finroom.teacher}).then((roTeachDoc)=>{

                        if (roTeachDoc) {
                          let roomTeacher = {
                            roomID: finroom.roomId,
                            name: roTeachDoc.name,
                            email: roTeachDoc.email,
                            num: roTeachDoc.number,
                          }
                          return res.render('stud',{ time: gap, questions: questions, room: roomTeacher, answed : quans, studdet: studett });
                        } else {
                         // res.redirect('/errorOccur');
                        }

                      }).catch((err)=>{
                        console.log(err)
                        //console.log(err);
                      });                   

                    } else {
                      
                    } 
                  } else {
                    //res.redirect('/errorOccur');
                  }
                
                } else {
                 // res.redirect('/errorOccur');
                }
               
              }).catch((err)=>{
                console.log(err)
                //res.redirect('/errorOccur');
              });
             
            }else {
             // res.redirect('/errorOccur');
            }
          
        } else {
         // res.redirect('/errorOccur');
        }
        } else {
        
        }
          
        
        }).catch((err)=>{
          console.log(err)
         // res.redirect('/errorOccur');
        });
              }else {
                res.redirect('/errorOccur');
           }

     }).catch((err)=>{
       console.log(err); 
     //  res.redirect('/errorOccur');
      });

} else {
  const userMId = req.params.examQuestions;
  const roomMId = req.params.roomMId;
  const userReg = req.params.examCode;
  const roomIdr = req.params.roomId;
  const techfoun = await User.findOne({_id:userMId,regNo:userReg}); 
    if (techfoun.teachOrstud === "teacher") {
   
    const roomfo = await Room.findOne({_id: roomMId,roomId:roomIdr}); 
     if (roomfo) { 
      let stud = [];
      for(let i = 0; i < 49;i++){
       let ele = roomfo.students[i];
       try {
         if(ele.RegNo.length > 11 ){
             let studreg = await User.findOne({ regNo: ele.RegNo });
             if (studreg) {
                let newobj = {
                     name : studreg.name,
                     RegNo: studreg.regNo,
                     studNum: studreg.number,
                     parent: studreg.parentName,
                     parentNum: studreg.parentNumber,
                 }
                 stud.push(newobj);
            } else { 
            }
         } else {
         }
      
     } catch(err) {
      res.redirect('/errorOccur'); 
     }
   }
   return res.render('teach',{ user: `teach-${techfoun.name}-${techfoun.regNo}`, room: roomIdr ,studUInfo: stud});
     } else {
      res.redirect('/errorOccur'); 
     }

    } else {
      console.log(techfoun);
      console.log(userReg);
    }
}
}

exports.getForgotPassword = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
      res.render('forpass',{ errorMess: message});
}

exports.postForgotPassword = (req, res, next) => {
  const error = validationResult(req);
  console.log(error.array());
if(!error.isEmpty()){
 req.flash('error', error.array()[0].msg);
      return res.redirect('/forgotpassword');
} else {
      const randomId = uuidV4();
      User.findOne({  regNo : req.body.regno, email: req.body.email, section: req.body.section }).then((user)=>{
        if (user) {
          user.resetToken = randomId;
          user.tokenExpiration = Date.now() + 1200000;
          return user.save().then(()=>{
               res.redirect(`/forgotpassword/${randomId}`);
          }).catch((err)=>{
            res.redirect('/errorOccur');
          });
        } else {
          req.flash('error','Account not found');
          res.redirect('/forgotpassword');
        }
      }).catch((err)=>{
     
        res.redirect('/errorOccur');
      });
    }
}

exports.getFgPassToken = (req, res, next) => {
  const token = req.params.token;
  
  User.findOne({ resetToken: token, tokenExpiration: {$gt : Date.now()} }).then((toke)=>{
    const user = toke._id;
    if (toke) {
      let message = req.flash('error');
      if(message.length > 0){
        message = message[0];
      } else {
        message = null;
      }
          res.render('resetToken',{ errorMess: message, userId: user ,token: token });
    } else {
      
    }
  }).catch((err)=>{
    res.redirect('/errorOccur');
  });


      
}

exports.postFgPassToken = (req, res, next) => {

       const newpass = req.body.newpass;
       const conpass = req.body.conpass;
       const userId = req.body.userId;
       const token = req.body.token;
       const error = validationResult(req);
       console.log(error.array());

     if(!error.isEmpty()){
      req.flash('error', error.array()[0].msg);
           return res.redirect(`/forgotpassword/${token}`);
     }  else {
       let user;
       if (newpass === conpass) {
        User.findOne({ resetToken: token, tokenExpiration: {$gt : Date.now()}, _id: userId }).then((toke)=>{
          if (toke) {
            user = toke;
           return bcrypt.hash(newpass,14).then((hashpass)=>{ 
               user.password = hashpass;
               user.resetToken = undefined;  
               user.tokenExpiration = undefined;
               return user.save().then((reslt)=>{
                        res.redirect('/login');
               }).catch((err)=>{
                res.redirect('/errorOccur');
               });
           }).catch((err)=>{
            res.redirect('/errorOccur');
           })
          } else {
            res.redirect('/errorOccur');
          }
        }).catch((err)=>{
          res.redirect('/errorOccur');
        });
       } else {
         
       }

}
}


exports.postAnswerofStud = (req, res, next) => {
  const examQ = req.body.studSubjectCode;  
  let answer = Object.keys(req.body); 
  console.log(req.body);
  examQuestion.findOne({subjectCode: examQ}).then((qustFounded)=>{

    if(qustFounded){
      const allowanstime = timeing(qustFounded.examDate, qustFounded.examTime, qustFounded.examDuriation);
      if( allowanstime === 'ALLOW'){

      
    answer = answer.filter(word => word.includes(examQ)); 
    if (answer.length === 1){
  
    const user = req.session.user._id;
    const userFindReg = req.session.user.regNo;
    User.findOne({_id: user, regNo: userFindReg}).then((stud)=>{
      if(stud){
        const testslist = stud.tests;
        const found = testslist.findIndex(element => element.subjectCode === examQ);
        if(found > -1){
          console.log(stud.tests[found].Answer);
          const ansupda = stud.tests[found].Answer.findIndex(element => element.Q === answer[0]);
           if (ansupda > -1) {
            User.findOneAndUpdate({ _id: user, regNo: userFindReg},
               { $set: { "tests.$[ele].Answer.$[anele].ans": req.body[answer[0]]}},
               { arrayFilters: [ { "ele.subjectCode": examQ }, { "anele.Q": answer[0] } ] })           
              .then(doc => {
              return res.json({status: 'OKSucc'});
          
            }).catch(err => {
              return res.json({status: '0000'});
            });
             
           } else {
            User.findOneAndUpdate({ _id: user, regNo: userFindReg ,"tests._id": stud.tests[found]._id },{ $push: { "tests.$.Answer": {Q: answer[0],  ans:req.body[answer[0]]}}}).then((reu)=>{      
              console.log(answer[0], req.body[answer[0]]);
              return res.json({status: 'OKSucc'});
            }).catch((err)=>{
              return res.json({status: '0000'});
            });
           }
        } else { 
          return res.json({status: '0000'});
        }
      } else {
        return res.json({status: '0000'});
      }
     }).catch((err)=>{
      return res.json({status: '0000'}); 
    });
  } else {
    return res.json({status: '0000'});
  }
}else{ 
  return res.json({status: '/tests'});
}

}else {
  return res.json({status: '0000'}); 
}
  }).catch((err)=>{
    return res.json({status: '0000'});
  });
};