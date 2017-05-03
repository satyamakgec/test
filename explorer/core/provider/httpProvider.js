var Web3 = require('web3');
var fs  =  require('fs');
var Q   =  require('q');

module.exports.web3=function(){
    var defered = Q.defer();
    fs.readFile("./core/provider/config.txt", "utf8", function(err,data){
        if(!err){
            var web3 = new Web3(new Web3.providers.HttpProvider(data));
            defered.resolve(web3);
       }else{
            console.log(err);
            defered.reject(err);
        }
    });
    return defered.promise;
}
