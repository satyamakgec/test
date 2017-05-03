module.exports=function(app,express){
 	//var api = require('./api')(app,express);
    var blockchainApi = require('./../api/index')(app,express);
   	//app.use('/api',api);
	app.use('/blockchainApi',blockchainApi);
};