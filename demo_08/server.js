//���ֳɹ�֮��Ϳ��Է���������
var crypto = require('crypto');
var WS = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
var server=require('net').createServer(function (socket) {
    var key;
    socket.on('data', function (msg) {
        if (!key) {
            //��ȡ���͹�����Sec-WebSocket-key�ײ�
            key = msg.toString().match(/Sec-WebSocket-Key: (.+)/)[1];
            key = crypto.createHash('sha1').update(key + WS).digest('base64');
            socket.write('HTTP/1.1 101 Switching Protocols\r\n');
            socket.write('Upgrade: WebSocket\r\n');
            socket.write('Connection: Upgrade\r\n');
            //��ȷ�Ϻ��key���ͻ�ȥ
            socket.write('Sec-WebSocket-Accept: ' + key + '\r\n');
            //������У�����Httpͷ
            socket.write('\r\n');
        } else {
            var msg=decodeData(msg);
            console.log(msg);
            //����ͻ��˷��͵Ĳ�����Ϊ8,��ʾ�Ͽ�����,�ر�TCP���Ӳ��˳�Ӧ�ó���
            if(msg.Opcode==8){
                socket.end();
                server.unref();
            }else{
                socket.write(encodeData({FIN:1,
                    Opcode:1,
                    PayloadData:"recieve data is: "+msg.PayloadData}));
            }
 
        }
    });
});
    server.listen(8000,'localhost');
//����websocket����֡��ʽ��ȡ����
function decodeData(e){
    var i=0,j,s,frame={
        //����ǰ�����ֽڵĻ�������
        FIN:e[i]>>7,Opcode:e[i++]&15,Mask:e[i]>>7,
        PayloadLength:e[i++]&0x7F
    };
    //�������ⳤ��126��127
    if(frame.PayloadLength==126)
        frame.length=(e[i++]<<8)+e[i++];
    if(frame.PayloadLength==127)
        i+=4, //����һ�������ֽڵ����ͣ�ǰ�ĸ��ֽ�ͨ��Ϊ���������յ�
            frame.length=(e[i++]<<24)+(e[i++]<<16)+(e[i++]<<8)+e[i++];
    //�ж��Ƿ�ʹ������
    if(frame.Mask){
        //��ȡ����ʵ��
        frame.MaskingKey=[e[i++],e[i++],e[i++],e[i++]];
        //�����ݺ��������������
        for(j=0,s=[];j<frame.PayloadLength;j++)
            s.push(e[i+j]^frame.MaskingKey[j%4]);
    }else s=e.slice(i,frame.PayloadLength); //����ֱ��ʹ������
    //����ת���ɻ�������ʹ��
    s=new Buffer(s);
    //����б�Ҫ��ѻ�����ת�����ַ�����ʹ��
    if(frame.Opcode==1)s=s.toString();
    //���������ݲ���
    frame.PayloadData=s;
    //��������֡
    return frame;
}
//�Է������ݽ��б���
function encodeData(e){
    var s=[],o=new Buffer(e.PayloadData),l=o.length;
    //�����һ���ֽ�
    s.push((e.FIN<<7)+e.Opcode);
    //����ڶ����ֽڣ��ж����ĳ��Ȳ�������Ӧ�ĺ���������Ϣ
    //��Զ��ʹ������
    if(l<126)s.push(l);
    else if(l<0x10000)s.push(126,(l&0xFF00)>>2,l&0xFF);
    else s.push(
            127, 0,0,0,0, //8�ֽ����ݣ�ǰ4�ֽ�һ��û������
                (l&0xFF000000)>>6,(l&0xFF0000)>>4,(l&0xFF00)>>2,l&0xFF
        );
    //����ͷ���ֺ����ݲ��ֵĺϲ�������
    return Buffer.concat([new Buffer(s),o]);
}