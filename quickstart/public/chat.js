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

function outputmessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span class='msg-user'>${message.username}</span><span class='msg-time'>${message.time}</span><div class='msg-text'>${message.text.replace(/</g,"&lt;")}</div>`; 
    document.querySelector('.chat-container').append(div);
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
