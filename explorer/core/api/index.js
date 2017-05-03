'use strict';
var controller = require('./controller');
var provider = require('./../provider/httpProvider');
var connection = require('./../connection/connection');
var chainController = require('./chainInfoController'); 

module.exports = function(app,express){
console.log("index");
	var router = express.Router();
	router.post('/block', controller.blockDetails);
    // router.post('/blockdetailsfrombc', controller.blockDetailsFromBc);
    router.post('/transactionreceipt', controller.transactionReceipt);
    router.post('/transactiondetails', controller.transactionDetails);
    // router.post('/transactiondetailsfrombc', controller.transactionDetailsFromBc);
    router.post('/setRpc', connection.connect); 
    router.get('/gasprice',controller.GasPrice);
    router.get('/hashrate',controller.hashRate);
    router.get('/allTx',controller.getAllTxFromDb);
    router.get('/allBlocks',controller.allBlocksFromDb);
    router.post('/search',controller.searchData);
    router.get('/getChainInfo',chainController.getChainInfoFromDb);

    return router;	
}






