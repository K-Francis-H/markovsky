function Bucket(array){
   this.vals = [];
//   if(array !== undefined)//TODO verify that array is actually an array
//      this.vals = array;
//   else
//      this.vals = [];

   Bucket.prototype.pick = function(){
      var index = Math.floor(Math.random() * (this.vals.length) );//TODO check this!
      //console.log("index in Bucket" + index);
      return this.vals[index];
   };

   Bucket.prototype.put = function(value){
      this.vals.push(value);
      //console.log("val put : "+value+" len : "+this.vals.length);
   };
}


