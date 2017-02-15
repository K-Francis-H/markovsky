//TODO way to load JSON State profiles so that composers may be saved

//TODO create evolving Markov chain --> every played note is run back through to change internal state

function Markovsky(){
   //need array of states c-b 12 notes
   //each state has an array of edges evenly distributed at first or set to zero...
   //and a count of how many transistions for each note leaving a state
   var inputSequence = [];


   var currentState = null;

   var states = [];
   for(var i=0; i < 12; i++)
      states[i] = new State();

   //TODO evolve music from an equally likely setup for certain states -- have to make random time sigs... could just make in divisions of second 1/16, 1/8, 1/4, 1/2, 1
 
   


         
         

   //three transition types - note frequency, note duration, note delay
   //TODO
   //compute frequency from note, octave, c0 freq - discrete data
   //compute duration as the time from key press to key release - finite distribution
   //compute delay as time from key press of current note to key press of next note - finite distribution

   //need a current state initialized to null but set from first input   





   //TODO make public
   Markovsky.prototype.inputNote = function(note){
      //if first note initialize state
      if(currentState === null)
         currentState = states[note.index];
      
      //then add to state's stats
      currentState.addNote(note);
      currentState = states[note.index];
   }

   Markovsky.prototype.genSequence = function(length){
     //return currentState;
      var genNote = null;
      var outputSequence = [];
      
      for(var i=0; i < length; i++){

         genNote = currentState.getNote();
         outputSequence[i] = genNote;
         currentState = states[genNote.index];
      }
      //console.log(outputSequence);
      return outputSequence;
   }

   //input function
   //takes in time from last press/lift - may be null or zero
   //takes in time of note (liftTime - pressTime)
   //takes in note value

   //TODO take in chords and other higher order info...

   //createSequence function
   //input duration in seconds of sequence
   //uses current probabilities to create a sequence of notes with durations associated with each
   //constructs timeout function chain



}
