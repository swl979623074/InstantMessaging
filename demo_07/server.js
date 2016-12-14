var http=require('http');
var url=require('url');
var server=http.createServer(function(req,res){
    if(/\/jsonp/.test(req.url)){
        var urlData=url.parse(req.url,true);
        var methodName=urlData.query.cb;
        res.writeHead(200,{'Content-Type':'application/javascript'});
        //res.end("<script type=\"text/javascript\">"+methodName+"("+new Date().getTime()+");</script>");
        res.end(methodName+"("+new Date().getTime()+");");
        //res.end(new Date().toString());
    }
}).listen(8088,'localhost');
server.on('connection',function(socket){
     console.log("connect success");
});
server.on('close',function(){
    console.log('close connect');
});