app.factory('Explorer',function ($http) {
    explorerFactory={};
    

     explorerFactory.getChainInfo = function () {
     return $http.get('/blockchainApi/getChainInfo',{ cache: true });
    }
     explorerFactory.getAllBlocks = function () {
    	return $http.get('/blockchainApi/allBlocks',{ cache: true});
    }
     explorerFactory.getAllTx = function () {
    	return $http.get('/blockchainApi/allTx',{ cache: true});
    }

     explorerFactory.getBlockDetails = function (data) {
         console.log("Service",data);
    	return $http.post('/blockchainApi/block',data);
    }

     explorerFactory.getBlockDetailsFromBc = function (data) {
         console.log("Service",data);
    	return $http.post('/blockchainApi/blockdetailsfrombc',data);
    }

    explorerFactory.getTransactionDetails = function (transId) {
    	return $http.post('/blockchainApi/transactiondetails', transId);
    }

    explorerFactory.getTransactionDetailsFromBc = function (transId) {
    	return $http.post('/blockchainApi/transactiondetailsfrombc', transId);
    }
     
    explorerFactory.search = function (data) {
         console.log("Service",data);
    	return $http.post('/blockchainApi/search',data);
    }
   return explorerFactory;
    
});

