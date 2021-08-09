const Rooms = require('../model/room');
const Users = require('../model/user');

const { validationResult } = require('express-validator');


exports.postRoom = async (req, res, next) => {
    const errormm = validationResult(req);
    console.log(errormm.array());
  if(!errormm.isEmpty()){
   req.flash('error', errormm.array()[0].msg);
        return res.redirect(`/createroom`);
  } else {
 const all = Object.keys(req.body);
 let stud = [];
 const roomId = req.body.RoomID;
 const created = req.body.createstaff;
    const room = await Rooms.findOne({ roomId: roomId }); 
    if (room) {
        console.log('Room ID already Exists');
        req.flash('error','Room ID already Exists')
        return res.redirect('/createroom');
    } else {
        const teacher = req.body.teacher;
        const teachId = await Users.findOne({ regNo : teacher });
        if(teachId.teachOrstud === 'teacher'){ 
            for(let i = 1; i < 50;i++){ 
                let ele = all.filter(word => word.includes(`stud-${i}-`));
                if(req.body[ele[0]].length > 11 ){
                   try{
                       let studreg = await Users.findOne({ regNo: req.body[ele[0]] })
                       if (studreg) {
                           let newobj = {
                                num : ele[0],
                                RegNo: req.body[ele[0]],
                            }
                            stud.push(newobj);
                       } else {
                           req.flash('error', 'Reg.No not Found');
                           return res.redirect(`/createroom`);
                       }
                     } catch(err) {
                        res.redirect('/errorOccur');
                     }
                }  else {
                    let newobj = {
                        num : ele[0], 
                        RegNo: 'non',
                    }
                    stud.push(newobj);
                }
            }
            const room = new Rooms({
                roomId: roomId, 
                createdBy: created,
                teacher: teacher,
                students: stud,
             });          
            room.save().then((room)=>{
                req.flash('succes', `Successfully Created`);
               return res.redirect('/home');
             }).catch((err)=>{
                res.redirect('/errorOccur');
             });
        } else {
            req.flash('error','Teacher Not Found');
            return res.redirect('/createroom');
        }  
    }
}
};

exports.getRoom = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('room',{errMess: message});
};   

exports.getViewRoom = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Rooms.find().then((room)=>{
        const rooms = room;
        res.render('viewroom',{ roomlist: rooms, errMess: message });
    }).catch((err)=>{
        res.redirect('/errorOccur');
    });   
};    

 

exports.postUpViRoom = async (req, res, next) => {
    const roomid = req.body.RoomID;
    const id = req.body.id ;
    const errormm = validationResult(req);
    console.log(errormm.array());
  if(!errormm.isEmpty()){
   req.flash('error', errormm.array()[0].msg);
        return res.redirect(`/rooms/${id}`);
  } else {
try {
const finded = await Rooms.findOne({_id:id,roomId:roomid}); 
     if (finded) { 
        const todo = req.body.todo;
        if (todo === 'save') {  
            const teacher = req.body.teacher;
            const created = req.body.createstaff;
            try {
                const findteach = await Users.findOne({ regNo: teacher });

                if (findteach) {
                    if (findteach.teachOrstud === 'teacher') {       
                 const all = Object.keys(req.body);
                 let stud = [];
                 for(let i = 1; i < 50;i++){
                  let ele = all.filter(word => word.includes(`stud-${i}-`));
                  try {
                    if(req.body[ele[0]].length > 11 ){
                        let studreg = await Users.findOne({ regNo: req.body[ele[0]] });
                        if (studreg) {
                           let newobj = {
                                num : ele[0],
                                RegNo: req.body[ele[0]],
                            }
                            stud.push(newobj);
                       } else { 
                           req.flash('error', 'Reg.No not Found'); 
                           return res.redirect(`/rooms/${id}/${roomid}`);
                       }
                    } else {
                        let newobj = {
                            num : ele[0],
                            RegNo: 'non',
                        }
                        stud.push(newobj);
                    }
                 
                } catch(err) {
                    res.redirect('/errorOccur');
                }
              }
              console.log(id);
               const saveCrete = await Rooms.findOneAndUpdate({_id:id,roomId:roomid},{ teacher: teacher, createstaff: created, students: stud });
              if (saveCrete) {
                req.flash('succes', `Successfully Updated`);
                  return res.redirect('/home');
              } else {
              } 
            } else {
                req.flash('error', 'Teacher not Found'); 
                return res.redirect(`/rooms/${id}/${roomid}`);
            }
                } else {

                    req.flash('error', 'Teacher not Found'); 
                    return res.redirect(`/rooms/${id}/${roomid}`);
                }
            } catch(err){
                console.log(err);
                req.flash('error', 'Teacher not Found'); 
                return res.redirect(`/rooms/${id}/${roomid}`);
            }
         } else {
             Rooms.findOneAndDelete({_id:id,roomId:roomid}).then((result)=>{
                req.flash('succes', `Successfully Deleted`);
                res.redirect('/home');      
          }).catch((err)=>{
            res.redirect('/errorOccur');
          });       
         }
     } else {
        req.flash('error', 'Room not found Create a new');
        return res.redirect(`/createroom`);
     }
    } catch (err) {
        res.redirect('/errorOccur');
    }
// catch
  }
}; 



exports.getUpViRoom = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const roomId = req.params.roomid;
    const rrid = req.params.id;
    Rooms.findOne({ _id:roomId,roomId:rrid}).then((room)=>{
        if(room){ 
            const roomdet = room;
          return  res.render('updateroom',{ roominfo: roomdet, errMess: message });
        }else{
            req.flash('error', 'RoomID not Found'); 
            return res.redirect(`/viewroom`);
        } 
    }).catch((err)=>{
        res.redirect('/errorOccur');
    });
};