function PianoRoll(temperament, middleATuning){
   PianoRoll.EQUAL_TEMPERAMENT = 0;
   PianoRoll.JUST_TEMPERAMENT = 1;
   //PianoRoll.NUM_OCTAVES = 8;
   var audioCtx = new AudioContext();
   //1 octave for now
   var keys = new Array();
   //keys['c0']
   var c0Freq = 16.35;

   var rootRatios = new Array();
   if(temperament === PianoRoll.EQUAL_TEMPERAMENT){
                                //KEY NOTE
      rootRatios[0] = 1;       //A   C 
      rootRatios[1] = 1.0595;  //W   C#
      rootRatios[2] = 1.1225;  //S   D
      rootRatios[3] = 1.1892;  //E   D#
      rootRatios[4] = 1.2599;  //D   E
      rootRatios[5] = 1.3348;  //F   F
      rootRatios[6] = 1.4142;  //T   F#
      rootRatios[7] = 1.4983;  //G   G
      rootRatios[8] = 1.5874;  //Y   G#
      rootRatios[9] = 1.6818;  //H   A
      rootRatios[10] = 1.7818;  //U   A#
      rootRatios[11] = 1.8897;  //J   B
   }
   else{//just tempered
      rootRatios[0] = 1;             //A   C 
      rootRatios[1] = 16/15;         //W   C#
      rootRatios[2] = 9/8;           //S   D
      rootRatios[3] = 6/5;           //E   D#
      rootRatios[4] = 5/4;           //D   E
      rootRatios[5] = 4/3;           //F   F
      rootRatios[6] = Math.sqrt(2);  //T   F#
      rootRatios[7] = 3/2;           //G   G
      rootRatios[8] = 8/5;           //Y   G#
      rootRatios[9] = 5/3;           //H   A
      rootRatios[10] = 7/4;           //U   A#
      rootRatios[11] = 15/8;          //J   B
   }


   var keyCodeToNote = new Array();
                               //KEY NOTE
      keyCodeToNote[65] = 0;   //A   C 
      keyCodeToNote[87] = 1;   //W   C#
      keyCodeToNote[83] = 2;   //S   D
      keyCodeToNote[69] = 3;   //E   D#
      keyCodeToNote[68] = 4;   //D   E
      keyCodeToNote[70] = 5;   //F   F
      keyCodeToNote[84] = 6;   //T   F#
      keyCodeToNote[71] = 7;   //G   G
      keyCodeToNote[89] = 8;   //Y   G#
      keyCodeToNote[72] = 9;   //H   A
      keyCodeToNote[85] = 10;  //U   A#
      keyCodeToNote[74] = 11;  //J   B

   //list of c frequencies c0 - c8
   //list of equal temperament ratios
   //list of just temperament ratios
   //generate octave(s) from c frequency (equal temperament, just temperament options)

   var activeKeys = new Array(12*8 + 1); //97, hashtable for actively playing keys

/*    
    W E   T Y U      O P
   A S D F G H J    K L ; ...

     119   101       116   121   117
   97   115   100 102   103   104   106

    # #   # # #  
   C D E F G A B 
*/

//possible hash function --> just take note val 0-12 *octave

  PianoRoll.prototype.play = function(note, octave){

     //check if note is already playing, if so exit and do not overwrite
     if( activeKeys[octave*8 + note] != undefined || activeKeys[octave*8 + note] != null){
        return;
     }
      
     var osc = audioCtx.createOscillator();
     //maybe include gain as local not sure if must be created each time

     osc.type = "triangle"; //make configurable

     //frequency = base frequency (c0) * 2^octave * noteRatio (for notes other than c, at c, noteRatio = 1)
     osc.frequency.value = c0Freq * Math.pow(2,octave) * rootRatios[note];//noteRatio;

     //TODO maybe include pitch slider
     //osc.frequency.linearRampToValueAtTime(freq+3, audioCtx.currentTime+0.5);

     osc.connect(audioCtx.destination);
     osc.start();


     activeKeys[octave*8 + note] = osc;
      
  }

  PianoRoll.prototype.stop = function(note, octave){
     var noteRatio = rootRatios[note];
     var freq = c0Freq * Math.pow(2,octave) * rootRatios[note];

     //TODO have to check frequency value in order to avoid 

   //  console.log("2index = "+Math.floor(freq) % activeKeys.length);
   //  /*var osc = */activeKeys[Math.floor(freq) % activeKeys.length].stop();
   //  activeKeys[Math.floor(freq) % activeKeys.length] = null;
     //osc.stop();
     //osc = null; //should nullify table entry as well (references same object)
     activeKeys[octave*8 + note].stop();
     activeKeys[octave*8 + note] = null;
  }
}

PianoRoll.keyCodeToNote = function(keyCode){
      switch(keyCode){        //KEY NOTE
         case 65: return 0;   //A   C
         case 87: return 1;   //W   C#
         case 83: return 2;   //S   D
         case 69: return 3;   //E   D#
         case 68: return 4;   //D   E
         case 70: return 5;   //F   F
         case 84: return 6;   //T   F#
         case 71: return 7;   //G   G
         case 89: return 8;   //Y   G#
         case 72: return 9;   //H   A
         case 85: return 10;  //U   A#
         case 74: return 11;  //J   B
         case 75: return 0;   //K   C  + octave
         case 79: return 1;   //O   C# + octave
         case 76: return 2;   //L   D  + octave
         case 80: return 3;   //P   D# + octave
         case 59: return 4;   //;   E  + octave
         default:
            console.error("ERROR: input "+keyCode+" is not valid, returning null value");
            return null;
   }
}

PianoRoll.indexToRootRatio = function(index){
      var rootRatios = [];     //KEY NOTE
      rootRatios[0] = 1;       //A   C 
      rootRatios[1] = 1.0595;  //W   C#
      rootRatios[2] = 1.1225;  //S   D
      rootRatios[3] = 1.1892;  //E   D#
      rootRatios[4] = 1.2599;  //D   E
      rootRatios[5] = 1.3348;  //F   F
      rootRatios[6] = 1.4142;  //T   F#
      rootRatios[7] = 1.4983;  //G   G
      rootRatios[8] = 1.5874;  //Y   G#
      rootRatios[9] = 1.6818;  //H   A
      rootRatios[10] = 1.7818;  //U   A#
      rootRatios[11] = 1.8897;  //J   B
      return rootRatios[index];
}



