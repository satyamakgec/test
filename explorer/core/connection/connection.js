'use strict';

var Web3 = require('web3');
var fs = require('fs');

module.exports.connect = function(req, res) {
    var provider = "http://"+req.body.ip+':'+req.body.port;
    var account = req.body.account;
    var web3 = new Web3(new Web3.providers.HttpProvider(provider));
    if(web3.isConnected())
    {
     web3.eth.getAccounts(function(err,accounts){
         var flag = false;
         var check = 0;
         for(var i = 0; i<accounts.length; i++)
         {
             if(accounts[i]==account){
                 flag = true;
                web3.eth.defaultAccount = account;  //it will work for eth.sendTransaction & eth.call as default
                 fs.writeFile('./core/provider/config.txt', provider, function(err){
                   if(err){
                        console.log("Error In Writing File" +err);
                        res.send(false);
                   }else{
                        console.log("Node Connected With Provider : "+provider+" & Account : "+account);
                       
                        res.send(true);
                       console.log("hello");
                    }
                });
               break;
             }
             if(!flag){
                 console.log("Wrong Account Address");
                 if(check == accounts.length){
                 res.send(flag);
                 }
                   check++;
             }
         }
     });    
    }
   else{
        console.log("Error In Connection/Wrong Parameters");
        res.send(false);
    }
};