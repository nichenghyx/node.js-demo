/**
 * 终端聊天室客户端
 */
var net = require('net');
var config = require('./config');
var client = net.createConnection({
    port : config.port,
    host : config.host
})

var username;
client.on('connect',function(){
    console.log('请输入用户名:');
    process.stdin.on('data',function(data){
        data = data.toString().trim();
        if(!username){
            var send = {
                protocal: 'signup',
                username: data
            }
            client.write(JSON.stringify(send));
            return;
        }
        //判断是广播消息还是点对点消息
        //name:内容
        var regex = /(.{1,18}):(.+)/;
        var matches = regex.exec(data);
        if(matches){
            var from = username;
            var to = matches[1];
            var message = matches[2];
            var send= {
                protocal:'p2p',
                from :username,
                to :to,
                message:message
            }
            client.write(JSON.stringify(send));
        }else{
            var send = {
                protocal : 'broadcast',
                from : username,
                message :data
            }
            client.write(JSON.stringify(send));
        }
    });
});

client.on('data',function(data){
    data = JSON.parse(data);
    switch(data.protocal){
        case 'signup':
            username = data.username;
            console.log(data.message);
            break;
        case 'broadcast':
            console.log(data.message);
            break;
        case 'p2p':
            var code = data.code;
            switch(code){
                case 2000:
                    var from =data.from;
                    var message = data.message;
                    message = from + '对你说'+ message;
                    console.log(message);
                    break;
                case 2001:
                    console.log(data.message);
                    break;
                default:
                    break;
            }
            break;
            default:
                break;
    };
});