var Chain = require('../models/chain');
var Block = require('../models/block');
var Transaction = require('../models/transaction');
var Q = require('q');
var chainDao = require('../dao/chainDao');
var blockDao = require('../dao/blockDao');
var txDao = require('../dao/transactionDao');

module.exports.storeChainInfo = function (chainData) {
    var result = {};
    var deferred = Q.defer();
 //   console.log(chainData);
    var chain = new Chain({
        difficulty: chainData.Difficulty.difficulty,
        hashRate: chainData.hashRate,
        avgBlockTime: chainData.avgBlockTime
    });
    chain.save(function (err) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        }
        else {
            result['success'] = true;
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};


// This is get chain info from db
module.exports.getChainInfo = function () {
    var defered = Q.defer();
    var result = {};
    chainDao.getChainInfo()
        .then(function (chain) {
  //          console.log(chain);
            result['difficulty'] = chain.difficulty;
            result['hashRate'] = chain.hashRate;
            result['avgBlockTime'] = chain.avgBlockTime;
            result['success'] = true;
            defered.resolve(result);
        })
        .catch(function (error) {
            defered.reject(error);
        })
    return defered.promise;
}


module.exports.storeBlocks = function (blockArray) {
    var result = {};
    var deferred = Q.defer();
    blockArray = blockArray.reverse();
 //   console.log("Reverse",blockArray);
    blockDao.storeBlocks(blockArray)
        .then(function (blocks) {
  //          console.log(blocks);
            result['success'] = true;
            deferred.resolve(result);
        })
        .catch(function (error) {
                  //      console.log("Error in store BLocks ",error.code);
            if (error.code === 11000) {
                result['success'] = true;
                deferred.resolve(result);
            } else {
                deferred.reject(error);
            }
        })
    return deferred.promise;
};

module.exports.storeBlock = function (blockInfo) {
    var result = {};
    var deferred = Q.defer();
 //   console.log(block);
    var block = new Block({
        difficulty: blockInfo.difficulty,
        hash: blockInfo.hash,
        number: blockInfo.number,
        size: blockInfo.size,
        timestamp: blockInfo.timestamp,
        miner: blockInfo.miner,
        gasLimit: blockInfo.gasLimit,
        gasUsed: blockInfo.gasUsed,
        transactions: blockInfo.transactions
    });

    block.save(function (err) {
        if (err) {
            // result['message'] = 'Block not added';
            // result['success'] = false;
            // deferred.resolve(result);
            deferred.reject(err);
        } else {
            result['message'] = 'Block added';
            result['success'] = true;
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

// This is get all blocks from db
module.exports.getAllBlocks = function () {
    var defered = Q.defer();
    var result = [{}];
    blockDao.getAllBlocks()
        .then(function (blocks) {
  //          console.log(blocks);
            result = blocks;
            defered.resolve(result);
        })
        .catch(function (error) {
            defered.reject(error);
        })
    return defered.promise;
}

module.exports.getBlockDetails = function (bNo) {
    var defered = Q.defer();
    var result = {};
    blockDao.getBlock(bNo)
        .then(function (block) {

            if (!block) {
                result['message'] = 'Block doesnot exist';
                result['success'] = false;
                defered.resolve(result);
            } else {
                result['block'] = block;
                if (block) {
                    result['success'] = true;
                    result['message'] = 'Block details fetched successfully';
                    result['difficulty'] = block.difficulty;
                    result['hash'] = block.hash;
                    result['number'] = block.number;
                    result['size'] = block.size;
                    result['timestamp'] = block.timestamp;
                    result['miner'] = block.miner;
                    result['gasLimit'] = block.gasLimit;
                    result['transactions'] = block.transactions;
         //           console.log(result);
                    defered.resolve(result);

                }
            }
        })
        .catch(function (error) {
            defered.reject(error);
        })
    return defered.promise;
}


module.exports.storeTxs = function (TxArray) {
    var result = {};
    var deferred = Q.defer();
    TxArray = TxArray.reverse();
 //   console.log(TxArray.length);
    txDao.storeTxs(TxArray)
        .then(function (txs) {
      //      console.log(txs);
            result['success'] = true;
            deferred.resolve(result);
        })
        .catch(function (error) {
            //            console.log("Error ",error.code);
            if (error.code === 11000) {
                result['success'] = true;
                deferred.resolve(result);
            } else {
                deferred.reject(error);
            }
        })
    return deferred.promise;
};

module.exports.storeTransaction = function (txInfo) {
    var result = {};
    var deferred = Q.defer();
 //   console.log(txInfo);
    var tx = new Transaction({
       address   : txInfo.address,
        transactionHash : txInfo.transactionHash,
		data  : txInfo.data,
        blockNumber  : txInfo.blockNumber,
        logIndex  : txInfo.logIndex,
        blockHash:txInfo.blockHash,
        transactionIndex:txInfo.transactionIndex,
        topics:txInfo.topics
    });

    tx.save(function (err) {
        if (err) {
            // result['message'] = 'Block not added';
            // result['success'] = false;
            // deferred.resolve(result);
            deferred.reject(err);
        } else {
            result['message'] = 'Transaction added';
            result['success'] = true;
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};


// This is get all transactions from db
module.exports.getAllTxs = function () {
    var defered = Q.defer();
    var result = [{}];
    txDao.getAllTxs()
        .then(function (txs) {
      //      console.log(txs);
            result = txs;
            defered.resolve(result);
        })
        .catch(function (error) {
            defered.reject(error);
        })
    return defered.promise;
}

module.exports.getTxDetails = function (tx_id) {
    var defered = Q.defer();
    var result = {};
    txDao.getTx(tx_id)
        .then(function (tx) {

            if (!tx) {
                result['message'] = 'Transaction doesnot exist';
                result['success'] = false;
                defered.resolve(result);
            } else {
                result['tx'] = tx;
                if (tx) {
                    result['success'] = true;
                    result['message'] = 'Transaction details fetched successfully';
                    result['address'] = tx.address;
                    result['transactionHash'] = tx.transactionHash;
                    result['data'] = tx.data;
                    result['blockNumber'] = tx.blockNumber;
                    result['logIndex'] = tx.logIndex;
                    result['blockHash'] = tx.blockHash;
                    result['transactionIndex'] = tx.transactionIndex;
                    result['topics'] = tx.topics;
                    console.log(result);
                    defered.resolve(result);

                }
            }
        })
        .catch(function (error) {
            defered.reject(error);
        })
    return defered.promise;
}
