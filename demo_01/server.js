var http=require('http');
var fs = require("fs");
var server=http.createServer(function(req,res){
	if(req.url=='/time'){
		res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin':'http://localhost'});
		
		res.end(new Date().toLocaleString());
	};
	if(req.url=='/'){
		fs.readFile("./pollingClient.html", "binary", function(err, file) {
			if (!err) {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(file, "binary");
				console.log(file)
				res.end();
			}
		});
	}
}).listen(8088,'localhost');
server.on('connection',function(socket){
    console.log("connect success");
});
server.on('close',function(){
    console.log('close connect');
});