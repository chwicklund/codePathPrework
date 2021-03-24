// Global Constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables 
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound

function patternMake() {
  pattern = [];
  var num = 0;
  for(let j=0;j<=8;j++){
    num = Math.floor(Math.random() * Math.floor(4-1) + 1);
    pattern.push(num);
  }
}

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    patternMake()
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence()
}

function winGame(){
  stopGame();
  alert("Congratulations, You won!");
  clueHoldTime = 1000
  var pattern = [];
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  clueHoldTime = 1000
  var pattern = [];
}

function stopGame(){
    gamePlaying = false;
    clueHoldTime = 1000
    var pattern = [];
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    loseGame();
  }
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  clueHoldTime -= 100
}

// Sound Synthesis Functions
const freqMap = {
  1: 461.6,
  2: 529.6,
  3: 592,
  4: 667.2
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
