var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var config = require('./core/config/environmentConfig');
var chainController = require('./core/api/chainInfoController');
var controller = require('./core/api/controller');
var DbService = require('./core/services/db_service');
// var logger = require('./core/core-utils/logger').logger;
// var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
console.log("directory", __dirname);
app.use('/explorer_ui',express.static(__dirname + '/explorer_ui'));

console.log("1");
require('./core/routing/route')(app, express);

console.log("2");

try {
  
setInterval(function() {
  console.log("I am doing my 1sec check");

    
  chainController.getChainInfo( function(chainError,chainResult){
         if(chainError) console.log("Error fetching chain info",chainError);
		 else{
			 console.log("storing chain info", chainResult);
			  DbService.storeChainInfo(chainResult)
              .then(function(chainResponse){
               console.log("Stored chain info",chainResponse);
            })
           .catch(function (storeChainError) {
              console.log("Error stroring chain Info", storeChainError);
            });
		 }
  });

     controller.allBlocks( function(blockError,blockResult){
         if(blockError) console.log("Error fetching blocks",blockError);
		 else{
	//		  console.log("storing blocks", blockResult);
	      DbService.storeBlocks(blockResult)
              .then(function(blockResponse){
 //              console.log("Stored blocks",blockResponse);
           })

            .catch(function (storeBlockError) {
  //            console.log("Error stroring blocks", storeBlockError);
            });
		 }
  });
  
  
 
    controller.getAllTx( function(txError,txResult){
         if(txError) console.log("Error fetching tx",txError);
		 else{
	//		  console.log("storing tx", txResult);
        if(txResult.length > 0 ){
			  DbService.storeTxs(txResult)
              .then(function(txResponse){
  //             console.log("Stored tx",txResponse);
            })

            .catch(function (storeTxError) {
   //           console.log("Error stroring txs", storeTxError);
            });
              }
		 }
  });

 },10000);
} catch (err) {
	console.log(err);
	process.env.exit(1);
}


io.on('connection', function (socket) {
  console.log("inside io");
   controller.allSocketBlocks( function(err,result){
         if(err) console.log("Error fetching blocks",err);
		 else{
			 console.log("all blocks", result);
	     socket.emit('getAllBlocks', result);
		 }
  });

  controller.allSocketTxs( function(error,res){
         if(error) console.log("Error fetching txs",error);
		 else{
			 console.log("all txs", res);
	     socket.emit('getAllTxs', res);
		 }
  });
  
});

server.listen(config.port, function (err) {
	if (err) {
		console.log(err)
	} else {
		console.log("listening at " + config.port + " port");
	}
});

mongoose.connect(config.database, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log("database connect");
	}
});



app.get('*', function (req, res) {
        console.log("send", __dirname);
	res.sendFile(__dirname + '/explorer_ui/index.html');
});
