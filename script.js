function revealEmploymentForm(self) {
  self.style.setProperty('display','none')
  var empForm = document.querySelector("#block-1");
  var title = document.querySelector("#block-0");
  var ap = document.querySelector('#audio-tab > audio');
  ap.play();
  title
    .animate([
      {
        top: "0",
        opacity: "100"
      },
      {
        top: "-50rem",
        opacity: "0"
      }
    ], {duration: 800})
    .onfinish = function() {
      title.style.setProperty("display", "none");
      empForm.style.setProperty("display", "block");
      empForm.animate(
        [
          {
            opacity: "0",
            left: "-500",
            scale: 100,
          },
          {
            opacity: "100",
            left: "0",
            scale: 0
          }
        ],
        { duration: 300, easing: "ease" }
      );
    };
}

function signEmploymentForm(self){
  var thisBlock = document.querySelector("#block-1");
  var signF = document.querySelector("#signField");
  var fName = document.querySelector("#fname_field");
  var lName = document.querySelector("#lname_field");

  if(fName.value == ""){
    fName.classList.add("is-error")
  }
  if(lName.value == ""){
    lName.classList.add("is-error")
  }
  if(fName.value != null && lName.value != null){
    self.style.setProperty('display','none');
    signF.value = fName.value + " " + lName.value;
    
    setTimeout(function(){
      thisBlock.animate([{
        top: '0'
      },{
        top: '-100rem'
      }],{duration:1000, easing:'cubic-bezier(.25,.4,.73,-0.44)'}).onfinish = function(){
        thisBlock.style.setProperty('display','none')
        letter.style.setProperty('display','block')
      }
    },100)
  }
}

function openLetter(self){
  var letter = document.querySelector("#letter");
  var letterTab = document.querySelector("#letter-tab");
  letter.removeAttribute('onclick');
  letter.style.setProperty('overflow','visible')
  letter.animate([{
    transform: 'rotate(0deg)',
  },{
    transform: 'rotate(180deg)',
  }],{duration:800, easing:'ease'}).onfinish = function(){
    letter.style.setProperty('transform','rotate(180deg)')
    letterTab.style.setProperty('display','block')
    console.log('animate letter, ' + letterTab)
    letterTab.animate([{
      borderTopWidth: '0',
    },{
      borderTopWidth: '8rem',
    }],{duration: 200}).onfinish = function(){
      letterTab.style.setProperty('border-top-width','8rem')

    }
  }
}