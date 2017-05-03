var BigNumber = require('bignumber.js');
var Service = require('./../services/blockchain_service');
var provider = require('./../provider/httpProvider');
var DbService =  require('./../services/db_service');

module.exports.getChainInfo = function(callback){
provider.web3().then(function(web3){
    var blockNum = web3.eth.blockNumber;
    //console.log(blockNum);
    if(blockNum!=undefined){
      web3.eth.getBlock(blockNum,function(err,blockNewest){
          console.log(err);
        if(!err){
            if(blockNewest!==undefined){
                // difficulty
                Service.chainDifficulty(blockNewest,blockNum)
                .then(function(result1){
                    // Time
	                        var newDate = new Date();
	                        newDate.setTime(blockNewest.timestamp*1000);
	                        var time = newDate.toUTCString();

	                        var secondsSinceBlock1 = blockNewest.timestamp - 1438226773;
	                        var daysSinceBlock1 = (secondsSinceBlock1 / 86400).toFixed(2);
                            Service.chainAverageBlockTime(blockNewest,blockNum)
                            .then(function(result2){
                                // Block Explorer Info
	                var isConnected = web3.isConnected();
	                var peerCount = web3.net.peerCount;
	                var versionApi = web3.version.api;
	                var versionClient = web3.version.client;
	                var versionNetwork = web3.version.network;
                        web3.eth.getHashrate(function(err,hashRate){
                            if(err){
                                console.error(err);
                                  callback(err);
                               }else{
                             //   res.status(200).json({Difficulty:result1,timeTogenerated:daysSinceBlock1 , timeOfgeneration :time,isConnected:isConnected,peerCount:peerCount,versionApi:versionApi,versionClient:versionClient,versionNetwork:versionNetwork,hashRate:hashRate,avgBlockTime:result2});
                                 var result = {
                                     Difficulty:result1,timeTogenerated:daysSinceBlock1 , timeOfgeneration :time,isConnected:isConnected,peerCount:peerCount,versionApi:versionApi,versionClient:versionClient,versionNetwork:versionNetwork,hashRate:hashRate,avgBlockTime:result2
                                 }
                                 callback(null,result);
                           }
                        });    
                       
                }).catch(function(err){
                    console.error(err);
              //      res.status(500).json({message:err});
              callback(err);
                });
            }).catch(function(err){
                console.error(err);
           //     res.status(500).json({message:err});
           callback(err);
            });        
        }
    }else{
        console.error(err); 
        callback(err);
    }
});
}
});
}

 // chain info details from db
    module.exports.getChainInfoFromDb=function(req,res){ 
	     
        DbService.getChainInfo()
            .then(function (result) {
                    res.json({
                        difficulty:result.difficulty,
                        hashRate: result.hashRate,
                        avgBlockTime:result.avgBlockTime,
                        success:result.success
                    });
                
            })
            .catch(function (error) {
                throw error;
            });
    }
