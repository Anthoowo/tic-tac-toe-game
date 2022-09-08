let selectedPlayer, started = false;

const view = {
  displayWin: function(player){
    document.querySelector("h1").innerHTML = "player " + player + " wins"
  },
  displayScore: function(element,winCount){
    document.querySelector(".score-"+ element).innerHTML = element +": "+ winCount;
  },
  displayPlayer: function(div,currentPlayer){
   document.querySelector(".box-"+ div).classList.add(currentPlayer);
  },
  buttonAnnimation: function(div){
    let box = document.querySelector(".box-"+ div);
    box.classList.add("pressed");
    setTimeout(function(){box.classList.remove("pressed")}, 200)
  },
  displayMessage: function(message){
    document.querySelector("h1").innerHTML = message;
  }
}
const model = {
  winCount1:0,
  winCount2:0,
  playerCount: 0,
  possiblePlayers: ['X', 'O'],
  gridLength: 9,
  playerNo: 2,
  availableSlot: [],
  input: [[0,0,0],
          [0,0,0],
          [0,0,0]],
  checkHorizontal: function(player){
    for (let i = 0; i < this.input.length; i++) {
      let row = this.input[i];
      //row = row.reduce((total,currentkey) => total + currentkey);
      row = row[0] + row[1] + row[2];
      if(row === player){
      return true;
      break
      }
    }
    return false
  },
  checkVertical: function(player){
    let countStart = 0,countMid = 0, countEnd = 0;
    for (let i = 0; i < this.input.length; i++) {
      countStart+= this.input[i][0];
      countMid+= this.input[i][1];
      countEnd += this.input[i][2];
    }
    if(countStart=== player || countMid=== player || countEnd === player){
      return true
    }
     return false
  },
  checkDiagonal: function(player){
    let countRight= 0, countLeft = 0;
    for (let i = 0, end =2; i < this.input.length; i++) {
      countRight += this.input[i][i];
      countLeft += this.input[i][end-i];
    }
    if(countRight=== player || countLeft === player){
      return true
    }
    return false
  },
  reset: function(){
    started = true;
    for (var i = 0; i < model.gridLength; i++) {
      document.querySelectorAll(".box")[i].classList.remove('X');
        document.querySelectorAll(".box")[i].classList.remove('O');
      }
    model.playerCount = 0;
    model.input=  [[0,0,0],[0,0,0],[0,0,0]];
    model.availableSlot = [];
    view.displayMessage('welcome');
}
}
const controller = {
  parseInput: function(input){
    if(started){
      if(model.playerCount % 2 !== 0){
        view.displayPlayer(input,selectedPlayer);
         model.availableSlot.push("booked");
         if(input<3){model.input[0][input]= 1}
         else if(input<6){model.input[1][input-3] = 1}
         else {model.input[2][input-6] = 1}
         if(model.checkDiagonal(3) || model.checkHorizontal(3) || model.checkVertical(3)){
           model.winCount1++;
           view.displayWin(selectedPlayer);
           view.displayScore(selectedPlayer,model.winCount1);
           started= false;
         }
         else if (model.availableSlot.length === 9) {
           view.displayMessage("it's a draw <br> reset in a sec ");
           setTimeout(()=> model.reset(), 5000)
         }

       }
       else{
       let player2 = selectedPlayer === model.possiblePlayers[0] ? model.possiblePlayers[1]: model.possiblePlayers[0];
       view.displayPlayer(input,player2);
         model.availableSlot.push( "booked");
         if(input<3){model.input[0][input]= 10}
         else if(input<6){model.input[1][input-3] = 10}
         else {model.input[2][input-6] = 10}
         if(model.checkDiagonal(30) || model.checkHorizontal(30) || model.checkVertical(30)){
           started = false;
           model.winCount2++;
           view.displayWin(player2);
           view.displayScore(player2,model.winCount2);

          // setTimeout(()=> model.reset(), 6000)
        }
         else if (model.availableSlot.length === 9) {
           view.displayMessage("it's a draw <br> reset in a sec ");
           setTimeout(()=> model.reset(), 5000)
         }
       }
    }
    return
  }
 }

const addEvent = function(eventString){
// grid event listener
   for (var i = 0; i < model.gridLength; i++) {
  document.querySelectorAll(".box")[i].addEventListener(eventString,function(event){
     model.playerCount++;
     let inputNo = event.target.getAttribute("class"),
      inputNoLen = inputNo.length;
      inputNo = inputNo.slice(inputNoLen-1,inputNoLen);
      view.buttonAnnimation(inputNo);
      controller.parseInput(inputNo);
     });
   }
   // button player selection
   for (let i = 0; i < 2; i++) {
     document.querySelectorAll(".button")[i].addEventListener(eventString, (e)=>{
       selectedPlayer = e.target.innerHTML;
       started = true;
       setTimeout(()=> {document.querySelector(".display-msg").remove();
       document.querySelector("#board").classList.remove("blur")},200)
     })
   }
   //  reset button
   document.querySelector('.reset').addEventListener(eventString, ()=>model.reset());
 }
   // mobile and pc events
screen.width< 650? addEvent('touchstart'): addEvent('click');
