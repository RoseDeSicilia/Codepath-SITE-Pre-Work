// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
//global variables
var pattern = [];
var patterns = [
  [1, 4, 6, 5, 4, 8, 7, 5], 
  [1, 4, 6, 5, 4, 8, 7, 5, 4, 6, 5, 3, 5, 1],
  [1, 4, 6, 5, 4, 8, 3, 3, 2, 8, 7, 6, 5, 5, 4]
  ];  
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 0.5
var guessCounter = 0;
var totalMistakes;
var countDown;
var timeLeft;

//intro song     
var introSong = new Audio('https://cdn.glitch.global/7351af73-79b7-4644-b3a9-8c98c123ae4c/firstQuidditchGame-intro.mp3?v=1648874138647');
var gameIntroSong;


var myInterval;
var totalTime = 25;
var startTime;

// function gameTimer(){
//   countDown = countDown-1;
//   if(countDown <= -1){
//     clearInterval(timeLeft);
//     stopGame();
//     return;
//   }
//   document.getElementById("timer").innerHTML = "00:00:" + countDown;
// }

// function playIntro() {
//   //document.getElementById("playIntro").play();

// }

// window.addEventListener('load', (event) => {
//   introSong.play();
// });

function selectSong() {
  
  if(gamePlaying === false) {
    pattern = patterns[Math.floor(Math.random()*(4-1))];
  }
}

//   if(idx === 0) {
//     document.getElementById("easyMusic").style.background-color="purple";
//     document.getElementById("mediumMusic").style.background-color="light gray";
//     document.getElementById("insaneMusic").style.background-color="light gray";
//   }
//   else if(idx === 1) {
//     document.getElementById("easyMusic").style.background-color="light gray";
//     document.getElementById("mediumMusic").style.background-color="purple";
//     document.getElementById("insaneMusic").style.background-color="light gray";
//   }
//   else if(idx === 2) {
//     document.getElementById("easyMusic").style.background-color="light gray";
//     document.getElementById("mediumMusic").style.background-color="light gray";
//     document.getElementById("insaneMusic").style.background-color="purple";
//   }


function createPattern() {
    
  if(!gamePlaying) {
      for(let i=0; i < Math.floor((Math.random() * 5))+5; i++) {
      let val = Math.floor((Math.random() * 8) + 1);
      pattern.push(val); 
    }
  
  }

}

function startGame() {
  
  if(pattern.length === 0) {
    selectSong();
  }
  //clearInterval(countDown);
  totalMistakes = 0;
  progress = 0;
  
  var gameIntroSong = new Audio("https://cdn.glitch.global/7351af73-79b7-4644-b3a9-8c98c123ae4c/firstQuidditchGame-gameBegins.mp3?v=1648866138752");
  gameIntroSong.play();
  
  gamePlaying = true;
  
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("points").innerHTML = 
        progress + " : " + totalMistakes;
  setTimeout(() => { playClueSequence(); }, 25000);//delays the playClueSequence by 2 seconds for intro song to play
  //setTimeout(() => { gameTimer(); }, 2900);  //delays countdown by 2.9 seconds
  //playClueSequence()
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("points").innerHTML = "--:--";
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  introSong.pause();
  //clearInterval(timeLeft); 
  
}

function winGame(){
  stopGame();
  alert("Gryffindors Win The Quidditch Cup!");
}

function loseGame(){
  stopGame();
  alert("Game Over! Slytherin wins!");
}

// showing color pattern functions //
function lightButton(btn){
  document.getElementById("btn"+btn).classList.add("active")
  document.getElementById("btn"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("btn"+btn).classList.remove("active")
  document.getElementById("btn"+btn).classList.remove("lit")
}

function showImage(img) {
  document.getElementById("img"+img).classList.remove("hidden")
}

function hideImage(img) {
  document.getElementById("img"+img).classList.add("hidden")
}

// showing color pattern clue function //
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  clearInterval(timeLeft);
  //pattern of button guesses start from zero every time
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    //start timer after clue sequence finished
    clueHoldTime -= 10;
    delay += clueHoldTime; 
    delay += cluePauseTime;
  }
  //timeLeft = setInterval(gameTimer, 1000);
}

function guess(btn){

  
  //game got stopped
  if(!gamePlaying){
    return;
  }
  
  //console.log("user guessed: " + btn);
  document.getElementById("points").innerHTML = progress + " : " + totalMistakes;
  
  //guess matches
  if(btn === pattern[guessCounter]){
    //we've reached the end of all the buttons for this round of the song
    if(guessCounter == progress){
      //we've reached the end all the buttons for this song
      if(progress==pattern.length-1){
        //player wins
        winGame();
      }
      //player continues on to the next round, which has an added button
      else{
        progress++;
        //player advances to next clue
        document.getElementById("points").innerHTML = progress + " : " + totalMistakes;
        playClueSequence();
        //clear timer
      }
    }
    //we have buttons remaining in this round of the song
    else{
      guessCounter++;
    }
  }
  //guess doesnt match
  else {
    
    //player has remaining lives
    if(totalMistakes < 2){
      totalMistakes++;
      document.getElementById("points").innerHTML = progress + " : " + totalMistakes;
      playClueSequence();
    }
    //player is out of lives
    else{
      //stop timer
      loseGame();
    }
  }
  //console.log("user guessed: " + btn);
  //document.getElementById("points").innerHTML = progress + " : " + totalMistakes;
}



//harry potter 
const freqMap = {
  1: 246.94,
  2: 261.63,
  3: 293.66,
  4: 329.63,
  5: 369.99,
  6: 392.00,
  7: 440.00,
  8: 493.88
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

/*****************************************************/
/* Click button with keypress instead of mouse click */
/*****************************************************/

document.addEventListener('keydown', function(event) {
    //btn1 was selected
    if(event.keyCode == 65) {
        startTone(1);
        guess(1);
        lightButton("1");
        showImage(1);
    }
    else if(event.keyCode == 83) {
        startTone(2);
        guess(2);
        lightButton("2");  
        showImage(2);
    }
    else if(event.keyCode == 68) {
        startTone(3);
        guess(3);
        lightButton("3");
        showImage(3);
    }
    else if(event.keyCode == 70) {
        startTone(4);
        guess(4);
        lightButton("4");
        showImage(4);
    }
    else if(event.keyCode == 71) {
        startTone(5);
        guess(5);
        lightButton("5");
        showImage(5);
    }
    else if(event.keyCode == 72) {
        startTone(6);
        guess(6);
        lightButton("6");
        showImage(6);
    }
    else if(event.keyCode == 74) {
        startTone(7);
        guess(7);
        lightButton("7");
        showImage(7);
    }
    else if(event.keyCode == 75) {
        startTone(8);
        guess(8);
        lightButton("8");
        showImage(8);
    }
});
  
document.addEventListener('keyup', function(event) {
    //btn1 was selected
    if(event.keyCode == 65) {
        stopTone(1);
        clearButton("1");
        hideImage(1);
    }
    else if(event.keyCode == 83) {
        stopTone(2);
        clearButton("2");
        hideImage(2);
    }
    else if(event.keyCode == 68) {
        stopTone(3);
        clearButton("3");
        hideImage(3);
    }
    else if(event.keyCode == 70) {
        stopTone(4);
        clearButton("4");
        hideImage(4);
    }
    else if(event.keyCode == 71) {
        stopTone(5);
        clearButton("5");
        hideImage(5);
    }
    else if(event.keyCode == 72) {
        stopTone(6);
        clearButton("6");
        hideImage(6);
    }
    else if(event.keyCode == 74) {
        stopTone(7);
        clearButton("7");
        hideImage(7);
    }
    else if(event.keyCode == 75) {
        stopTone(8);
        clearButton("8");
        hideImage(8);
    }
});





/********************************/

function moveRon(event) {
    var x = event.clientX;
    var y = event.clientY;
    var ron = document.getElementById("ron");
    ron.style.left = x+5+'px';
    ron.style.top = y+5+'px';
}



/****************************
*  Tinkerbell Magic Sparkle *
*(c)2005-13 mf2fm web-design*
*  http://www.mf2fm.com/rv  *
* DON'T EDIT BELOW THIS BOX *
****************************/

var colour="gold";
var sparkles=50;


var sparkle_x=ox=400;
var sparkle_y=oy=300;
var swide=900;
var shigh=600;
var sleft=sdown=0;
var tiny=[];
var star=[];
var starv=[];
var starx=[];
var stary=[];
var tinyx=[];
var tinyy=[];
var tinyv=[];

function initSparkles() { 
  var i, rats, rlef, rdow;
  for (i=0; i<sparkles; i++) {
    rats=createDiv(30, 30);
    rats.style.visibility="hidden";
    rats.style.zIndex="999";
    document.body.appendChild(tiny[i]=rats);
    starv[i]=0;
    tinyv[i]=0;
    rats=createDiv(50, 50);
    rats.style.backgroundColor="transparent";
    rats.style.visibility="hidden";
    rats.style.zIndex="999";
    rlef=createDiv(10, 50);
    rdow=createDiv(50, 10);
    rats.appendChild(rlef);
    rats.appendChild(rdow);
    rlef.style.top="2px";
    rlef.style.left="0px";
    rdow.style.top="0px";
    rdow.style.left="2px";
    document.body.appendChild(star[i]=rats);
  }
  set_width();
  sparkle();
}

function sparkle() {
  var c;
  if (Math.abs(sparkle_x-ox)>1 || Math.abs(sparkle_y-oy)>1) {
    ox=sparkle_x;
    oy=sparkle_y;
    for (c=0; c<sparkles; c++) if (!starv[c]) {
      star[c].style.left=(starx[c]=sparkle_x)+"px";
      star[c].style.top=(stary[c]=sparkle_y+1)+"px";
      star[c].style.height="500px";
      star[c].style.widtht="500px";
      star[c].style.clip="rect(0px, 5px, 5px, 0px)";

      star[c].childNodes[0].style.backgroundColor=star[c].childNodes[1].style.backgroundColor=(colour=="random")?newColour():colour;
      star[c].style.visibility="visible";
      starv[c]=50;
      break;
    }
  }
  for (c=0; c<sparkles; c++) {
    if (starv[c]) update_star(c);
    if (tinyv[c]) update_tiny(c);
  }
  setTimeout(sparkle, 40);
}

function update_star(i) {
  if (--starv[i]==25) star[i].style.clip="rect(1px, 4px, 4px, 1px)";
  if (starv[i]) {
    stary[i]+=1+Math.random()*3;
    starx[i]+=(i%5-2)/5;
    if (stary[i]<shigh+sdown) {
      star[i].style.top=stary[i]+"px";
      star[i].style.left=starx[i]+"px";
    }
    else {
      star[i].style.visibility="hidden";
      starv[i]=0;
      return;
    }
  }
  else {
    tinyv[i]=50;
    tiny[i].style.top=(tinyy[i]=stary[i])+"px";
    tiny[i].style.left=(tinyx[i]=starx[i])+"px";
    tiny[i].style.width="2px";
    tiny[i].style.height="2px";
    tiny[i].style.backgroundColor=star[i].childNodes[0].style.backgroundColor;
    star[i].style.visibility="hidden";
    tiny[i].style.visibility="visible";
  }
}

function update_tiny(i) {
  if (--tinyv[i]==25) {
    tiny[i].style.width="1px";
    tiny[i].style.height="1px";
  }
  if (tinyv[i]) {
    tinyy[i]+=1+Math.random()*3;
    tinyx[i]+=(i%5-2)/5;
    if (tinyy[i]<shigh+sdown) {
      tiny[i].style.top=tinyy[i]+"px";
      tiny[i].style.left=tinyx[i]+"px";
    }
    else {
      tiny[i].style.visibility="hidden";
      tinyv[i]=0;
      return;
    }
  }
  else tiny[i].style.visibility="hidden";
}

document.onmousemove=mouse;
function mouse(e) {
  if (e) {
    sparkle_y=e.pageY;
    sparkle_x=e.pageX;
  }
  else {
    set_scroll();
    sparkle_y=event.y+sdown;
    sparkle_x=event.x+sleft;
  }
}

window.onscroll=set_scroll;
function set_scroll() {
  if (typeof(self.pageYOffset)=='number') {
    sdown=self.pageYOffset;
    sleft=self.pageXOffset;
  }
  else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
    sdown=document.body.scrollTop;
    sleft=document.body.scrollLeft;
  }
  else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
    sleft=document.documentElement.scrollLeft;
    sdown=document.documentElement.scrollTop;
  }
  else {
    sdown=0;
    sleft=0;
  }
}

window.onresize=set_width;
function set_width() {
  var sw_min=999999;
  var sh_min=999999;
  if (document.documentElement && document.documentElement.clientWidth) {
    if (document.documentElement.clientWidth>0) sw_min=document.documentElement.clientWidth;
    if (document.documentElement.clientHeight>0) sh_min=document.documentElement.clientHeight;
  }
  if (typeof(self.innerWidth)=='number' && self.innerWidth) {
    if (self.innerWidth>0 && self.innerWidth<sw_min) sw_min=self.innerWidth;
    if (self.innerHeight>0 && self.innerHeight<sh_min) sh_min=self.innerHeight;
  }
  if (document.body.clientWidth) {
    if (document.body.clientWidth>0 && document.body.clientWidth<sw_min) sw_min=document.body.clientWidth;
    if (document.body.clientHeight>0 && document.body.clientHeight<sh_min) sh_min=document.body.clientHeight;
  }
  if (sw_min==999999 || sh_min==999999) {
    sw_min=800;
    sh_min=600;
  }
  swide=sw_min;
  shigh=sh_min;
}

function createDiv(height, width) {
  var div=document.createElement("div");
  div.style.position="absolute";
  div.style.height=height+"px";
  div.style.width=width+"px";
  div.style.overflow="hidden";
  return (div);
}

function newColour() {
  var c=[];
  c[0]=255;
  c[1]=Math.floor(Math.random()*256);
  c[2]=Math.floor(Math.random()*(256-c[1]/2));
  c.sort(function(){return (0.5 - Math.random());});
  return ("rgb("+c[0]+", "+c[1]+", "+c[2]+")");
}

/*
Flying Butterfly script (By BGAudioDr@aol.com)
Modified slightly/ permission granted to Dynamic Drive to feature script in archive
For full source, visit http://www.dynamicdrive.com
*/

var Ymax=8;                                //MAX # OF PIXEL STEPS IN THE "X" DIRECTION
var Xmax=8;                                //MAX # OF PIXEL STEPS IN THE "Y" DIRECTION
var Tmax=10000;                        //MAX # OF MILLISECONDS BETWEEN PARAMETER CHANGES

//FLOATING IMAGE URLS FOR EACH IMAGE. ADD OR DELETE ENTRIES. KEEP ELEMENT NUMERICAL ORDER STARTING WITH "0" !!

var floatimages=new Array();
//floatimages[0]='http://24.media.tumblr.com/4cab05419bf1de1d33808c3ad2971d49/tumblr_mrai10ffnA1qb14uyo1_250.gif';
floatimages[0] = 'https://cdn.glitch.global/67e0cc6f-db5d-4287-a418-f89165f10662/bludger.png?v=1648616984705';
floatimages[1] = 'https://cdn.glitch.global/67e0cc6f-db5d-4287-a418-f89165f10662/snitch_floating_drawn2.gif?v=1648616642884';
//floatimages[1]='http://www.wilsoninfo.com/butterfly/butterfly-flying-away.gif';
floatimages[2] = 'https://cdn.glitch.global/67e0cc6f-db5d-4287-a418-f89165f10662/bludger.png?v=1648616984705';
//floatimages[2] = 'https://cdn.glitch.global/67e0cc6f-db5d-4287-a418-f89165f10662/snitch_floating_drawn.gif?v=1648615963026';

//*********DO NOT EDIT BELOW***********
var NS4 = (navigator.appName.indexOf("Netscape")>=0 && parseFloat(navigator.appVersion) >= 4 && parseFloat(navigator.appVersion) < 5)? true : false;
var IE4 = (document.all)? true : false;
var NS6 = (parseFloat(navigator.appVersion) >= 5 && navigator.appName.indexOf("Netscape")>=0 )? true: false;
var wind_w, wind_h, t='', IDs=new Array();
for(i=0; i<floatimages.length; i++){
t+=(NS4)?'<layer name="pic'+i+'" visibility="hide" width="10" height="10"><a href="javascript:hidebutterfly()">' : '<div id="pic'+i+'" style="position:absolute; visibility:hidden;width:30px; height:30px"><a href="javascript:hidebutterfly()">';
t+='<img src="'+floatimages[i]+'" name="p'+i+'" border="0">';
t+=(NS4)? '</a></layer>':'</a></div>';
}
document.body.innerHTML = t + document.body.innerHTML;

function moveimage(num){
if(getidleft(num)+IDs[num].W+IDs[num].Xstep >= wind_w+getscrollx())IDs[num].Xdir=false;
if(getidleft(num)-IDs[num].Xstep<=getscrollx())IDs[num].Xdir=true;
if(getidtop(num)+IDs[num].H+IDs[num].Ystep >= wind_h+getscrolly())IDs[num].Ydir=false;
if(getidtop(num)-IDs[num].Ystep<=getscrolly())IDs[num].Ydir=true;
moveidby(num, (IDs[num].Xdir)? IDs[num].Xstep :  -IDs[num].Xstep , (IDs[num].Ydir)?  IDs[num].Ystep:  -IDs[num].Ystep);
}

function getnewprops(num){
IDs[num].Ydir=Math.floor(Math.random()*2)>0;
IDs[num].Xdir=Math.floor(Math.random()*2)>0;
IDs[num].Ystep=Math.ceil(Math.random()*Ymax);
IDs[num].Xstep=Math.ceil(Math.random()*Xmax)
setTimeout('getnewprops('+num+')', Math.floor(Math.random()*Tmax));
}

function getscrollx(){
if(NS4 || NS6)return window.pageXOffset;
if(IE4)return document.body.scrollLeft;
}

function getscrolly(){
if(NS4 || NS6)return window.pageYOffset;
if(IE4)return document.body.scrollTop;
}

function getid(name){
if(NS4)return document.layers[name];
if(IE4)return document.all[name];
if(NS6)return document.getElementById(name);
}

function moveidto(num,x,y){
if(NS4)IDs[num].moveTo(x,y);
if(IE4 || NS6){
IDs[num].style.left=x+'px';
IDs[num].style.top=y+'px';
}}

function getidleft(num){
if(NS4)return IDs[num].left;
if(IE4 || NS6)return parseInt(IDs[num].style.left);
}

function getidtop(num){
if(NS4)return IDs[num].top;
if(IE4 || NS6)return parseInt(IDs[num].style.top);
}

function moveidby(num,dx,dy){
if(NS4)IDs[num].moveBy(dx, dy);
if(IE4 || NS6){
IDs[num].style.left=(getidleft(num)+dx)+'px';
IDs[num].style.top=(getidtop(num)+dy)+'px';
}}

function getwindowwidth(){
if(NS4 || NS6)return window.innerWidth;
if(IE4)return document.body.clientWidth;
}

function getwindowheight(){
if(NS4 || NS6)return window.innerHeight;
if(IE4)return document.body.clientHeight;
}

function init(){
  initSparkles();

wind_w=getwindowwidth();
wind_h=getwindowheight();
for(i=0; i<floatimages.length; i++){
IDs[i]=getid('pic'+i);
if(NS4){
IDs[i].W=IDs[i].document.images["p"+i].width;
IDs[i].H=IDs[i].document.images["p"+i].height;
}
if(NS6 || IE4){
IDs[i].W=document.images["p"+i].width;
IDs[i].H=document.images["p"+i].height;
}
getnewprops(i);
moveidto(i , Math.floor(Math.random()*(wind_w-IDs[i].W)), Math.floor(Math.random()*(wind_h-IDs[i].H)));
if(NS4)IDs[i].visibility = "show";
if(IE4 || NS6)IDs[i].style.visibility = "visible";
startfly=setInterval('moveimage('+i+')',Math.floor(Math.random()*100)+100);
}}

function hidebutterfly(){
for(i=0; i<floatimages.length; i++){
if (IE4)
eval("document.all.pic"+i+".style.visibility='hidden'")
else if (NS6)
document.getElementById("pic"+i).style.visibility='hidden'
else if (NS4)
eval("document.pic"+i+".visibility='hide'")
clearInterval(startfly)
}
}

if (NS4||NS6||IE4){
window.onload=init;
window.onresize=function(){ wind_w=getwindowwidth(); wind_h=getwindowheight(); }
}

