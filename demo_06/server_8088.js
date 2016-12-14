var http=require('http');
var fs = require("fs");
var server=http.createServer(function(req,res){
    if(req.url=='/cors'){
            res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin':'*'});
            res.end(new Date().toString());
    }
    if(req.url=='/jsonp'){
 
    }
}).listen(8088,'localhost');
server.on('connection',function(socket){
    console.log("connect success");
});
server.on('close',function(){
    console.log('close connect');
});