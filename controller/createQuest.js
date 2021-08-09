
const Questions = require('../model/question');

const flash = require('connect-flash');
const { validationResult } = require('express-validator');



exports.postCreateQuest = (req, res, next) => { // /createtest/question

    const allfiles = Object.keys(req.files);
    const allQus = Object.keys(req.body);
    const subcode = req.body.subcode;

    Questions.findOne({ subjectCode: subcode }).then((existsques)=>{
      if (existsques) {
        req.flash('error','Question Code Already Exists');
        res.redirect('/createtest');
      } else {
        
        let Aques,Bques,Cques,Dques,Eques;
        let AImgs,BImgs,CImgs,DImgs,EImgs;
        let Aqu=[];
        let Bqu=[];
        let Cqu=[];
        let Dqu=[];
        let Equ=[];
        
        for (let i = 0; i < 5; i++) {
          if (i===0) {
            Aques = allQus.filter(word => word.includes(`${subcode}-A`));
            AImgs = allfiles.filter(word => word.includes(`Qimg-1`));

            if( 0 < Aques.length){
            for (let j = 0; j < (Aques.length / 5) ; j++) {
              let imgg1,imgg2,imgg3,imgg4,imgg5;
              let element = Aques.filter(word => word.includes(`${subcode}-A-${j + 1}-`));
              let eleImgs = AImgs.filter(word => word.includes(`Qimg-1-${j + 1}-`));
              let obj ={};   
                if (`${eleImgs.includes(`Qimg-1-${j+1}-1`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-1`))[0];
                  imgg1 = req.files[item][0].path;
                } 
                if (`${eleImgs.includes(`Qimg-1-${j+1}-2`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-2`))[0];
                  imgg2 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-1-${j+1}-3`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-3`))[0];
                  imgg3 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-1-${j+1}-4`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-4`))[0];
                  imgg4 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-1-${j+1}-5`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-5`))[0];
                  imgg5 = req.files[item][0].path;
                }

                let newobj = {  
                    Q :element[0], contentQ: req.body[element[0]], imgQ: imgg1,
                    a :element[1], contenta: req.body[element[1]], imga: imgg2,
                    b :element[2], contentb: req.body[element[2]], imgb: imgg3,
                    c :element[3], contentc: req.body[element[3]], imgc: imgg4,
                    d :element[4], contentd: req.body[element[4]], imgd: imgg5,
                };
                obj = {...obj,...newobj};
              Aqu.push(obj);
              obj = {};
            }
          } 
          }
          if (i===1) {
            Bques = allQus.filter(word => word.includes(`${subcode}-B`));
            BImgs = allfiles.filter(word => word.includes(`Qimg-2`));
            
            if( 0 < Bques.length){
              for (let j = 0; j < (Bques.length / 5) ; j++) {
                let imgg1,imgg2,imgg3,imgg4,imgg5;
                let element = Bques.filter(word => word.includes(`${subcode}-B-${j + 1}-`));
                let eleImgs = BImgs.filter(word => word.includes(`Qimg-2-${j + 1}-`));
                let obj ={};   
                if (`${eleImgs.includes(`Qimg-2-${j+1}-1`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-1`))[0];
                  imgg1 = req.files[item][0].path;
                } 
                if (`${eleImgs.includes(`Qimg-2-${j+1}-2`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-2`))[0];
                  imgg2 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-2-${j+1}-3`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-3`))[0];
                  imgg3 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-2-${j+1}-4`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-4`))[0];
                  imgg4 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-2-${j+1}-5`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-5`))[0];
                  imgg5 = req.files[item][0].path;
                }
                 let newobj = {  
                     Q :element[0], contentQ: req.body[element[0]], imgQ: imgg1,
                     a :element[1], contenta: req.body[element[1]], imga: imgg2,
                     b :element[2], contentb: req.body[element[2]], imgb: imgg3,
                     c :element[3], contentc: req.body[element[3]], imgc: imgg4,
                     d :element[4], contentd: req.body[element[4]], imgd: imgg5,
                 };
                  obj = {...obj,...newobj};
                Bqu.push(obj);
                obj = {};
              }
            }
          }
          if (i===2) {
            Cques = allQus.filter(word => word.includes(`${subcode}-C`));
            CImgs = allfiles.filter(word => word.includes(`Qimg-3`));

            if( 0 < Cques.length){

              for (let j = 0; j < (Cques.length / 5) ; j++) {
                let imgg1,imgg2,imgg3,imgg4,imgg5;
                let element = Cques.filter(word => word.includes(`${subcode}-C-${j + 1}-`));
                let eleImgs = CImgs.filter(word => word.includes(`Qimg-3-${j + 1}-`));
                let obj ={};   
                if (`${eleImgs.includes(`Qimg-3-${j+1}-1`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-1`))[0];
                  imgg1 = req.files[item][0].path;
                } 
                if (`${eleImgs.includes(`Qimg-3-${j+1}-2`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-2`))[0];
                  imgg2 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-3-${j+1}-3`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-3`))[0];
                  imgg3 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-3-${j+1}-4`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-4`))[0];
                  imgg4 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-3-${j+1}-5`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-5`))[0];
                  imgg5 = req.files[item][0].path;
                }
                 let newobj = {  
                     Q :element[0], contentQ: req.body[element[0]], imgQ: imgg1,
                     a :element[1], contenta: req.body[element[1]], imga: imgg2,
                     b :element[2], contentb: req.body[element[2]], imgb: imgg3,
                     c :element[3], contentc: req.body[element[3]], imgc: imgg4,
                     d :element[4], contentd: req.body[element[4]], imgd: imgg5,
                 };
                  obj = {...obj,...newobj};
                Cqu.push(obj);
                obj = {};
              }
            }
          }
          if (i===3) {
            Dques = allQus.filter(word => word.includes(`${subcode}-D`));
            DImgs = allfiles.filter(word => word.includes(`Qimg-4`));

            if( 0 < Dques.length){
              for (let j = 0; j < (Dques.length / 5) ; j++) {
                let imgg1,imgg2,imgg3,imgg4,imgg5;
                let element = Dques.filter(word => word.includes(`${subcode}-D-${j + 1}-`));
                let eleImgs = DImgs.filter(word => word.includes(`Qimg-4-${j + 1}-`));
                let obj ={};   
                if (`${eleImgs.includes(`Qimg-4-${j+1}-1`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-1`))[0];
                  imgg1 = req.files[item][0].path;
                } 
                if (`${eleImgs.includes(`Qimg-4-${j+1}-2`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-2`))[0];
                  imgg2 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-4-${j+1}-3`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-3`))[0];
                  imgg3 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-4-${j+1}-4`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-4`))[0];
                  imgg4 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-4-${j+1}-5`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-5`))[0];
                  imgg5 = req.files[item][0].path;
                }
                 let newobj = {  
                     Q :element[0], contentQ: req.body[element[0]], imgQ: imgg1,
                     a :element[1], contenta: req.body[element[1]], imga: imgg2,
                     b :element[2], contentb: req.body[element[2]], imgb: imgg3,
                     c :element[3], contentc: req.body[element[3]], imgc: imgg4,
                     d :element[4], contentd: req.body[element[4]], imgd: imgg5,
                 };
                  obj = {...obj,...newobj};
                Dqu.push(obj);
                obj = {};
              }
            }
          }
          if (i===4) {
            Eques = allQus.filter(word => word.includes(`${subcode}-E`));
            EImgs = allfiles.filter(word => word.includes(`Qimg-5`));

            if( 0 < Eques.length){
              for (let j = 0; j < (Eques.length / 5) ; j++) {
                let imgg1,imgg2,imgg3,imgg4,imgg5;
                let element = Eques.filter(word => word.includes(`${subcode}-E-${j + 1}-`));
                let eleImgs = EImgs.filter(word => word.includes(`Qimg-5-${j + 1}-`));
                let obj ={};   
                if (`${eleImgs.includes(`Qimg-5-${j+1}-1`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-1`))[0];
                  imgg1 = req.files[item][0].path;
                } 
                if (`${eleImgs.includes(`Qimg-5-${j+1}-2`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-2`))[0];
                  imgg2 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-5-${j+1}-3`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-3`))[0];
                  imgg3 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-5-${j+1}-4`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-4`))[0];
                  imgg4 = req.files[item][0].path;
                }
                if (`${eleImgs.includes(`Qimg-5-${j+1}-5`)}` === 'true') {
                  let item = eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-5`))[0];
                  imgg5 = req.files[item][0].path;
                }
                 let newobj = {  
                     Q :element[0], contentQ: req.body[element[0]], imgQ: imgg1,
                     a :element[1], contenta: req.body[element[1]], imga: imgg2,
                     b :element[2], contentb: req.body[element[2]], imgb: imgg3,
                     c :element[3], contentc: req.body[element[3]], imgc: imgg4,
                     d :element[4], contentd: req.body[element[4]], imgd: imgg5,
                 };
                  obj = {...obj,...newobj};
                Equ.push(obj);
                obj = {};
              }
            }
          }
          
        }
        let body = req.body;
        const partAtime = body.partAtime;
        const date = body.date;    
        const time = body.time;    
        const subname = body.subname;
        const sets = body.sets;
        const duriation = body.duriation;
        const partaqu = body.partaqu;
        const partamark = body.partamark;
        const partbqu = body.partbqu;
        const partbmark = body.partbmark;
        const staff = body.staff;
        const total = body.total;

        
      const questions = new Questions({
        examDate: date,
        examTime: time,
        subjectName: subname,
        subjectCode: subcode,
        numberOfSets: sets,
        examDuriation: duriation,
        partAQuestion: partaqu,
        partAMark: partamark,
        partAtime: partAtime,
        partBQuestion: partbqu,
        partBMark: partbmark,
        staff: staff,
        total: total,
        setA : Aqu,
        setB : Bqu,
        setC : Cqu,
        setD : Dqu,
        setE : Equ,
    
      });
    
      questions.save().then((result)=>{
        req.flash('succes', `Successfully Created`);
         return  res.redirect('/home');
      }).catch((err)=>{ 
       res.redirect('/errorOccur');
      });

      }
    }).catch((err)=>{
       res.redirect('/errorOccur');
    });


};




exports.getCreateQuest = (req, res, next) => {  // /createtest/:question
   
  if (req.query.date && req.query.time && req.query.subname 
    && req.query.subcode && req.query.sets && req.query.duriation 
    && req.query.partaqu && req.query.partamark && req.query.partbqu 
    && req.query.partbmark && req.query.total && req.query.partatime) {

      const subCode = req.query.subcode;

      Questions.findOne({ subjectCode: subCode }).then((question)=>{
           if (question) {
            req.flash('error','Qusetion Code Already Exist');
             res.redirect('/createtest');
           } else {
      
            return res.render('questioncre',{
              partatime: req.query.partatime,
              date: req.query.date,
              time: req.query.time, 
              subname: req.query.subname,
              subcode: req.query.subcode,
              sets: req.query.sets,
              duriation: req.query.duriation,
              partaqu: req.query.partaqu,
              partamark: req.query.partamark,
              partbqu: req.query.partbqu,
              partbmark: req.query.partbmark,
              total: req.query.total,
              staff: req.session.user._id,
            });
             
           }
      }).catch((err)=>{
        res.redirect('/errorOccur');
      });
  } else{
   return  res.redirect('/createtest');
  }
};




exports.getUpdateQuest = (req, res, next) => { // /updatequestion
  Questions.find().then((quests)=>{
    let questsinfo = [];
     for(let i =0; i < quests.length;i++){
       let newobj = {
         sno: i+1,
         time: `${quests[i].examDate} ${quests[i].examTime}`,
         subjectCode: quests[i].subjectCode,
         subjectName: quests[i].subjectName,
         linkId: quests[i]._id,
       }
       questsinfo.push(newobj);
     }
   
    res.render('updatequest',{ listOfQuest : questsinfo });
  }).catch((err)=>{
    res.redirect('/errorOccur');
  });

}





exports.getViUpQuest = (req, res, next) => {  // /updatequestion/:questid

  const id = req.params.questid;
  const code = req.params.questcode;
  let question;
  Questions.findOne({_id: id, subjectCode: code}).then((quest)=>{
if(quest){
question = quest;
   return res.render('viupquest',{ thequest : question });
} else {
   return res.redirect('/updatequestion');
}
  }).catch((err)=>{
    console.log(err);
    res.redirect('/errorOccur');
  }); 
};



 


exports.postViUpQuest = (req,res,next)=>{  // /updatequestion/questId

const questId = req.body.Id;
const questcode = req.body.subcode;
const saveOrdelete =req.body.saveOrdelete;
if(saveOrdelete === 'save'){
const allQus = Object.keys(req.body);
const subcode = req.body.subcode;

let Aques,Bques,Cques,Dques,Eques;
let Aqu=[];
let Bqu=[];
let Cqu=[];
let Dqu=[];
let Equ=[];


for (let i = 0; i < 5; i++) {
  console.log(i);
  if (i===0) {
    Aques = allQus.filter(word => word.includes(`${subcode}-A`));
    let AImg = allQus.filter(word => word.includes('Qimg-1-'));
 
    if( 0 < Aques.length){
    for (let j = 0; j < (Aques.length / 5) ; j++) {
      let element = Aques.filter(word => word.includes(`${subcode}-A-${j + 1}-`));
      let eleImgs = AImg.filter(word => word.includes(`Qimg-1-${j + 1}-`));
      let obj ={};   
        let newobj = {  
            Q :element[0], contentQ: req.body[element[0]], imgQ: eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-1`))[0],
            a :element[1], contenta: req.body[element[1]], imga: eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-2`))[0],
            b :element[2], contentb: req.body[element[2]], imgb: eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-3`))[0],
            c :element[3], contentc: req.body[element[3]], imgc: eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-4`))[0],
            d :element[4], contentd: req.body[element[4]], imgd: eleImgs.filter(word => word.includes(`Qimg-1-${j + 1}-5`))[0],
        };
        obj = {...obj,...newobj};
      Aqu.push(obj);
      obj = {};
    }
  }
  }
  if (i===1) {
    Bques = allQus.filter(word => word.includes(`${subcode}-B`));
    let BImg = allQus.filter(word => word.includes('Qimg-2-'));
    if( 0 < Bques.length){
      for (let j = 0; j < (Bques.length / 5) ; j++) {
        let element = Bques.filter(word => word.includes(`${subcode}-B-${j + 1}-`));
        let eleImgs = BImg.filter(word => word.includes(`Qimg-2-${j + 1}-`));
        let obj ={};   
          let newobj = {  
            Q :element[0], contentQ: req.body[element[0]], imgQ: eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-1`))[0],
            a :element[1], contenta: req.body[element[1]], imga: eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-2`))[0],
            b :element[2], contentb: req.body[element[2]], imgb: eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-3`))[0],
            c :element[3], contentc: req.body[element[3]], imgc: eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-4`))[0],
            d :element[4], contentd: req.body[element[4]], imgd: eleImgs.filter(word => word.includes(`Qimg-2-${j + 1}-5`))[0],
          };
          obj = {...obj,...newobj};
        Bqu.push(obj);
        obj = {};
      }
    }
  }
  if (i===2) {
    Cques = allQus.filter(word => word.includes(`${subcode}-C`));
    let CImg = allQus.filter(word => word.includes('Qimg-3-'));
    if( 0 < Cques.length){
      for (let j = 0; j < (Cques.length / 5) ; j++) {
        let element = Cques.filter(word => word.includes(`${subcode}-C-${j + 1}-`));
        let eleImgs = CImg.filter(word => word.includes(`Qimg-3-${j + 1}-`));
       
        let obj ={};   
          let newobj = {  
            Q :element[0], contentQ: req.body[element[0]], imgQ: eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-1`))[0],
            a :element[1], contenta: req.body[element[1]], imga: eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-2`))[0],
            b :element[2], contentb: req.body[element[2]], imgb: eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-3`))[0],
            c :element[3], contentc: req.body[element[3]], imgc: eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-4`))[0],
            d :element[4], contentd: req.body[element[4]], imgd: eleImgs.filter(word => word.includes(`Qimg-3-${j + 1}-5`))[0],
          };
          obj = {...obj,...newobj};
        Cqu.push(obj);
        obj = {};
      }
    }
  }
  if (i===3) {
    Dques = allQus.filter(word => word.includes(`${subcode}-D`));
    let DImg = allQus.filter(word => word.includes('Qimg-4-'));
    if( 0 < Dques.length){
      for (let j = 0; j < (Dques.length / 5) ; j++) {
        let element = Dques.filter(word => word.includes(`${subcode}-D-${j + 1}-`));
        let eleImgs = DImg.filter(word => word.includes(`Qimg-4-${j + 1}-`));
      
        let obj ={};   
          let newobj = {  
            Q :element[0], contentQ: req.body[element[0]], imgQ: eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-1`))[0],
            a :element[1], contenta: req.body[element[1]], imga: eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-2`))[0],
            b :element[2], contentb: req.body[element[2]], imgb: eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-3`))[0],
            c :element[3], contentc: req.body[element[3]], imgc: eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-4`))[0],
            d :element[4], contentd: req.body[element[4]], imgd: eleImgs.filter(word => word.includes(`Qimg-4-${j + 1}-5`))[0],
          };
          obj = {...obj,...newobj};
        Dqu.push(obj);
        obj = {};
      }
    }
  }
  if (i===4) {
    Eques = allQus.filter(word => word.includes(`${subcode}-E`));
    let EImg = allQus.filter(word => word.includes('Qimg-5-'));
    if( 0 < Eques.length){
      for (let j = 0; j < (Eques.length / 5) ; j++) {
        let element = Eques.filter(word => word.includes(`${subcode}-E-${j + 1}-`));
        let eleImgs = EImg.filter(word => word.includes(`Qimg-5-${j + 1}-`));
        
        let obj ={};   
          let newobj = {  
            Q :element[0], contentQ: req.body[element[0]], imgQ: eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-1`))[0],
            a :element[1], contenta: req.body[element[1]], imga: eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-2`))[0],
            b :element[2], contentb: req.body[element[2]], imgb: eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-3`))[0],
            c :element[3], contentc: req.body[element[3]], imgc: eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-4`))[0],
            d :element[4], contentd: req.body[element[4]], imgd: eleImgs.filter(word => word.includes(`Qimg-5-${j + 1}-5`))[0],
          };
          obj = {...obj,...newobj};
        Equ.push(obj);
        obj = {};
      }
    }
  }
  
}
console.log(Aqu);
console.log(Bqu);
console.log(Cqu);
console.log(Dqu);
console.log(Equ);

Questions.findOneAndUpdate({_id:questId,subjectCode:questcode},{ setA: Aqu, setB: Bqu, setC: Cqu, setD: Dqu, setE: Equ }).then((result)=>{
  req.flash('succes', `Successfully Updated`);
  return res.redirect('/home');
}).catch((err)=>{
  res.redirect('/errorOccur');
});
         
} else {
  Questions.findOneAndDelete({_id:questId,subjectCode:questcode}).then((result)=>{
    req.flash('succes', `Successfully Deleted`);
    return res.redirect('/home');
  }).catch((err)=>{
    res.redirect('/errorOccur');
  });

} 
};


exports.getcreateTest = (req,res,next)=>{ 
  const staff = req.session.user._id;
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]; 
  } else {
    message = null;
  }
  res.render('createtest',{ userId: staff ,errMess: message});
 };


exports.postcreateTest = (req,res,next)=>{ 
  
  const error = validationResult(req);
       console.log(error.array());

     if(!error.isEmpty()){
      req.flash('error', error.array()[0].msg);
           return res.redirect(`/createtest`);
     } else {

  const date = req.body.date;
  const time = req.body.time;
  const subname = req.body.subname;
  const subcode = req.body.subcode;
  const sets = req.body.sets;
  const duriation = req.body.duriation;
  const partaqu = req.body.partaqu; 
  const partamark = req.body.partamark;
  const partbqu = req.body.partbqu;
  const partbmark = req.body.partbmark;
  const total = req.body.total;
  const partatime = req.body.partAtime;
 

  Questions.findOne({ subjectCode: subcode }).then((quest)=>{
    
    if (quest) {
      req.flash('error','Question Code Already Exist');
      res.redirect('/createtest',);
    } else {
     
      res.redirect(`/createtest/question?date=${date}&time=${time}&subname=${subname}&subcode=${subcode}&sets=${sets}&duriation=${duriation}&partaqu=${partaqu}&partamark=${partamark}&partbqu=${partbqu}&partbmark=${partbmark}&total=${total}&partatime=${partatime}`);
    }
  }).catch((err)=>{
    res.redirect('/errorOccur');
  });
}
 };
