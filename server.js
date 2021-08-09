'use strict';
require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const moment = require('moment');
const http = require('http');
const multer = require('multer');

const path = require('path');
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf'); 
const flash = require('connect-flash');
const { body } = require('express-validator');

const isAuth = require('./middlewase/isauth');
const isTeach = require('./middlewase/isteach');
const controllerOther = require('./controller/other'); 
const controllerCreateQuest = require('./controller/createQuest'); 
const controllerUser = require('./controller/user');
const controllerRoom = require('./controller/room');
const examQuestion = require('./model/question');
const Users = require('./model/user');

const port = process.env.PORT || 3000;

const { jwt: { AccessToken } } = require('twilio');
const VideoGrant = AccessToken.VideoGrant;
// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 14400;
 
const app = express();
const server = http.createServer(app);  
const io = socketio(server);

const filestorage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null,  file.fieldname + '-' +file.originalname )
  }
});


const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}
 

const store = new MongodbStore({
  uri: 'mongodb+srv://vignesh:VickySanjay2022@cluster0.x3zgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 4,
});

const csrfProtection = csrf();

let users = [];

let fieldsarr = [];

for (let p = 1; p < 101; p++) {
  for (let l = 1; l < 6; l++) {
    for (let k = 1; k < 6; k++) {
      let newObj = {
        name: `Qimg-${l}-${p}-${k}`
      }
      fieldsarr.push(newObj);  
    }
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: filestorage, fileFilter: fileFilter }).fields(fieldsarr));
app.set('view engine', 'ejs');
app.set('views', ['quickstart/public','quickstart/public/views']); 
app.use(express.static(path.join(__dirname, './quickstart/public')));
app.use('/images',express.static(path.join(__dirname, './images')));
app.use(session({
  name: 'SRMIST',
  secret: 'SRMVignes!!3459#dfdf',
  resave: false,
  saveUninitialized: false,  
  cookie: {
    maxAge: 14400000,  
    sameSite: 'strict',
    secure: false,
  },
  store: store,
}));
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
  res.locals.csrfToken = req.csrfToken();
  next();
});



function userjoin(id, name , room){
  const user = {
      id: id,
      name: name,
      room: room
     };
  users.push(user);
  return user;
}

function getCurrntuser(id){
  return users.find(user => user.id === id);
}

function userLeave(id) {
  const userlist = users;
  let oneuser;
  users = userlist.filter(word => word.id !== id);
  oneuser = userlist.filter(word => word.id === id);
  return oneuser[0];
}

function formatmessage(username,text){
  return {
      username,
      text: text.replace(/</g,"&lt;"),
      time: moment().format('h:mm a')
  }
}
  
 
io.on('connection',(socket)=>{
  socket.on('joinroom',({ username, room })=>{
      const user = userjoin(socket.id, username,room);  
      socket.join(user.room);
      socket.emit('message', formatmessage('Srm bot','Welcoming by bot'));
      socket.broadcast.to(user.room).emit('message',formatmessage('Srm bot',`${user.name} just join`));
  });
  socket.on('chatMessage',(msg)=>{
      const user = getCurrntuser(socket.id);
      io.to(user.room).emit('message',formatmessage(user.name,msg));
  });
   socket.on('disconnect',()=>{
      const user = userLeave(socket.id);
      if(user){
          io.to(user.room).emit('message',formatmessage('Srm bot',`${user.name} just now disconnected`));       
      }        
   });
})
  




app.get('/', (req,res,next)=>{
  res.redirect('/login');
}); 

app.get('/login', controllerOther.getLogin); 

app.get('/forgotpassword', controllerOther.getForgotPassword); 

app.get('/forgotpassword/:token', controllerOther.getFgPassToken); 

app.get('/home', isAuth, controllerOther.getHome);

app.get('/tests', isAuth, controllerOther.getTests);

app.get('/test/:questId/:roomId/precheck', isAuth, controllerOther.getTestQuestIdPrecheck); 

app.get('/examRoom/:examQuestions/:roomMId/:examCode/:roomId/entered', isAuth, controllerOther.getExamRoomExamQuestionsRoom);



app.post('/login',[
  body('regno','Reg. No. should be (min 12)').isLength({min: 12}).isAlphanumeric().trim().notEmpty(),
  body('password','Password shoud be(min: 8,max: 12 and no special charecter)').isLength({min: 8, max:12}).isAlphanumeric().trim().notEmpty()
],controllerOther.postLogin);

app.post('/forgotpassword',[
  body('regno','Reg. No. should be (min 12)').isLength({min: 12}).isAlphanumeric().trim().notEmpty(),
  body('email','Check email had @ and . in it').isEmail().normalizeEmail().notEmpty(),
  body('section','Section shoud be(min: 1,max: 2)').isLength({min: 1,max: 2}).isAlpha().trim().notEmpty(),
], controllerOther.postForgotPassword);

app.post('/forgotpassword/token',[
  body('newpass','Password shoud be(min: 8,max: 12 and no special charecter)').isLength({min: 8, max:12}).isAlphanumeric().trim().notEmpty(),
  body('conpass','Password shoud be(min: 8,max: 12 and no special charecter)').isLength({min: 8, max:12}).isAlphanumeric().trim().notEmpty()
], controllerOther.postFgPassToken);

app.post('/logout', controllerOther.postLogout);








app.get('/createroom', isAuth, isTeach, controllerRoom.getRoom);

app.get('/viewroom', isAuth, isTeach, controllerRoom.getViewRoom);

app.get('/rooms/:roomid/:id', isAuth, isTeach, controllerRoom.getUpViRoom);

app.get('/createaccount', isAuth, isTeach, controllerUser.getUser);

app.get('/updateAccount', isAuth, isTeach, controllerUser.getUpdateUser);  

app.get('/updateAccount/:updateId/:regNo', isAuth, isTeach, controllerUser.getUpdatingUser);

app.get('/createtest/:question', isAuth, isTeach, controllerCreateQuest.getCreateQuest);

app.get('/updatequestion', isAuth, isTeach, controllerCreateQuest.getUpdateQuest);

app.get('/updatequestion/:questid/:questcode', isAuth, isTeach, controllerCreateQuest.getViUpQuest);

app.get('/createtest', isAuth, isTeach, controllerCreateQuest.getcreateTest);



app.post('/createroom', isAuth, isTeach,[
  body('RoomID','Check RoomID (only number and letter min length 7)').isAlphanumeric().isLength({min: 7}).trim().notEmpty(),
  body('teacher','Check Teacher').isAlphanumeric().trim().notEmpty(),
  body('stud-1-room','Check Stud 1').trim(),
  body('stud-2-room','Check Stud 2').trim(),
  body('stud-3-room','Check Stud 3').trim(),
  body('stud-4-room','Check Stud 4').trim(),
  body('stud-5-room','Check Stud 5').trim(),
  body('stud-6-room','Check Stud 6').trim(),
  body('stud-7-room','Check Stud 7').trim(),
  body('stud-8-room','Check Stud 8').trim(),
  body('stud-9-room','Check Stud 9').trim(),
  body('stud-10-room','Check Stud 10').trim(),
  body('stud-11-room','Check Stud 11').trim(),
  body('stud-12-room','Check Stud 12').trim(),
  body('stud-13-room','Check Stud 13').trim(),
  body('stud-14-room','Check Stud 14').trim(),
  body('stud-15-room','Check Stud 15').trim(),
  body('stud-16-room','Check Stud 16').trim(),
  body('stud-17-room','Check Stud 17').trim(),
  body('stud-18-room','Check Stud 18').trim(),
  body('stud-19-room','Check Stud 19').trim(),
  body('stud-20-room','Check Stud 20').trim(),
  body('stud-21-room','Check Stud 21').trim(),
  body('stud-22-room','Check Stud 22').trim(),
  body('stud-23-room','Check Stud 23').trim(),
  body('stud-24-room','Check Stud 24').trim(),
  body('stud-25-room','Check Stud 25').trim(),
  body('stud-26-room','Check Stud 26').trim(),
  body('stud-27-room','Check Stud 27').trim(),
  body('stud-28-room','Check Stud 28').trim(),
  body('stud-29-room','Check Stud 29').trim(),
  body('stud-30-room','Check Stud 30').trim(),
  body('stud-31-room','Check Stud 31').trim(),
  body('stud-32-room','Check Stud 32').trim(),
  body('stud-33-room','Check Stud 33').trim(),
  body('stud-34-room','Check Stud 34').trim(),
  body('stud-35-room','Check Stud 35').trim(),
  body('stud-36-room','Check Stud 36').trim(),
  body('stud-37-room','Check Stud 37').trim(),
  body('stud-38-room','Check Stud 38').trim(),
  body('stud-39-room','Check Stud 39').trim(),
  body('stud-40-room','Check Stud 40').trim(),
  body('stud-41-room','Check Stud 41').trim(),
  body('stud-42-room','Check Stud 42').trim(),
  body('stud-43-room','Check Stud 43').trim(),
  body('stud-44-room','Check Stud 44').trim(),
  body('stud-45-room','Check Stud 45').trim(),
  body('stud-46-room','Check Stud 46').trim(),
  body('stud-47-room','Check Stud 47').trim(),
  body('stud-48-room','Check Stud 48').trim(),
  body('stud-49-room','Check Stud 49').trim(),
], controllerRoom.postRoom);   
 


app.post('/rooms/roomid', isAuth, isTeach,[
  body('RoomID','Check RoomID (only number and letter min length 7)').isAlphanumeric().isLength({min: 7}).trim().notEmpty(),
  body('teacher','Check Teacher').isAlphanumeric().trim().notEmpty(),
  body('todo','Something went Wrong').isAlpha().trim().notEmpty(),
  body('stud-1-room','Check Stud 1').trim(),
  body('stud-2-room','Check Stud 2').trim(),
  body('stud-3-room','Check Stud 3').trim(),
  body('stud-4-room','Check Stud 4').trim(),
  body('stud-5-room','Check Stud 5').trim(),
  body('stud-6-room','Check Stud 6').trim(),
  body('stud-7-room','Check Stud 7').trim(), 
  body('stud-8-room','Check Stud 8').trim(),
  body('stud-9-room','Check Stud 9').trim(),
  body('stud-10-room','Check Stud 10').trim(),
  body('stud-11-room','Check Stud 11').trim(),
  body('stud-12-room','Check Stud 12').trim(),
  body('stud-13-room','Check Stud 13').trim(),
  body('stud-14-room','Check Stud 14').trim(),
  body('stud-15-room','Check Stud 15').trim(),
  body('stud-16-room','Check Stud 16').trim(),
  body('stud-17-room','Check Stud 17').trim(),
  body('stud-18-room','Check Stud 18').trim(),
  body('stud-19-room','Check Stud 19').trim(),
  body('stud-20-room','Check Stud 20').trim(),
  body('stud-21-room','Check Stud 21').trim(),
  body('stud-22-room','Check Stud 22').trim(),
  body('stud-23-room','Check Stud 23').trim(),
  body('stud-24-room','Check Stud 24').trim(),
  body('stud-25-room','Check Stud 25').trim(),
  body('stud-26-room','Check Stud 26').trim(),
  body('stud-27-room','Check Stud 27').trim(),
  body('stud-28-room','Check Stud 28').trim(),
  body('stud-29-room','Check Stud 29').trim(),
  body('stud-30-room','Check Stud 30').trim(),
  body('stud-31-room','Check Stud 31').trim(),
  body('stud-32-room','Check Stud 32').trim(),
  body('stud-33-room','Check Stud 33').trim(),
  body('stud-34-room','Check Stud 34').trim(),
  body('stud-35-room','Check Stud 35').trim(),
  body('stud-36-room','Check Stud 36').trim(),
  body('stud-37-room','Check Stud 37').trim(),
  body('stud-38-room','Check Stud 38').trim(),
  body('stud-39-room','Check Stud 39').trim(),
  body('stud-40-room','Check Stud 40').trim(),
  body('stud-41-room','Check Stud 41').trim(),
  body('stud-42-room','Check Stud 42').trim(),
  body('stud-43-room','Check Stud 43').trim(),
  body('stud-44-room','Check Stud 44').trim(),
  body('stud-45-room','Check Stud 45').trim(),
  body('stud-46-room','Check Stud 46').trim(),
  body('stud-47-room','Check Stud 47').trim(),
  body('stud-48-room','Check Stud 48').trim(),
  body('stud-49-room','Check Stud 49').trim(),
], controllerRoom.postUpViRoom); 



app.post('/createaccount', isAuth, isTeach,[
  body('regno','Reg. No. should be (min 12)').isLength({min: 12}).isAlphanumeric().trim().notEmpty(),
  body('email','Check email had @ and . in it').isEmail().normalizeEmail().notEmpty(),
  body('password','Password shoud be(min: 8,max: 12 and no special charecter)').isLength({min: 8, max:12}).isAlphanumeric().trim().notEmpty(),
  body('name','Check Name').trim().notEmpty(),
  body('campus','Check Campus').isAlpha().trim().notEmpty(),
  body('department','Check Department').isAlpha().trim().notEmpty(),
  body('year','Check Year').isNumeric().isLength({min: 1,max: 9}).trim().notEmpty(),
  body('section','Check Section').isAlpha().isLength({min: 1,max: 2}).trim().notEmpty(),
  body('number','Check Number').isNumeric().trim().notEmpty(),
  body('parentName','Check Parent Name').trim().notEmpty(),
  body('parentNumber','Check Parent Number').isNumeric().trim().notEmpty(),
  body('teachOrstud','Check Teacher or Student').isAlpha().trim().notEmpty()
], controllerUser.postUser);    



app.post('/updateAccount', isAuth, isTeach,[
  body('regno','Reg. No. should be (min 12)').isLength({min: 12}).isAlphanumeric().trim().notEmpty(),
  body('campus','Check Campus').isAlpha().trim().notEmpty(),
  body('department','Check Department').isAlpha().trim().notEmpty(),
  body('year','Check Year').isNumeric().isLength({min: 1,max: 9}).trim().notEmpty(),
  body('section','Check Section').isAlpha().isLength({min: 1,max: 2}).trim().notEmpty(),
], controllerUser.postUpdateUser); 



app.post('/updateAccount/updating', isAuth, isTeach,[
  body('id').trim().notEmpty(),
  body('name','Check Name').trim().notEmpty(),
  body('email','Check email had @ and . in it').isEmail().normalizeEmail().notEmpty(),
  body('campus','Check Campus').isAlpha().trim().notEmpty(),
  body('department','Check Department').isAlpha().trim().notEmpty(),
  body('year','Check Year').isNumeric().trim().notEmpty(),
  body('section','Check Section').isAlpha().trim().notEmpty(),
  body('number','Check Number').isNumeric().trim().notEmpty(),
  body('parentName','Check Parent Name').trim().notEmpty(),
  body('parentNumber','Check Parent Number').isNumeric().trim().notEmpty()
], controllerUser.postUpdatingUser);

app.post('/createtest', isAuth, isTeach,[
  body('date','Check Date').isDate().trim().notEmpty(),
  body('time','Check Time').trim().notEmpty(),
  body('subname','Check Subject Name').trim().notEmpty(),
  body('subcode','Check Subject Code').isAlphanumeric().trim().notEmpty(),
  body('sets','Check Set').isNumeric().trim().notEmpty(),
  body('duriation','Check Duriation').isNumeric().trim().notEmpty(),
  body('partaqu','Check Part A Question').isNumeric().trim().notEmpty(), 
  body('partamark','Check Part A Mark').isNumeric().trim().notEmpty(),
  body('partbqu','Check Part B Question').isNumeric().trim().notEmpty(),
  body('partbmark','Check Part B Mark').isNumeric().trim().notEmpty(),
  body('total','Check Total').isNumeric().trim().notEmpty(),
  body('partAtime','Check Part A Time').isNumeric().trim().notEmpty()
], controllerCreateQuest.postcreateTest);

app.post('/createtest/question', isAuth, isTeach,[
  body('staff','Something went Wrong').trim().notEmpty(),
], controllerCreateQuest.postCreateQuest);  

app.post('/updatequestion/questId', isAuth, isTeach, controllerCreateQuest.postViUpQuest);


app.post('/s',  isAuth, controllerOther.postAnswerofStud);


app.post('/qqq',  isAuth,(req,res,next)=>{ 
  console.log(req.body);
  res.redirect('/tests');
});
 



 
  
app.get('/ee', (req,res,next)=>{ 
  let dateString = "22-10-2021";
let dateParts = dateString.split("-");
const date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0], 9, 0);

 
  const examtime = new Date("August 04, 2021 10:00:00").getTime();
const currtime = new Date().getTime(); 
const gap = examtime - currtime ;   
const userId = req.session.user._id;
const usereg = req.session.user.regNo; 
  examQuestion.findOne({ subjectCode:'asasasa111' }).then((questions)=>{
    // console.log(questions); 
    Users.findOne({_id: userId, regNo: usereg}).then((userfou)=>{  
      let answed = userfou.tests.findIndex(element => element.subjectCode === 'asasasa111');
      if (answed > -1) {
        answed =  userfou.tests[answed].Answer; 
        let quans = questions.setA.map((x)=>{
             for(let i=0; i < answed.length; i++){
               if(x.Q === answed[i].Q){
                  return answed[i];
               } else { 
                 // this soud be emty
               }
             }
        });
        console.log(quans[2]);
        res.render('exam', { time : gap , questions: questions , room: 'hi' , user: "user", answed : quans });
      } else {
        
      }
    
     }).catch((err)=>{ console.log(err) });
  }).catch((err)=>{
    console.log(err);
  });
});








// (req, res, next) => {
//   const examQ = req.body.studSubjectCode;  
//   let answer = Object.keys(req.body); 
//   console.log(req.body);
//   examQuestion.findOne({subjectCode: examQ}).then((qustFounded)=>{

//     if(qustFounded){
  

//     answer = answer.filter(word => word.includes(examQ)); 
//     if (answer.length === 1){
  
//     const user = req.session.user._id;
//     const userFindReg = req.session.user.regNo;
//     Users.findOne({_id: user, regNo: userFindReg}).then((stud)=>{
//       if(stud){
//         const testslist = stud.tests;
//         const found = testslist.findIndex(element => element.subjectCode === examQ);
//         if(found > -1){
//           console.log(stud.tests[found].Answer);
//           const ansupda = stud.tests[found].Answer.findIndex(element => element.Q === answer[0]);
//            if (ansupda > -1) {
//             Users.findOneAndUpdate({ _id: user, regNo: userFindReg},
//                { $set: { "tests.$[ele].Answer.$[anele].ans": req.body[answer[0]]}},
//                { arrayFilters: [ { "ele.subjectCode": examQ }, { "anele.Q": answer[0] } ] })           
//               .then(doc => {
//               return res.json({status: 'OKSucc'});
          
//             }).catch(err => {
//               return res.json({status: '0000000'});
//             });
             
//            } else {
//             Users.findOneAndUpdate({ _id: user, regNo: userFindReg ,"tests._id": stud.tests[found]._id },{ $push: { "tests.$.Answer": {Q: answer[0],  ans:req.body[answer[0]]}}}).then((reu)=>{      
//               console.log(answer[0], req.body[answer[0]]);
//               return res.json({status: 'OKSucc'});
//             }).catch((err)=>{
//               return res.json({status: '0000000'});
//               console.log(err);
//             });
//            }
//         } else { 
//           return res.json({status: '0000000'});
//         }
//       } else {
//         return res.json({status: '0000000'});
//       }
  
//      }).catch((err)=>{
//       return res.json({status: '0000000'});
//     });
  
//   } else {
//     return res.json({status: '0000000'});
//   }
// }else {
//   return res.json({status: '0000000'}); 
// }
//   }).catch((err)=>{
//     return res.json({status: '0000000'});
//   })

// }); 


app.get('/token', function(request, response) {
  const { identity } = request.query;
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { ttl: MAX_ALLOWED_SESSION_DURATION }
  );
  token.identity = identity;
  const grant = new VideoGrant();
  token.addGrant(grant);
  response.send(token.toJwt());
});
 



app.use((req,res,next)=>{
  res.status(404).render('error');
});

app.use('/errorOccur',(req,res,next)=>{
  res.status(500).render('error');
});









// app.get('/precheck', isAuth, isTeach, controllerOther.getPrecheck);
 
// app.get('/testdetails', isAuth, isTeach, controllerOther.getTestdetails);

// app.get('/', (request, response) => {
//   response.redirect(`/qutart/room?roomName=room&name=ji`);
// });

// app.get('/qutart/:room', (req,res,next)=>{
//   const teachorstud = req.session.user.teachOrstud;
//   console.log(teachorstud);
//   if (teachorstud === 'teacher') {

//     const username = req.query.name;
//     res.render('teach',{ user: `teach-${username}`, room: req.query.roomName });
//   } else {
    
// const examtime = new Date("june 27, 2021 16:37:00").getTime();
// const currtime = new Date().getTime();
// const gap = examtime - currtime ; 
// const room = req.query.roomName;
// const user = req.session.user.name;

// examQuestion.findOne({ subjectCode:'qwaswq' }).then((questions)=>{
//   res.render('stud', { time : gap , questions: questions , room: room , user: user });
// }).catch((err)=>{
//   console.log(err);
// });
// }
  
// });


// app.get('/sdd', (req,res,next)=>{
//   let dateString = "22-10-2021";
// let dateParts = dateString.split("-");
// const date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0], 9, 0);

 
//   const examtime = new Date("june 27, 2021 16:37:00").getTime();
// const currtime = new Date().getTime();
// const gap = examtime - currtime ;   
// const userId = req.session.user._id;
// const usereg = req.session.user.regNo; 
//   examQuestion.findOne({ subjectCode:'asasasa111' }).then((questions)=>{
//     // console.log(questions); 
//     Users.findOne({_id: userId, regNo: usereg}).then((userfou)=>{ 
//       let answed = userfou.tests.findIndex(element => element.subjectCode === 'asasasa111');
//       if (answed > -1) {
//         answed =  userfou.tests[answed].Answer;
//         let quans = questions.setA.map((x)=>{
//              for(let i=0; i < answed.length; i++){
//                if(x.Q === answed[i].Q){
//                   return answed[i];
//                } else { 
//                  // this soud be emty
//                }
//              }
//         });
//         console.log(quans[2]);
//         res.render('exam', { time : gap , questions: questions , room: 'hi' , user: "user", answed : quans });
//       } else {
        
//       }
    
//      }).catch((err)=>{ console.log(err) });
//   }).catch((err)=>{
//     console.log(err);
//   });
// });












mongoose.connect('mongodb+srv://vignesh:VickySanjay2022@cluster0.x3zgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false

}).then((result)=>{
  server.listen(port,()=>{
    console.log('Express server running on *:' + port);
  });
}).catch((error)=>{
  console.log(error);  
});
