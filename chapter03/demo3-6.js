function parseJsonStrToObj(str,callback){
    setTimeout(function(){
        try{
            var obj = JSON.parse(str);
            callback(null,obj);
        }catch(e){
            callback(e,null);
        }
    },0);
}

parseJsonStrToObj('foo',function(err,result){
    if(err){
        return console.log('转换失败了');
    }
    console.log('数据转换成功，没有问题可以直接使用了：'+result);
});