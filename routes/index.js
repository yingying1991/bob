var express = require('express');
var http = require("http");
var router = express.Router();
var  fs=require('fs');
var url=require('url');
var path = require("path");
var htmlPath = path.resolve(__dirname,"../html");
var qs = require('querystring');
/* GET home page. */
router.get('/', function(req, res, next) {
    var  filepath=htmlPath+"/lianglan.html";
    fs.readFile(filepath,function(error,content){
        if(error){res.writeHead(500);res.end()}
        else{
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(content,'utf-8');

        }

    })

});
var name="";
router.post("/login",function(req,res,next){
    console.info(req.body);
    //body = querystring.parse(body);
     name = req.body.personname;
    //var password = req.body.password;
    //console.info(name);
    res.send("欢迎访问2："+name);

    console.log(name);
    var mysql=require('mysql');
    var connection=mysql.createConnection({
        host : 'localhost',
        user:'root',
        password:'abc',
        database:'test1'

    })
    connection.connect();
    var add="insert into lianglan(name) values(?)";
    console.info(typeof name);
    console.info(";;;;;;;;;;;;;");
    var param=name;
    connection.query(add,param,function(error,result){
        if(error){console.log(error.message);
            console.log("..............");
        }
        else{
            //console.info(result)
        }
    })
     var  sql = 'SELECT name FROM lianglan';
    var result2;
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log(typeof(result));
        var len=result.length;
        console.log(len);
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log(result[len-1]);
        var result1=result[len-1];
        console.log(result1 instanceof Object);
        result2=result1.name;
        console.log(result2);
        console.log('------------------------------------------------------------\n\n');
        var post_data = {
            cmd:"/usr/local/RSA1-master/encoder.sh"+" "+result2};//这是需要提交的数据
        var content = qs.stringify(post_data);//转化成请求体的形式
        console.log(content);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        var options = {
            hostname: '192.168.68.103',
            port: 8080,
            path: '/rsaIn/encoder',//这个路径是什么意思。请求地址
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'//头信息
            }
        };
        var req = http.request(options, function (res) {//设置访问信息，获取返回信息
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                var chunk1=chunk.split("@")[1];
                console.log(chunk1);
                console.log('BODY: ' + chunk1);
                var path1 = 'films',name = 'sign';
                for (var i=0;i<20;i++ ) {
                    var number =i;
                    var pathStr = path1 + '/' + name;
                   // fs.mkdirSync(pathStr,0777);
                    var newPathStr = pathStr + '/' + name + number.toString() + '.txt';
                    fs.mkdirSync(newPathStr,0777);
                }
                fs.writeFile(newPathStr,chunk1, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });

            });
            res.on('end',function(){
                console.log("数据接收结束")
            })
        });
        req.on('end',function(){
            console.log("没有响应数据了")
        })
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });

// write data to request body
        req.write(content);//写入数据到请求主体

        req.end();
    });
    console.log(result2+"!!!!!");
    connection.end();



})



module.exports = router;
