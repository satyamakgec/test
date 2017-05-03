var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ChainSchema = new Schema({
        difficulty   : {type: String,required: true},
		hashRate : {type:Number,required:true},
		avgBlockTime  : {type:Number, required:true}        
    });



	ChainSchema.pre('save',function(next){
		var chain = this;
		console.log("InsideModel",chain);
		Chain.find({"difficulty" : chain.difficulty, "hashRate":chain.hashRate, "avgBlockTime":chain.avgBlockTime }, function (err, sameChain) {
        if (!sameChain.length){
            next();
        }else{                
            console.log("chain exists:");
            next(new Error("not error same chain...doesn't save"));
        }
    });
	   
	});

	

// the schema is useless so far
var Chain = mongoose.model('Chain', ChainSchema);

// make this available to our users in our Node applications
module.exports = Chain;