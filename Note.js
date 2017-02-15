   function Note(index, octave, duration, delay){
      this.duration = duration;
      this.index = index;
      this.octave = octave;
      console.log("note octave: "+octave);
      this.frequency = 16.35 * Math.pow(2, octave) * PianoRoll.indexToRootRatio(index); //TODO
      console.log("note frequency: "+this.frequency);
      this.delay = delay;
      
      /*play :
         setTimeout(function(){pianoRoll.play(note); setTimeout(function(){pianoRoll.stop(note);}, duration);}, delay)
      */
      
   }
