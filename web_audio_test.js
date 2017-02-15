glo=null;
window.onload = function(){

    var piano = new PianoRoll(PianoRoll.EQUAL_TEMPERAMENT);
    document.addEventListener( 'keydown', keyDown);
    document.addEventListener( 'keyup',  keyUp);

    //Note tracking variables for Markovsky
    var timePressed = null;
    var secondPressTime = null;
    var timeReleased = null;
    var duration = 0;
    var delay = 0;

    var composer = new Markovsky();

    var keyEvents = [];
    var lastKeyPressed = null;

    //set up piano visuals
    var canvas = document.getElementById("piano");
    var ctx   = canvas.getContext("2d");
    ctx.fillColor = "#000";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    var isKeyPressed = new Array(12);
    //white keys 0-6 c,d,e,f,g,a,b
    //black keys 7-11 c#,d#,f#,g#,a#
    for(var i=0; i < isKeyPressed.length; i++)
       isKeyPressed[i] = false;
    setInterval(drawKeyBoard, 1000/30);
/*    isKeyPressed.c  = false;
    isKeyPressed.c# = false;
    isKeyPressed.d  = false;
    isKeyPressed.d# = false;
    isKeyPressed.e  = false;
    isKeyPressed.f  = false;
    isKeyPressed.f# = false;
    isKeyPressed.g  = false;
    isKeyPressed.g# = false;
    isKeyPressed.a  = false;
    isKeyPressed.a# = false;
    isKeyPressed.b  = false;
 */   
 /*  document.getElementById("test").onclick = function(){
      var ctx = new AudioContext();
      var osc1 = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var osc3 = ctx.createOscillator();
      var gain = ctx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(ctx.destination);
      console.log(gain)
console.log(ctx.destination);

      osc1.type = "sawtooth";
      osc1.frequency.value = 440;
      osc2.type = "sawtooth";
      osc2.frequency.value = 523.25;
      osc2.type = "sawtooth";
      osc2.frequency.value = 659.25;
      console.log(osc2.frequency.value);
      osc1.start();
      //osc2.start();
      //osc3.start();
  }*/
  canvas.onclick = function(event){
     alert(event); //TODO 
  }

  canvas.ontouch = function(event){

  }

  document.getElementById("get-audio-file").onclick = function(){
      var sequence = composer.genSequence(200);
      var out = JSON.stringify({ audio : sequence});
      var blob = new Blob([out], {'type' : 'text/json'});
      var a = document.getElementById("download");
      a.href = URL.createObjectURL(blob);
      a.click();
      //window.location.href = URL.createObjectURL(blob);
  };

  function keyDown(event){//TODO continually fires event must store for long period, duration is incorrect
      if(event.repeat)
         return;

/*      if(timePressed === null){
         timePressed = new Date().getTime();
      }else{
         var tmp = new Date().getTime();
         delay = tmp - timePressed;
         timePressed = tmp;
      }
*/
      if(lastKeyPressed === null){
         console.log("lastKeyPressed === null");
         keyEvents[event.keyCode] = new Object();
         keyEvents[event.keyCode].timePressed = new Date().getTime();
         keyEvents[event.keyCode].delay = 0;
         lastKeyPressed = event.keyCode;
      }
      else if(keyEvents[event.keyCode] === undefined){
         console.log("keyEvents[event.keyCode] === undefined");
         keyEvents[event.keyCode] = new Object();
         keyEvents[event.keyCode].timePressed = new Date().getTime();
         keyEvents[event.keyCode].delay = keyEvents[event.keyCode].timePressed - keyEvents[lastKeyPressed].timePressed;
         lastKeyPressed = event.keyCode;
     }
     else{
         console.log("else");
         var tmp = new Date().getTime();
         keyEvents[event.keyCode].delay = tmp - keyEvents[lastKeyPressed].timePressed;
         keyEvents[event.keyCode].timePressed = tmp;
         lastKeyPressed = event.keyCode;
     }


      var octave = 4;//get from document input element

      switch(event.keyCode){
         case 75: //K 
         case 79: //O
         case 76: //L
         case 80: //P
         case 59: //;
            octave++; break;
         default:
            break;        
      }
      piano.play(PianoRoll.keyCodeToNote(event.keyCode), octave);

      //TODO gonna be buggy
      var index = PianoRoll.keyCodeToNote(event.keyCode);
      switch(index){
         case 0: isKeyPressed[0] = true; break; 
         case 1: isKeyPressed[7] = true; break;
         case 2: isKeyPressed[1] = true; break;
         case 3: isKeyPressed[8] = true; break;
         case 4: isKeyPressed[2] = true; break;
         case 5: isKeyPressed[3] = true; break;
         case 6: isKeyPressed[9] = true; break;
         case 7: isKeyPressed[4] = true; break;
         case 8: isKeyPressed[10]= true; break;
         case 9: isKeyPressed[5] = true; break;
         case 10:isKeyPressed[11] = true;break;
         case 11:isKeyPressed[6] = true; break;
      }

      
  }

  function keyUp(event){//TODO delay shared among several notes...
     timeReleased = new Date().getTime();
     duration = timeReleased - keyEvents[event.keyCode].timePressed;
     // piano.stop(event.keyCode,4);

      var octave = 4;//get from document element

      switch(event.keyCode){
         case 75: //K 
         case 79: //O
         case 76: //L
         case 80: //P
         case 59: //;
            console.log("played : "+event.keyCode);
            octave++;
            console.log(octave);
         default:
               break;      
      }
      piano.stop(PianoRoll.keyCodeToNote(event.keyCode), octave);

      console.log("duration : "+duration/1000);
      console.log("delay    : "+(keyEvents[event.keyCode].delay)/1000);
      //TODO create not send to Markovsky
      composer.inputNote(new Note(PianoRoll.keyCodeToNote(event.keyCode), octave, duration, keyEvents[event.keyCode].delay) ); 

      var index = PianoRoll.keyCodeToNote(event.keyCode);
      switch(index){
         case 0: isKeyPressed[0] = false; break; 
         case 1: isKeyPressed[7] = false; break;
         case 2: isKeyPressed[1] = false; break;
         case 3: isKeyPressed[8] = false; break;
         case 4: isKeyPressed[2] = false; break;
         case 5: isKeyPressed[3] = false; break;
         case 6: isKeyPressed[9] = false; break;
         case 7: isKeyPressed[4] = false; break;
         case 8: isKeyPressed[10]= false; break;
         case 9: isKeyPressed[5] = false; break;
         case 10:isKeyPressed[11] = false;break;
         case 11:isKeyPressed[6] = false; break;
      }
  }

  document.getElementById("composer").onclick = function(){
     var sequence = composer.genSequence(200);//300
     playSequence(sequence);
  }

  function drawKeyBoard(){
    var WHITE_KEY_LEN = 300;
    var WHITE_KEY_WIDTH = 100;//canvas.width/7; //prev 100
    var SPACING = 5;

    var BLACK_KEY_OFFSET = 75;
    var BLACK_KEY_LEN = 200;
    var BLACK_KEY_WIDTH = 50;//WHITE_KEY_WIDTH/2; //prev 50;

     ctx.font = "30px Arial";
     //draw 7 white keys
     var xpos = 0;
     var ypos = 0;
     for(var i=0; i < 7; i++){
        if(isKeyPressed[i])
           ctx.fillStyle = "#aaa";
        else
           ctx.fillStyle = "#eee";

        if(i === 0){
           ctx.fillRect(0, 0, WHITE_KEY_WIDTH, WHITE_KEY_LEN);
           //now label our key, i===0 is always a
           ctx.fillStyle = "#000";
           ctx.fillText("A", WHITE_KEY_WIDTH/2 - 15, WHITE_KEY_LEN * 4/5);
        }
        else{
           ctx.fillRect(i*(WHITE_KEY_WIDTH+SPACING), 0, WHITE_KEY_WIDTH, WHITE_KEY_LEN);
           ctx.fillStyle = "#000";
           var text = "";
           switch(i){
              case 1 : text="S"; break;
              case 2 : text="D"; break;
              case 3 : text="F"; break;
              case 4 : text="G"; break;
              case 5 : text="H"; break;
              case 6 : text="J"; break;
           }
           ctx.fillText(text, i*(WHITE_KEY_WIDTH+SPACING) + WHITE_KEY_WIDTH/2 - 15, WHITE_KEY_LEN * 4/5);
        }
     }

     //draw 5 black keys
     for(var i=7; i < 12; i++){
        if(isKeyPressed[i])
           ctx.fillStyle = "#aaa";
        else
           ctx.fillStyle = "#000";
 
        if(i === 7){
           ctx.fillRect(BLACK_KEY_OFFSET, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);
           ctx.fillStyle = "#fff";
           ctx.fillText("W", BLACK_KEY_OFFSET + BLACK_KEY_WIDTH/2 - 15, BLACK_KEY_LEN * 4/5);
        }
        if(i === 8){
           ctx.fillRect(2*(BLACK_KEY_OFFSET+SPACING)+25, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);
           ctx.fillStyle = "#fff";
           ctx.fillText("E", 2*(BLACK_KEY_OFFSET+SPACING)+25 + BLACK_KEY_WIDTH/2 - 15, BLACK_KEY_LEN * 4/5);
        }
        //if(i > 8)
        //   ctx.fillRect( (4+i-9)*(BLACK_KEY_OFFSET+SPACING)+75, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);
        if(i === 9){
           ctx.fillRect(4*(BLACK_KEY_OFFSET+SPACING)+75, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);
           ctx.fillStyle = "#fff";
           ctx.fillText("T", 4*(BLACK_KEY_OFFSET+SPACING)+75 + BLACK_KEY_WIDTH/2 - 15, BLACK_KEY_LEN * 4/5);
        }
        if(i === 10){
           ctx.fillRect(5*(BLACK_KEY_OFFSET+SPACING)+100, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);
           ctx.fillStyle = "#fff";
           ctx.fillText("Y", 5*(BLACK_KEY_OFFSET+SPACING)+100 + BLACK_KEY_WIDTH/2 - 15, BLACK_KEY_LEN * 4/5);
        }
        if(i === 11){
           ctx.fillRect(6*(BLACK_KEY_OFFSET+SPACING)+125, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);
           ctx.fillStyle = "#fff";
           ctx.fillText("U", 6*(BLACK_KEY_OFFSET+SPACING)+125 + BLACK_KEY_WIDTH/2 - 15, BLACK_KEY_LEN * 4/5);
        }
     } 
  }

   function playSequence(seq){//not the best...
   var audioCtx = new AudioContext();
   var index = 0;

   var chunks = [];
   var dest = audioCtx.createMediaStreamDestination();

   /*navigator.mediaDevices.getUserMedia({audio : true}, function(){
	   var mediaRecorder = new MediaRecorder(dest.stream);
	   mediaRecorder.ondataavailable = function(evt){
	     chunks.push(evt.data);
	   };
	   mediaRecorder.onstop = function(evt){
	      var blob = new Blob(chunks, {'type' : 'audio/ogg; codecss=opus'});
	      window.location.href = URL.createObjectURL(blob);
	   };

	   console.log("mr state: "+mediaRecorder.state);
   }, function(){console.log("error getting userMedia");});*/
   //var osc = audioCtx.createOscillator();
   //osc.type = "triangle";

   playSeq(seq[index], seq[++index]);
   function playSeq(curNote, nextNote){
      setTimeout(function(){
         var osc = audioCtx.createOscillator();
         osc.type = "triangle";
         osc.frequency.value = curNote.frequency;

         osc.connect(audioCtx.destination);

         
         
         //osc.connect(dest);

         osc.start();

         //feed note back into markov chain
         composer.inputNote(curNote);
         
         //press note
      switch(curNote.index){
         case 0: isKeyPressed[0] = true; break; 
         case 1: isKeyPressed[7] = true; break;
         case 2: isKeyPressed[1] = true; break;
         case 3: isKeyPressed[8] = true; break;
         case 4: isKeyPressed[2] = true; break;
         case 5: isKeyPressed[3] = true; break;
         case 6: isKeyPressed[9] = true; break;
         case 7: isKeyPressed[4] = true; break;
         case 8: isKeyPressed[10]= true; break;
         case 9: isKeyPressed[5] = true; break;
         case 10:isKeyPressed[11] = true;break;
         case 11:isKeyPressed[6] = true; break;
      }


            setTimeout(function(){
               
               osc.stop();
               //if(nextNote === undefined || nextNote === null || !nextNote){
               //   mediaRecorder.stop();
               //   mediaRecorder.requestData();
               //}

      //release key
      switch(curNote.index){
         case 0: isKeyPressed[0] = false; break; 
         case 1: isKeyPressed[7] = false; break;
         case 2: isKeyPressed[1] = false; break;
         case 3: isKeyPressed[8] = false; break;
         case 4: isKeyPressed[2] = false; break;
         case 5: isKeyPressed[3] = false; break;
         case 6: isKeyPressed[9] = false; break;
         case 7: isKeyPressed[4] = false; break;
         case 8: isKeyPressed[10]= false; break;
         case 9: isKeyPressed[5] = false; break;
         case 10:isKeyPressed[11] = false;break;
         case 11:isKeyPressed[6] = false; break;
      }

      
            }, curNote.duration);//+nextNote.delay); //TODO not right but sounds better
         
         
         playSeq(nextNote, seq[++index]);//set up next note
      }, curNote.delay);
   }
}



}

/*key setup
var WHITE_KEY_LEN = 300;
var WHITE_KEY_WIDTH = 100;

var BLACK_KEY_LEN = 200;
var BLACK_KEY_WIDTH = 50;

ctx.fillStyle = "#fde";
ctx.fillRect(0,0,WHITE_KEY_WIDTH,WHITE_KEY_LEN);

ctx.fillRect(105, 0, WHITE_KEY_WIDTH,WHITE_KEY_LEN);

ctx.fillStyle = "#000";

ctx.fillRect(75, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);

ctx.fillRect(175, 0, BLACK_KEY_WIDTH, BLACK_KEY_LEN);
*/


