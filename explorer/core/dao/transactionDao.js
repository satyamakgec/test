var Tx = require('../models/transaction');
var Q = require('q');

module.exports.storeTxs = function (txArray) {
    var defered = Q.defer();
    console.log("Inside dao:", txArray);
    Tx.insertMany(txArray, function (err, txs) {
        if (err) {
            //   console.log("Error in Block Dao",err);
            defered.reject(err);
        } else {
   //         console.log(txs);
            defered.resolve(txs);
        }
    });
    return defered.promise;
}

module.exports.getAllTxs = function () {
    var defered = Q.defer();
    var projection = {
        "address": true,
        "transactionHash": true,
        "data": true,
        "blockNumber": true,
        "logIndex": true,
        "transactionIndex": true,
        "topics": true,
        "blockHash": true
    }
    Tx.find({}, projection, function (err, txs) {
        if (err) {
            console.log("Error in Transaction Dao", err);
            defered.reject(err);
        } else {
    //        console.log(txs);
            defered.resolve(txs);
        }
    });
    return defered.promise;
}

module.exports.getTx = function (tx_id) {
   var defered = Q.defer();
    var projection = {    
       "address": true,
        "transactionHash": true,
        "data": true,
        "blockNumber": true,
        "logIndex": true,
        "transactionIndex": true,
        "topics": true,
        "blockHash": true
    }
    Tx.findOne({"transactionHash":tx_id} , projection , function(err,tx){
        if(err){
            console.log("Error in Consumer Dao",err);
            defered.reject(err);
        }else{
  //          console.log(tx);
            defered.resolve(tx);
        }
    });
   return defered.promise;
}
