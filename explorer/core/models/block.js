var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BlockSchema = new Schema({
        difficulty   : {type: String,required: true},
        hash : {type:String,required:true},
        number  : {type:Number, required:true,index: { unique: true }},
        size  : {type:Number, required:true},
        timestamp  : {type:Number, required:true},
        miner:{type:String, required:true},
        gasLimit:{type:Number, required:true},
        gasUsed:{type:Number, required:true},
        transactions:[{}]
    //    blocks: [{ } ]
    });



	BlockSchema.pre('save',function(next){
		var block = this;
      //  Block.remove();
		console.log("InsideModel",block);
		next();
	   
	});

	

// the schema is useless so far
var Block = mongoose.model('Block', BlockSchema);

// make this available to our users in our Node applications
module.exports = Block;
