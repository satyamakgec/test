var Service = require('./../services/blockchain_service');
var provider = require('./../provider/httpProvider');
var Q = require('q');
var DbService = require('./../services/db_service');

module.exports.getTxData = function (txId, result) {
    var defered = Q.defer();
    provider.web3().then(function (web3) {
        if (txId !== undefined) {
            var number = web3.eth.blockNumber;
            var blockHash = '';
            var blockNumber = '';
            var conf;
            var timestamp;
            console.log("result in getTxdata", result);
            if (result.blockHash !== undefined) {
                blockHash = result.blockHash;
            }
            else {
                blockHash = 'pending';
            }
            // if(result.blockNumber!==undefined){
            //     blockNumber = result.blockNumber;
            //       conf = number - blockNumber;
            //     if(conf===0){
            //         conf='unconfirmed'; //TODO change color button when unconfirmed... 
            //     }
            //     console.log("result.blockNumber",result.blockNumber);
            //      web3.eth.getBlock(result.blockNumber,function(err,info){
            //          if(!err){
            //          console.log("info",info.timestamp);
            //            timestamp = info.timestamp;
            //          }else{
            //              console.log(err);
            //          }
            //     });
            // }
            // else{
            //     blockNumber ='pending';
            // }
            // var from = result.from;
            // var gas = result.gas;
            // //var gasPrice = result.gasPrice.c[0] + " WEI";
            // var gasPrice = web3.fromWei(result.gasPrice, "ether").toFormat(10) + " ETH";
            // var hash = result.hash;
            // var input = result.input; // that's a string
            // var nonce = result.nonce;
            // var to = result.to;
            // var transactionIndex = result.transactionIndex;
            // //var ethValue = web3.fromWei(result.value[0], "ether"); Newer method but has ""
            // var ethValue = result.value.c[0] / 10000;
            // var txprice = web3.fromWei(result.gas * result.gasPrice, "ether") + " ETH";
            if (result.blockNumber !== undefined) {
                blockNumber = result.blockNumber;
                console.log(blockNumber);
                conf = number - blockNumber;
                if (conf === 0) {
                    conf = 'unconfirmed'; //TODO change color button when unconfirmed... 
                }
                console.log("result.blockNumber", result.blockNumber);
                web3.eth.getBlock(result.blockNumber, function (err, info) {
                    if (!err) {
                        console.log("info", info.timestamp);
                        timestamp = info.timestamp;
                        var data = {
                            "Type": "Tx",
                            "eventId": txId,
                            //"from":from, 
                            // "to":to,
                            "blockHash": blockHash,
                            "blockNumber": blockNumber,
                            "hash": result.transactionHash,
                            // "nonce":nonce,
                            "eventIndex": result.transactionIndex,
                            "conf": conf,
                            "timestamp": timestamp
                        }
                        defered.resolve(data);
                    } else {
                        console.log(err);
                    }
                });

            }
            else {
                blockNumber = 'pending';
                var data = {
                    "Type": "Tx",
                    "eventId": txId,
                    //"from":from, 
                    // "to":to,
                    "blockHash": blockHash,
                    "blockNumber": blockNumber,
                    "hash": result.transactionHash,
                    // "nonce":nonce,
                    "eventIndex": transactionIndex,
                    "conf": conf,
                    "timestamp": timestamp
                }
                defered.resolve(data);
            }
        }

    });
    return defered.promise;
}