const bodycalss = document.getElementsByClassName('qty-opts-save');
const savebtn = document.getElementsByClassName('save-btn');
const qtyForm = document.getElementsByClassName('qtyForm');
const qtyinfo = document.getElementsByClassName('qty-info')[0].children;
const onoffline = document.getElementsByClassName('onl-off')[0];
const csrff = document.getElementsByClassName('csrff');


console.log(qtyForm);
for (let formLoopq = 0; formLoopq < qtyForm.length; formLoopq++) {
  for (let i = 1; i < 5; i++) {
  if (qtyForm[formLoopq].children[i].children[0].checked) {   
        qtyForm[formLoopq].children[5].children[0].style.backgroundColor = 'lightgreen';
      }
    }
}

console.log(qtyForm);

let qtycount = 0;
let onoffstu = 0; // online=0 and offline=1

console.log(bodycalss.length);
console.log(bodycalss);

window.addEventListener('online',function(){
  onoffstu = 0;
  onoffline.children[0].innerText = 'Online';
  onoffline.children[0].style.color = 'green';
  onoffline.children[1].style.backgroundColor = 'lightgreen';
 console.log(onoffline.children[1].style);
});

window.addEventListener('offline',function(){
  onoffstu = 1;
  onoffline.children[0].innerText = 'Offline';
  onoffline.children[0].style.color = 'red';
  onoffline.children[1].style.backgroundColor = 'red';
 console.log(onoffline.children[1].style);
});


for (let j = 0; j < bodycalss.length; j++) {
  bodycalss[j].style.display = 'none';
}
bodycalss[0].style.display = 'block';

function prevbtn() {
  if (onoffstu === 0) {
    if (+timecount[1].innerText < +partADuri) {
      if (qtycount > 0) {
        console.log(qtycount);
        qtycount--;   
        qtyinfo[0].innerText = `QUESTION NO. : ${qtycount + 1} [${+partA + +partB}]`;
        if (qtycount < +partA) {
          qtyinfo[1].innerText = `MARKS - ${partAmark}`;
          qtyinfo[2].innerText = `PART - A[${partA}]`;
        }
        else{
          qtyinfo[1].innerText = `MARKS - ${partBmark}`;
          qtyinfo[2].innerText = `PART - B[${partB}]`;
        }     
        for (let i = 0; i < bodycalss.length; i++) {
          bodycalss[i].style.display = 'none';
        }
        console.log(timecount[1].innerText);
        console.log(qtycount)
        bodycalss[qtycount].style.display = 'block';
      }
    } else{
      if (qtycount < +partA) {
        console.log(qtycount);
        qtycount = +partA;
        console.log(qtycount);
        qtyinfo[0].innerText = `QUESTION NO. : ${qtycount + 1} [${+partA + +partB}]`;
        qtyinfo[1].innerText = `MARKS - ${partBmark}`;
        qtyinfo[2].innerText = `PART - B[${partB}]`;
        for (let i = 0; i < bodycalss.length; i++) {
          bodycalss[i].style.display = 'none';
        }
        bodycalss[+partA ].style.display = 'block';  
    }else{
      if (qtycount > +partA ) {
        console.log(qtycount);
        qtycount--;   
        qtyinfo[0].innerText = `QUESTION NO. : ${qtycount + 1} [${+partA + +partB}]`;
  
        for (let i = 0; i < bodycalss.length; i++) {
          bodycalss[i].style.display = 'none';
        }
        console.log(timecount[1].innerText);
        console.log(qtycount)
        bodycalss[qtycount].style.display = 'block';
      }
    }
    }
  } 
}

function nextbtn() {
  if (onoffstu === 0) {
    if (+timecount[1].innerText < +partADuri) {
      if (qtycount < bodycalss.length - 1) {
        console.log(qtycount);
        qtycount++;
        qtyinfo[0].innerText = `QUESTION NO. : ${qtycount + 1} [${+partA + +partB}]`;
        if (qtycount < +partA) {
          qtyinfo[1].innerText = `MARKS - ${partAmark}`;
          qtyinfo[2].innerText = `PART - A[${partA}]`;
        }
        else{
          qtyinfo[1].innerText = `MARKS - ${partBmark}`;
          qtyinfo[2].innerText = `PART - B[${partB}]`;
        }
        for (let i = 0; i < bodycalss.length; i++) {
          bodycalss[i].style.display = 'none';
        }
       // console.log(timecount[1].innerText);
        console.log(qtycount)
        bodycalss[qtycount].style.display = 'block';
      }   
    } else {
      if (qtycount < +partA) {
          console.log(qtycount);
          qtycount = +partA;
          console.log(qtycount);
          qtyinfo[0].innerText = `QUESTION NO. : ${qtycount + 1} [${+partA + +partB}]`;
          qtyinfo[1].innerText = `MARKS - ${partBmark}`;
          qtyinfo[2].innerText = `PART - B[${partB}]`;
          for (let i = 0; i < bodycalss.length; i++) {
            bodycalss[i].style.display = 'none';
          }
          bodycalss[+partA ].style.display = 'block';  
      } else {
        if (qtycount < bodycalss.length - 1) {
          console.log(qtycount);
          qtycount++;
          qtyinfo[0].innerText = `QUESTION NO. : ${qtycount + 1} [${+partA + +partB}]`;
         
          for (let i = 0; i < bodycalss.length; i++) {
            bodycalss[i].style.display = 'none';
          }
         // console.log(timecount[1].innerText);
          console.log(qtycount)
          bodycalss[qtycount].style.display = 'block';
        }
      }

    } 
  }
}

for (let formLoop = 0; formLoop < qtyForm.length; formLoop++) {
  qtyForm[formLoop].addEventListener('submit', function (e) {
    e.preventDefault();
    let name = qtyForm[formLoop].children[2].children[0].name;
   
        for (let i = 1; i < 5; i++) {
      if (qtyForm[formLoop].children[i].children[0].checked) {
        let answer;
        let choose;
        let csurfname;
        let csurfcode;
        console.log(qtyForm[formLoop]);
        console.log(qtyForm[formLoop].children);
        console.log(qtyForm[formLoop].children[6]);
        csurfname = qtyForm[formLoop].children[6].name;
  
        console.log(csurfname);
        csurfcode = qtyForm[formLoop].children[6].value;
        answer = qtyForm[formLoop].children[i].children[0].value;
        choose =qtyForm[formLoop].children[i].children[0].id;
        
        if (onoffstu === 0) {
        qtyForm[formLoop].children[5].children[0].style.backgroundColor = 'lightgreen';
      fetch('/s', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }, 
      body: `${csurfname}=${csurfcode}&studSubjectCode=${subCode}&${name}=${choose}`,
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data.status);
      if(data.status === "OKSucc"){
        const div = document.createElement('div');
        div.classList.add('succ-fail-msg');
        div.innerText = `Succesfully Saved`; 
        document.querySelector('.msg-info-of-ans').append(div);
        let mesufa = setTimeout(function() {  div.parentNode.removeChild(div);
            clearTimeout(mesufa) }, 4000);

      } else if (data.status === "/tests"){
        window.location.href = data.status;
      }
       else {
        const div = document.createElement('div');
        div.classList.add('succ-fail-msg-f');
        div.innerText = `Failed to Saved`; 
        document.querySelector('.msg-info-of-ans').append(div);
        let mesufa = setTimeout(function() {  div.parentNode.removeChild(div);
            clearTimeout(mesufa) }, 4000);
      }
    
    })
    .catch((error) => {
      const div = document.createElement('div');
      div.classList.add('succ-fail-msg-f');
      div.innerText = `Failed to Saved`; 
      document.querySelector('.msg-info-of-ans').append(div);
      let mesufa = setTimeout(function() {  div.parentNode.removeChild(div);
          clearTimeout(mesufa) }, 4000);
    });
  } 
      }
    } 
  });
}





 