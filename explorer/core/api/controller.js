'use strict';
var provider = require('./../provider/httpProvider');
var Service = require('./../services/blockchain_service');
var TxInfo = require('./txInfoController');
var _ = require('underscore');
var async = require('async');
var Q = require('q');
var BigNumber = require('bignumber.js');
var DbService = require('./../services/db_service');

module.exports.blockDetails = function (req, res) {
    var bNo = req.body.blockId;
    console.log(bNo);
    DbService.getBlockDetails(bNo)
        .then(function (result) {
            res.json({
                success: result.success,
                message: result.message,
                difficulty: result.difficulty,
                hash: result.hash,
                number: result.number,
                size: result.size,
                timestamp: result.timestamp,
                miner: result.miner,
                transactions: result.transactions
            });

        })
        .catch(function (error) {
            throw error;
        });
};

// module.exports.blockDetailsFromBc = function (req, res) {
//     var bNo = req.body.blockId;
//     console.log(bNo);
//     provider.web3().then(function (web3) {
//         web3.eth.getBlock(bNo, function (error, result) {
//             if (!error)
//                 res.status(200).json(result);
//             else
//                 console.error(error);
//         });
//     }).catch(function (err) {
//         res.send(err);
//     });

// };

module.exports.transactionDetails = function (req, res) {
    var tx_Id = req.body.tx_id;
    if (tx_Id != undefined) {
        DbService.getTxDetails(tx_Id)
            .then(function (result) {
         //       console.log("tx details", result);
                if (result.success) {
                    TxInfo.getTxData(tx_Id, result)
                        .then(function (receipt) {
                            console.log("receipt", receipt);
                            res.status(200).json({ message: "success", data: receipt });
                        }).catch(function (err) {
                            console.error(err);
                            res.status(404).json({ message: "error" });
                        });
                } else {
                    console.error(error);
                    res.status(404).json({ message: "Block Doesn't exist" });
                }
            })
            .catch(function (error) {
                throw error;
            });
    } else {
        console.log("wrong parameters");
        res.status(404).json({ message: "wrong parametrs" });
    }
};

// module.exports.transactionDetailsFromBc = function (req, res) {
//     var tx_Id = req.body.tx_id;
//     if (tx_Id != undefined) {
//         provider.web3().then(function (web3) {
//             web3.eth.getTransaction(tx_Id, function (error, result) {
//                 if (!error) {
//                     TxInfo.getTxData(tx_Id, result)
//                         .then(function (receipt) {
//                             console.log("receipt", receipt);
//                             res.status(200).json({ message: "success", data: receipt });
//                         }).catch(function (err) {
//                             console.error(err);
//                             res.status(404).json({ message: "error" });
//                         });

//                 } else {
//                     console.error(error);
//                     res.status(404).json({ message: "Block Doesn't exist" });
//                 }
//             });
//         });
//     } else {
//         console.log("wrong parameters");
//         res.status(404).json({ message: "wrong parametrs" });
//     }
// };

module.exports.transactionReceipt = function (req, res) {
    provider.web3().then(function (web3) {
        web3.eth.getTransactionReceipt(req.body.tx_hash, function (error, result) {
            if (!error)
                res.status(200).json(result);
            else
                console.error(error);
        });
    });
};
module.exports.GasPrice = function (req, res) {
    provider.web3().then(function (web3) {
        web3.eth.getGasPrice(function (error, result) {
            if (!error)
                res.status(200).json(result);
            else
                console.log(error);
        });
    });
};
module.exports.hashRate = function (req, res) {
    provider.web3().then(function (web3) {
        web3.eth.getHashrate(function (error, result) {
            if (!error)
                res.status(200).json(result);
            else
                console.log(error);
        });
    });
};



module.exports.allBlocks = function (callback) {
    provider.web3().then(function (web3) {
        var latest = web3.eth.blockNumber;
        console.log("latest",latest);
        Service.check(latest, web3)
            .then(function (result) {
                //console.log("Result", result);
                //  res.send(result);
                callback(null, result);
            }).catch(function (err) {
                //   res.status(500).json({err});
                callback(err);
            });
    });
}

module.exports.allBlocksFromDb = function (req, res) {
    DbService.getAllBlocks()
        .then(function (result) {
            res.json({
                blocks: result
            });

        })
        .catch(function (error) {
            throw error;
        });
}

exports.allSocketBlocks = function (callback) {
 DbService.getAllBlocks()
        .then(function (result) {
          callback(null, result);
        })
        .catch(function (error) {
            callback(error);
        });
};

// exports.allSocketBlocks = function (callback) {

//      provider.web3().then(function(web3){
//        var latest = web3.eth.blockNumber;
//        Service.check(latest,web3)
//        .then(function(result){
//           console.log(result);
//           callback(result);
//        }).catch(function(err){
//           callback(err);
//        });
//      }); 
// };


/*
module.exports.getAllTx = function (callback) {
    provider.web3().then(function (web3) {
        var latest = web3.eth.blockNumber;
        console.log("latest controller",latest);
        var filter = web3.eth.filter({ fromBlock: 1, toBlock: latest });
        filter.get(function (err, transactions) {
            console.log("transactions controller", transactions);
            callback(null, transactions);
            //  res.send(transactions);
            //  transactions.forEach(function (tx) {
            //  var txInfo = web3().eth.getTransaction(tx.transactionHash);

            //});
        });
    });
};
*/

module.exports.getAllTx = function (callback) {
    provider.web3().then(function (web3) {
        var latest = web3.eth.blockNumber;
  //      console.log("latest controller",latest);
        DbService.getAllTxs()
        .then(function (result) {
            console.log("Result",result.length);
        if(result.length > 0){
           var startBlock = Math.max.apply(Math,result.map(function(o){return o.blockNumber;}))
        }else{
            var startBlock = 0;
        }
   //        console.log("latest block in db",startBlock);
           if(startBlock !== undefined){
           Service.getAllTx(startBlock,latest, web3)
            .then(function (result) {
            //    console.log("Result", result);
                //  res.send(result);
                console.log("After service tx",result);
                callback(null, result);
            }).catch(function (err) {
                //   res.status(500).json({err});
                callback(err);
            });
        }
        })
        .catch(function (error) {
            throw error;
        });
        
    });
};


module.exports.getAllTxFromDb = function (req, res) {
    DbService.getAllTxs()
        .then(function (result) {
            res.json({
                transactions: result
            });

        })
        .catch(function (error) {
            throw error;
        });
}

module.exports.allSocketTxs = function (callback) {
    DbService.getAllTxs()
        .then(function (result) {
           callback(null,result);
        })
        .catch(function (error) {
            callback(error);
        });
}

module.exports.recentTx = function (req, res) {
    provider.web3().then(function (web3) {
        var latest = web3.eth.blockNumber;
        if (latest != undefined) {
            web3.geth.getBlock(latest, function (blockInfo) {
                if (blockInfo.transctions[0] != null) {
                    res.send(blockInfo.transactions);
                }
            });
        }
    });
}


module.exports.searchData = function (req, res) {
    var searchField = req.body.field;
    var regexpTx1 = new RegExp(/^(0x)?[0-9a-f]{64}$/);
    //var regexpTx2 = new RegExp("/^(0x)?[0-9A-F]{40}$/");
    var regexpBlock = new RegExp(/[0-9]{1,7}?/);
    console.log(searchField);
    provider.web3().then(function (web3) {
        console.log("abc1");
        var result2 = regexpTx1.test(searchField);
        console.log("tx matchin ke liye", result2);
        var result1 = regexpBlock.test(searchField);
        console.log("block matchin ke liye", result1);
        if (result1 == true && result2 == false) {
            DbService.getBlockDetails(searchField)
                .then(function (result) {
                    console.log(result);
                    if (result.success) {
                        var temp = {
                            "Type": "block",
                            "number": result.number,
                            "hash": result.hash,
                            "difficulty": result.difficulty,
                            "size": result.size,
                            "timestamp": new Date(result.timestamp * 1000).toUTCString(),
                            "gasUsed": new BigNumber(result.gasLimit).toFormat(0) + " m/s",
                            "transactions": result.transactions
                        }
                        res.status(200).json({ message: "success", data: temp });
                    } else {
                        web3.eth.getBlock(searchField, function (err, blockInfo) {
                            if (err) {
                                console.log("wrong block no");
                                res.status(200).json({ message: "Block Doesn't exist" });
                            } else {
                                if (blockInfo != undefined) {
                                    console.log(blockInfo);

                                    DbService.storeBlock(blockInfo).then(function (response) {
                                        console.log(response);
                                    });
                                    var temp = {
                                        "Type": "block",
                                        "number": blockInfo.number,
                                        "hash": blockInfo.hash,
                                        "difficulty": blockInfo.difficulty,
                                        "size": blockInfo.size,
                                        "timestamp": new Date(blockInfo.timestamp * 1000).toUTCString(),
                                        "gasUsed": new BigNumber(blockInfo.gasLimit).toFormat(0) + " m/s",
                                        "transactions": blockInfo.transactions
                                    }
                                    res.status(200).json({ message: "success", data: temp });
                                }
                                else {
                                    res.status(200).json({ message: "Block doesn't exist" });
                                }
                            }
                        });
                    }
                })
                .catch(function (error) {
                    throw error;
                });
        } else if (result1 == true && result2 == true || result1 == false && result2 == true) {
            DbService.getTxDetails(searchField)
                .then(function (result) {
                    console.log(result);
                    if (result.success) {
                        TxInfo.getTxData(searchField, result)
                            .then(function (receipt) {
                                console.log(receipt);
                                res.status(200).json({ message: "success", data: receipt });
                            }).catch(function (err) {
                                console.error(err);
                                res.status(200).json({ message: "error" });
                            });
                    } else {
                        web3.eth.getTransaction(searchField, function (error, result) {
                            if (!error) {
                                 DbService.storeTransaction(result).then(function (response) {
                                        console.log(response);
                                    });
                                TxInfo.getTxData(searchField, result)
                                    .then(function (receipt) {
                                        console.log(receipt);
                                        res.status(200).json({ message: "success", data: receipt });
                                    }).catch(function (err) {
                                        console.error(err);
                                        res.status(200).json({ message: "error" });
                                    });

                            } else {
                                console.error(error);
                                res.status(200).json({ message: "Data Doesn't exist" });
                            }
                        });
                    }
                })
                .catch(function (error) {
                    throw error;
                });
        } else if (result1 == false && result2 == false) {
            res.status(200).json({ message: "Wrong parameters" });
        }

    });
}
