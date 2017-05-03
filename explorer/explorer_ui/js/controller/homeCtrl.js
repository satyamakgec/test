app.controller('homeCtrl', function (Explorer, $scope, $rootScope, $stateParams,$interval, $state, $window) {
    
	
	$scope.blockList = [];
	$scope.TxList = [];
	$scope.previousBlockHash = [];
	$scope.noOfTransactions = [];
	$scope.timestamp = [];
	$scope.blockDetail = {};
	$scope.transactionDetail = {};
	$scope.blockTrans = [];
	$scope.blockchainDetail = {};
	$scope.searchText = "";
	$scope.isSearch = false;
	$scope.BlockData = true;
	$scope.TxData = true;
	$scope.SearchData = true;
	// $scope.searchTransactionDetail = {};
	// $scope.searchBlockchainDetail = {};
    

	$scope.getBlockChainInfo = function () {
		console.log("Get chain Info called");
	//	$scope.loadingHome = true;
		Explorer.getChainInfo().then(function (response) {
			console.log("getChainInfo", response.data);
			$scope.blockchainDetails = response.data;
			$rootScope.loadingHome = false;
			
		})
		
    }


	$scope.search = function () {
		var data = {
			field: $scope.searchText
		}
		Explorer.search(data).then(function (result) {
			$scope.isSearch = true;
			console.log("Search res:", result);
			if (result.data.message === "success") {
				console.log("if part search");
				if (result.data.data.Type == "block") {
					$state.go('block', { 'blockNumber': $scope.searchText });
				} else if (result.data.data.Type == "Tx") {
					$rootScope.txSearchData = result.data.data;
					$state.go('transaction', { 'hash': $scope.searchText });
				}
			} else {
				console.log("else part search");
				//$window.alert(result.data.message);
				$scope.searchError = "Invalid Search Input";
				var x = document.getElementById("errorToast");
				console.log(x);
				x.className = "show";
				setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

			}
		})

	}

	$scope.enterPress = function(keyEvent) {
      if (keyEvent.which === 13){
				 $scope.search();
	  }
        
    }
   
 
   
   function mycomparator(a,b) {
     return parseInt(a.number, 10) - parseInt(b.number, 10);
   }

	// $scope.loadBlocks = function () {
		// Explorer.getAllBlocks().then(function (response) {
		// 	console.log("Load Blocks:", response.data.blocks);
		// 	if (response.data.blocks.length != 0) {
		// 		 $scope.blockList = response.data.blocks.sort(mycomparator).reverse();
		// 		 console.log("$scope.blockList",$scope.blockList);
		// 		// $rootScope.loadingHome = false;
				
        //          $scope.blockList = response.data.blocks.slice(0,20);
				 
		// 		//			$scope.loadingBlock = false;
		// 	} else if (response.data.blocks.length == 0) {
		// 		$scope.BlockData = false;
		// 		//			$scope.loadingBlock = false;
		// 		console.log("block data not found");
		// 	}
		// });
	// }
   
    angular.element(document).ready(function (){
  //   console.log("Socket",socket);
         $scope.init();
	
      });

	  setTimeout(function() {
	 $scope.$apply(function() {
            $scope.init();
          });
   }, 5000)

	  $scope.init = function(){
		   var socket = io.connect('localhost:3000');
	
     socket.on('getAllBlocks', function (response) {
      console.log("Block response",response);
	  if(response !== undefined){
	  $scope.blockList = response.slice(0,20);
	   $scope.BlockData = true;
	  $scope.blockList = response.sort(mycomparator).reverse();
	  console.log("$scope.blockList",$scope.blockList);
	  }else{
		  $scope.BlockData = false;
	  }
     });
      socket.on('getAllTxs', function (res) {
      console.log("Tx response",res);
	  $scope.TxData = true;
	  $scope.TxList = res.slice(0,20);
	  $scope.TxList = res.sort(mycomparator).reverse();
	  if(res !== undefined){
	 
	  }else{
		  $scope.TxData = false;
	  }
     });
	  }


	// $scope.loadTransactions = function () {
	// 	//	$scope.loadingTransactions = true;
	// 	Explorer.getAllTx().then(function (response) {
	// 		console.log("Load Transactions:", response.data);
	// 		if (response.data.transactions.length != 0) {
	// 			console.log("length:",response.data.transactions.length);
	// 			$scope.TxList = response.data.transactions.reverse();
				
	// 			$scope.TxList = response.data.transactions.slice(0, 20);
				
	// 			//		    $scope.loadingTransactions = false;
	// 		} else if (response.data.transactions.length == 0) {
	// 			$scope.TxData = false;
	// 			//		$scope.loadingTransactions = false;
	// 			console.log("Tx data not found");
	// 		}

	// 	});
	// }



	   /* load block details function */
	$scope.loadBlockDetails = function () {
		var blockId = $stateParams.blockNumber;
		$scope.blockId = blockId;
		var data = {
			blockId: $scope.blockId
		};
		console.log(data);
		console.log(blockId);

		Explorer.getBlockDetails(data).then(function (response) {
			console.log(response);
			$scope.blockId = blockId;
			$scope.blockDetail = response.data;
			console.log("response of getBlock!", response.data);
		})

	}

	  /* load block details function */
	// $scope.loadBlockDetailsFromBc = function () {
	// 	var blockId = $stateParams.blockNo;
	// 	$scope.blockId = blockId;
	// 	var data = {
	// 		blockId: $scope.blockId
	// 	};
	// 	console.log(data);
	// 	console.log(blockId);

	// 	Explorer.getBlockDetailsFromBc(data).then(function (response) {
	// 		console.log(response);
	// 		$scope.blockId = blockId;
	// 		$scope.searchBlockDetail = response.data;
	// 		console.log("response of getBlock!", response.data);
	// 	})

	// }


	/* load block details function */
	$scope.loadTransactionDetails = function () {
		var hash = $stateParams.hash;
		$scope.hash = hash;
		var data = {
			tx_id: $scope.hash
		}
		console.log(hash);
		Explorer.getTransactionDetails(data).then(function (response) {
			console.log("Tx res", response);
			$scope.transactionDetail = response.data.data;
			console.log($scope.transactionDetail);
		})

	}


// $scope.loadTransactionDetailsFromBc = function () {
// 		var txhash = $stateParams.txhash;
// 		$scope.txhash = txhash;
// 		var data = {
// 			tx_id: $scope.txhash
// 		}
// 		console.log(txhash);
// 		Explorer.getTransactionDetailsFromBc(data).then(function (response) {
// 			console.log("Tx res", response);
// 			$scope.searchTransactionDetail = response.data.data;
// 			console.log($scope.searchTransactionDetail);
// 		})

// 	}



});
