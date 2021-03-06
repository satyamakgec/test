
var Q = require('q');
var BigNumber = require('bignumber.js');
var provider = require('./../provider/httpProvider');
var async = require('async');

module.exports.check = function (latest, web3) {
    var defered = Q.defer();
    var blockInfo = {};
    var blockList = [];
    var limit = latest;
    var start = latest - 20;
    //  var limit = 50;
    //    var start = 1;
    var i;
    for (i = start; i <= limit; i++) {
        var blockInfo = web3.eth.getBlock(i);
        //     console.log("blockInfo", blockInfo);
        //    if(blockInfo.transactions[0]!=null){
        var temp = {
            "number": blockInfo.number,
            "hash": blockInfo.hash,
            "difficulty": blockInfo.difficulty,
            "size": blockInfo.size,
            "timestamp": blockInfo.timestamp,
            "miner": blockInfo.miner,
            "gasLimit": blockInfo.gasLimit,
            "gasUsed": blockInfo.gasUsed,
            "transactions": blockInfo.transactions
        }
        blockList.push(temp);

        // blockList.push(blockInfo);
    }

    // }
    //    console.log(blockList);
    if (i == limit + 1) {
        //     console.log(i);
        defered.resolve(blockList);
        //     console.log("data");
    } if (i == start) {
        defered.reject("error");
    }
    return defered.promise;
}

module.exports.getAllTx = function (startBlock, latest, web3) {
    var defered = Q.defer();
    var txInfo = {};
    var txList = [];
    var limit = latest;
    var start =  startBlock +1;
    var i;
   // console.log("get txs called");
    for (i = start; i <= limit; i++) {
        var txInfo = web3.eth.getBlock(i).transactions;
        var j;
     //   console.log("txInfo", txInfo);
        if (txInfo.length != 0) {
            async.each(txInfo,
                // 2nd param is the function that each item is passed to
                function (item, callback) {
                    // Call an asynchronous function, often a save() to DB
                    console.log("transaction",item);
                 
                        // Async call is done, alert via callback
                        var txDetail = web3.eth.getTransaction(item);
                                    console.log("txDetail",txDetail);
                        var temp = {
                            "transactionHash": txDetail.hash,
                            "blockHash": txDetail.blockHash,
                            "blockNumber": txDetail.blockNumber,
                            "address": txDetail.from,
                            "transactionIndex": txDetail.transactionIndex
                        }
                        txList.push(temp);
               //         console.log(txList);
                        callback();
                    
                },
                // 3rd param is the function to call when everything's done
                function (err) {
                    // All tasks are done now
                  defered.resolve(txList);
                }
            );
    }
}
    return defered.promise;
}





// module.exports.getAllTx = function (startBlock,latest, web3) {
//     var defered = Q.defer();
//     var txInfo = {};
//     var txList = [];
//     var limit = latest;
//     var start = startBlock+1;
//     //  var limit = 50;
//     //    var start = 1;
//  //   console.log("Inside controller getAllTx");
//     var i;
//     for (i = start; i <= limit; i++) {
//         var txInfo = web3.eth.getBlock(i).transactions;
//         var j;
//         //console.log("txInfo", txInfo);
//             if(txInfo.length != 0){
//              for(j=0; j< txInfo.length ;j++){
//                var txDetail = web3.eth.getTransaction(txInfo[j]);
//    //            console.log("txDetail",txDetail);
//                var temp = {
//             "transactionHash": txDetail.hash,          
//             "blockHash": txDetail.blockHash,
//             "blockNumber": txDetail.blockNumber,
//             "address": txDetail.from,
//             "transactionIndex": txDetail.transactionIndex
//         }
//         txList.push(temp);         
//              }
//     }

//      }
//     //console.log(txList);
//     if (i == limit+1) {
//      //   console.log(i);
//         defered.resolve(txList);
//         //console.log("data");
//     } 
//     return defered.promise;
// }

module.exports.chainDifficulty = function (blockNewest, blockNum) {
    var defered = Q.defer();
    // difficulty

    var difficulty = blockNewest.difficulty;
    var difficultyToExponential = blockNewest.difficulty.toExponential(3);

    var totalDifficulty = blockNewest.totalDifficulty;
    var totalDifficultyToExponential = blockNewest.totalDifficulty.toExponential(3);

    var totalDifficultyDividedByDifficulty = totalDifficulty.dividedBy(difficulty);
    var totalDifficultyDividedByDifficulty_formatted = totalDifficultyDividedByDifficulty.toFormat(1);

    var AltsheetsCoefficient = totalDifficultyDividedByDifficulty.dividedBy(blockNum);
    var AltsheetsCoefficient_formatted = AltsheetsCoefficient.toFormat(4);

    // Gas Limit
    var gasLimit = new BigNumber(blockNewest.gasLimit).toFormat(0) + " m/s";

    if (totalDifficultyDividedByDifficulty_formatted != undefined && AltsheetsCoefficient != undefined && gasLimit != undefined) {
        defered.resolve({ difficulty: totalDifficultyDividedByDifficulty_formatted, AltsheetsCoefficient: AltsheetsCoefficient_formatted, gasLimit: gasLimit });
    } else {
        defered.reject("error in calculation");
    }
    return defered.promise;
}


module.exports.chainAverageBlockTime = function (blockNewest, blockNum) {
    var defered = Q.defer();
    var range = 0;
    var blocktimeAverage1 = 0;
    var blocktimeAverage2 = 0;
    var blocktimeAverage3 = 0;
    var blocktimeAverage4 = 0;
    var avg = 0;
    console.log(blockNum);
    console.log(blockNewest);
    provider.web3().then(function (web3) {
        web3.eth.getBlock(blockNum - 1, function (err, blockBefore) {
            if (!err) {
                if (blockBefore !== undefined) {
                    var date1 = new Date(blockNewest.timestamp * 1000);
                    var date2 = new Date(blockBefore.timestamp * 1000);
                    //    console.log(new Date(blockNewest.timestamp*1000));
                    //     console.log(new Date(blockBefore.timestamp*1000));
                    //      console.log(new Date(blockBefore.timestamp*1000).getTime());
                    //      console.log(Math.abs(date2.getTime() - date1.getTime()));
                    var blocktime = Math.abs(date2.getTime() - date1.getTime());
                }
                var range1 = 100;
                range = range1;
                web3.eth.getBlock(Math.max(blockNum - range, 0), function (err, blockPast) {
                    if (!err) {
                        if (blockBefore !== undefined) {
                            blocktimeAverage1 = ((Math.abs(new Date(blockNewest.timestamp * 1000).getTime() - new Date(blockPast.timestamp * 1000).getTime())) / range).toFixed(2);
                        }
                    }
                    var range2 = 1000;
                    range = range2;
                    web3.eth.getBlock(Math.max(blockNum - range, 0), function (err, blockPast) {
                        if (!err) {
                            if (blockBefore !== undefined) {
                                blocktimeAverage2 = ((Math.abs(new Date(blockNewest.timestamp * 1000).getTime() - new Date(blockPast.timestamp * 1000).getTime())) / range).toFixed(2);
                            }
                        }
                        var range3 = 10000;
                        range = range3;
                        web3.eth.getBlock(Math.max(blockNum - range, 0), function (err, blockPast) {
                            if (!err) {
                                if (blockBefore !== undefined) {
                                    blocktimeAverage3 = ((Math.abs(new Date(blockNewest.timestamp * 1000).getTime() - new Date(blockPast.timestamp * 1000).getTime())) / range).toFixed(2);
                                }
                            }
                            var range4 = 100000;
                            range = range4;
                            web3.eth.getBlock(Math.max(blockNum - range, 0), function (err, blockPast) {
                                if (!err) {
                                    if (blockBefore !== undefined) {
                                        blocktimeAverage4 = ((Math.abs(new Date(blockNewest.timestamp * 1000).getTime() - new Date(blockPast.timestamp * 1000).getTime())) / range).toFixed(2);
                                    }
                                }
                                range = blockNum;
                                var blockPast = web3.eth.getBlock(1);
                                if (blockBefore !== undefined) {
                                    blocktimeAverageAll = ((Math.abs(new Date(blockNewest.timestamp * 1000).getTime() - new Date(blockPast.timestamp * 1000).getTime())) / range).toFixed(2);
                                }
                                console.log("blocktimeAverage1;", blocktimeAverage1);
                                console.log("blocktimeAverage2;", blocktimeAverage2);
                                console.log("blocktimeAverage3;", blocktimeAverage3);
                                console.log("blocktimeAverage4;", blocktimeAverage4);
                                console.log("blocktimeAverageAll;", blocktimeAverageAll);
                                var totalAvg = parseInt(blocktimeAverage1) + parseInt(blocktimeAverage2) + parseInt(blocktimeAverage3) + parseInt(blocktimeAverage4) + parseInt(blocktimeAverageAll);
                                console.log(totalAvg);
                                var avg = totalAvg / 5;
                                console.log("total avg", avg);
                                if (avg != undefined) {
                                    defered.resolve(avg);
                                } else {
                                    defered.reject("error in calculation");
                                }
                            });
                        });
                    });

                });
            }
        });
    });
    return defered.promise;
}
