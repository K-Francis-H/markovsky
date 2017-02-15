   function State(){
      var NOTE_COUNT = 12;
      var noteCounts = [];
      var noteProbs = [];
      var noteTotal = 0;

      var noteDelays = []; //need bucket for each note, then pull one at random
      var noteDurations = [];//need bucket for each note, then pull one at random
      var noteOctaves = [];
   
      //initialize
      for(var i=0; i < NOTE_COUNT; i++){
            noteCounts[i] = 0;
            noteProbs[i]  = 0;
            noteDelays[i] = new Bucket(); //TODO concern for equally likely - need a normal distribution for any possible duration...
            noteDurations[i] = new Bucket();
            noteOctaves[i] = new Bucket();
      }

      this.addNote = function(note){
         //change note name to index
         //use index to add duration and delay to buckets
         //noteDelays[index] = note.delay;
         //noteDurations[index] = note.duration;

         noteTotal++;
         noteCounts[note.index]++;
         console.log(noteCounts);
         console.log(noteTotal);

         noteDurations[note.index].put(note.duration);
         noteDelays[note.index].put(note.delay);
         noteOctaves[note.index].put(note.octave);
         console.log(noteDurations);
         console.log(noteDelays);

         //recompute probailities
         for(var i=0; i < NOTE_COUNT; i++){
            noteProbs[i] = noteCounts[i] / noteTotal;
         }
         console.log(noteProbs);
      }

      this.getNote = function(){
         var chance = Math.random();
         var index = 0;
         var sum = 0;
         var note;
         //select note based on probabilities
         console.log(noteProbs);
         console.log(chance);
         while(chance > sum){
            sum += noteProbs[index++];
         }
         index--; //we passed the right one on last iteration
         console.log("index: "+index);
         //randomly select from time buckets
         var duration = noteDurations[index].pick();
         var delay = noteDelays[index].pick();
         var octave = noteOctaves[index].pick();
         console.log(noteDurations[0]);
         console.log(noteDurations[index]);

         //TODO need to expand set of states dramatically to iinclude all octave 0-8
         var n = new Note(index, octave, duration, delay);//octave set to static
         console.log(n); 
         return n;

      }
   }//end State def
