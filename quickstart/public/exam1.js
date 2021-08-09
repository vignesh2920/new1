let warn = 0;
let warnfun;
let starCont;
const warniarea = document.getElementsByClassName('war-mod-bg');
const warnicont = document.getElementsByClassName('war-mod-2')[0];
const warnitexxt = document.getElementsByClassName('war-mod-3')[0];
const windowhight = +window.screen.height;
const windowwidth = +window.screen.width;
let wriExam = 0;



document.addEventListener('visibilitychange', () => {
  const msgs = document.getElementById('msg');
      msgs.value = `-SC-${username}`
      document.getElementsByClassName('chat-btn')[0].click();
      warniarea[0].style.display = 'grid';
    warnfun = setInterval(function () {
    
    if (starCont !== 0) {
      let during = Date.now();
      let times = Math.floor((+during - +starCont) / 1000);
    warnicont.textContent = times;
    }
   
  }, 1000);  
});





  function fullsc() {
    warn = 0;
    warniarea[0].style.display = 'none';
    warnicont.textContent = 0;
    document.documentElement.requestFullscreen().catch((e) => {
      console.log(e);
    });
  }

  function warning(val) {

    if (warn === 0 && val !== 0) {
      warn = val;
      starCont = Date.now();
    }
  }


  document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
      clearInterval(warnfun);
      warn = 0;
      starCont = 0;
      warnicont.textContent = 0;
      warning(0);
    } else {
      warning(1);
    }
  });
  



  window.onresize = function () {
    if (windowwidth === +window.innerWidth) {
      clearInterval(warnfun);
    }
  };













function toExammode() {
    maincont[0].style.display = 'none';
    maincont[1].style.display = 'flex';
    console.log(+timecount[1].innerText);
    if (+timecount[1].innerText > 13) {
      qtycount = +partA;
    console.log(qtycount);
    qtyinfo[0].innerText = `QUESTION NO. : ${qtycount + 1} [${+partA + +partB}]`;
    qtyinfo[1].innerText = `MARKS - ${partBmark}`;
    qtyinfo[2].innerText = `PART - B[${partB}]`;
    for (let i = 0; i < bodycalss.length; i++) {
      bodycalss[i].style.display = 'none';
    }
    bodycalss[+partA ].style.display = 'block';  
    }
    wriExam = 1;
    fullsc();
  }


   function countdown() {
    
     const second = 1000;
     const minute = second * 60;
     const hour = minute * 60;
     const day = hour * 24;

    // const textday = Math.floor( gap / day ) ;
    // const texthour = Math.floor(( gap % day ) / hour );
     const textminute = Math.floor(( gap % hour ) / minute );
     const textsecond = Math.floor(( gap % minute ) / second );

     if(wriExam === 1){

     if (+windowwidth > 1000) {

      if ((windowwidth * 0.94) > window.outerWidth  || ((windowhight * 0.94) > window.outerHeight) ){

        const msgs = document.getElementById('msg');
       msgs.value = `-SS-${username}`
       document.getElementsByClassName('chat-btn')[0].click();  
       warniarea[0].style.display = 'grid';
      warnfun = setInterval(function () {
      
      if (starCont !== 0) {
        let during = Date.now();
        let times = Math.floor((+during - +starCont) / 1000);
      warnicont.textContent = times;
      }
     
    }, 1000);    
    
     }
       
     } else {

      if (window.screen.width !== window.outerWidth || ((window.screen.height * 0.84) > window.outerHeight) ){
        console.log(window.screen.width , window.outerWidth);
        console.log("1sq");
        const msgs = document.getElementById('msg');
       msgs.value = `-SS-${username}`
       document.getElementsByClassName('chat-btn')[0].click();  
       warniarea[0].style.display = 'grid';
      warnfun = setInterval(function () {
      
      if (starCont !== 0) {
        let during = Date.now();
        let times = Math.floor((+during - +starCont) / 1000);
      warnicont.textContent = times;
      }
     
    }, 1000);   
     }
     }
    
/////
     if(!document.fullscreenElement) {
      warning(1);
    }

    if (warn > 0) {
      warnitexxt.textContent = "Pleace move to test mode";
        if (warn === 40) {
         const msgs = document.getElementById('msg');
         msgs.value = `-SS-${username}`
         document.getElementsByClassName('chat-btn')[0].click();      
         }
  
       if(warn === 30){
        }
  
       if(warn === 50){
            const msgs = document.getElementById('msg');
          msgs.value = `-SC-${username}`
          document.getElementsByClassName('chat-btn')[0].click();
          }
  
        if (+warnicont.textContent > 10) {
          console.log('feeeaa')
            const msgs = document.getElementById('msg');
    msgs.value = `-C-${username}`
     document.getElementsByClassName('chat-btn')[0].click();
       
  
      }
  
        warniarea[0].style.display = 'grid';
        warnfun = setInterval(function () {
        
        if (starCont !== 0) {
          let during = Date.now();
          let times = Math.floor((+during - +starCont) / 1000);
        warnicont.textContent = times;
        }
       
      }, 1000);
  
       }

       }




     if (gap < 0) {
       starttime = gap * -1;

       timecount[0].innerText = Math.floor(( starttime % day ) / hour );
       timecount[1].innerText = Math.floor(( starttime % hour ) / minute );
       timecount[2].innerText = Math.floor(( starttime % minute ) / second );

       stopandstart[0].style.display = 'none';
       stopandstart[1].style.display = 'block';

       if (starttime > 3600000) {
       clearInterval(timeeamdur);
       window.location.href = "/tests"; 
       } 
     }
     if (gap > 0) {
     timetostart[0].innerText = textminute;
     timetostart[1].innerText = textsecond;
     }

     gap = gap - second ;
   }

   let timeeamdur = setInterval(countdown,1000); 


