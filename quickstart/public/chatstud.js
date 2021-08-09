const chatForm = document.getElementById('chat-form');
const chatt = document.querySelector('.chat-container');
let chatlength = 1;
let closeed = 0;

const socket1 = io();

socket1.emit('joinroom',{ username , room });
socket1.on('message', (message)=>{
    outputmessage(message);
    chatt.scrollTop = chatt.scrollHeight;
});

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket1.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

// if (+warnicont.textContent > 5) {
//   const msg = document.getElementById('msg');
//   msg.value = `-${username}`
//   document.getElementById('chat-form').submit();
//     }





mainmaincont.style.display = 'none';
hiddddd.style.display = 'block';


function outputmessage(message){


        let msgUser = message.username; 
        let testmsg =  message.text.split(' ');   
        let usermsg =  msgUser.split('-'); 
        if(message.text.charAt(0) === "-"){
      
        }
         else if(testmsg[0] === '+' && testmsg[1]=== username && usermsg[0] === 'teach'){
               mainmaincont.style.display = 'none';
               hiddddd.style.display = 'block';
          }
  
        else  if(testmsg[0] === '-' && testmsg[1]=== username && usermsg[0] === 'teach'){
              mainmaincont.style.display = 'block';
               hiddddd.style.display = 'none';
          }

          else  if(testmsg[0] === '=' && testmsg[1]=== username && usermsg[0] === 'teach'){  // specking to student
            const participants = document.getElementById('participants').children;
            for (let i = 0; i < participants.length; i++) {
                if (participants[i].dataset.identity.substring(0,4) === 'teac' ) {
                    participants[i].style.display = 'none';
                    participants[i].children[1].muted = false;
                    participants[i].children[0].muted = false; 
                  }
            }  
          }
          else  if(testmsg[0] === 'X' && testmsg[1]=== username && usermsg[0] === 'teach'){  // muteing to student
            const participants = document.getElementById('participants').children;
            for (let i = 0; i < participants.length; i++) {
                if (participants[i].dataset.identity.substring(0,4) === 'teac' ) {
                    participants[i].style.display = 'none';
                    participants[i].children[1].muted = true;
                    participants[i].children[0].muted = true; 
                  }
            }
          } 
          else  if(testmsg[0] === 'X' || testmsg[0] === '=' || testmsg[0] === '+' || testmsg[0] === '-' || message.text.charAt(0) === "-" || message.username === "Srm bot"){ 
              
          } 
        else {
            const div = document.createElement('div');
            div.classList.add('message');
            div.innerHTML = `<span class='msg-user'>${message.username}</span><span class='msg-time'>${message.time}</span><div class='msg-text'>${message.text.replace(/</g,"&lt;")}</div>`; 
            document.querySelector('.chat-container').append(div);
        }
     



}




setInterval(function (){
    let msgText = document.getElementsByClassName('msg-text'); 

    chatlength = msgText.length;
    
    // for(let i = 0 ; i < msgText.length ; i++){
    //   let testmsg =  msgText[i].innerText.split(' ');   
    //     if(testmsg[0] === 'allow' && testmsg[1]=== username){
    //         roomName.style.display = 'none';
    //     }
    // }
},2000);
