var Chain = require('../models/chain');
var Q = require('q');

// Function to get chain info
module.exports.getChainInfo = function () {
    var defered = Q.defer();
    var projection = {
        "difficulty": true,
        "hashRate": true,
        "avgBlockTime": true
    }
    // Chain.find().sort( { _id : -1 } ).limit(1)(function(err, chain){
    //     if(err){
    //         console.log("Error in Chain Dao",err);
    //         defered.reject(err);
    //     }else{
    //         console.log(chain[0]);
    //         defered.resolve(chain[0]);
    //     }
    // });
    Chain.find({}, projection, { sort: { $natural: -1 }, limit: 1 }).then(function (results) {
 //       console.log("length", results.length);
        defered.resolve(results[0]);
    }, function (err) {
 //       console.error(err);
       defered.reject(err);
    });
    return defered.promise;
}