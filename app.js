var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var querystring = require("querystring");
var http = require("http");
var app = express();
var server = require('http').createServer(app);
var conn = require('./db.js')
var async = require('async')
var util = require("util");
var url = require('url');
var host = "localhost";
//39.106.14.209(公)
//172.17.9.44(私有)
var port = 7777;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
// app.set('views', path.join(__dirname, 'views'));//_dirname 根目录 views 里面
// app.set('view engine', 'ejs');//模板 引擎 ejs

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); //如果有fanicon.ico 放到public 中去
// app.use(logger('dev'));//
// app.use(bodyParser.json());  //接口 传的文件类型
// app.use(bodyParser.urlencoded({ extended: false }));//表单提交
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));//静态文件 忽视public

// 处理跨域方法 jsonp

app.all('*', function(req, res, next) {
	// res.header("Access-Control-Allow-Headers","Access-Control-Allow-Headers")
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	next()
});

function stealData(url, res) {
	http.get(url, function(res2) {
		var data = "";
		res2.on("data", function(chunk) {
			data += chunk;
		});
		res2.on("end", function() {
			res.send(data);
		});

	})
}




//追书栏目副标题
app.get('/subtitle', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/notification/shelfMessage?platform=android", res);
})

//首页 
app.get('/shouye', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/v2/posts/list", res);
})

//广告
app.get('/guanggao', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/advert?platform=android&position=all", res);
})

//游戏
app.get('/youxi', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/game/layoutv2/?platform=android", res);
})

//社区-公共板块
/*（排序方式 sort=comment-count
			   sort=updated
		  精品     distillate=true
		）*/
//二次yuan
app.get('/erciyuan', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/post/by-block?block=erciyuan&duration=all&sort=comment-count&type=all&start=0&limit=20", res);
})

//综合讨论
app.get('/zonghetaolun', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/post/by-block?block=ramble&duration=all&sort=updated&type=all&start=0&limit=20", res);
})

//书荒互助：
//待回答
app.get('/shuhuanghuzhu/daihuida', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/bookAid/questions?token=0l0LHlBeFEEUTCDOf3DRANtr&tab=wait&next=null&limit=10", res);
})
//热门
app.get('/shuhuanghuzhu/remen', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/bookAid/questions?token=0l0LHlBeFEEUTCDOf3DRANtr&tab=trend&next=null&limit=10", res);
})

//全部
app.get('/shuhuanghuzhu/quanbu', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/bookAid/questions?token=0l0LHlBeFEEUTCDOf3DRANtr&tab=all&next=null&limit=10", res);
})

//精彩书评
app.get('/jingcaishuping', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/post/review?duration=all&sort=updated&type=all&start=20&limit=20", res);
})

//活动福利
app.get('/huodongfuli', (req, res) => {
	stealData("http://api02u58f.zhuishushenqi.com/post/by-block?block=fuli&duration=all&sort=updated&type=all&start=0&limit=20", res);
})

/*
书库：
api接口
*/
//获取带书籍数量的父分类

app.get('/categories', (req, res) => {
	stealData("http://novel.juhe.im/categories", res);
})

//获取带子分类的分类
app.get('/sub-categories', (req, res) => {
	stealData("http://novel.juhe.im/sub-categories", res);
})
//////////////////////////////////////////////
//获取分类详情
app.get("/books", (req, res) => {
	var major = req.query.major;
	conn.getDb(function(err, db) {
		var books = db.collection("books");
		books.find({major},{}).toArray(function(err,result){
			if(err) throw err;
			res.send(result[0].data.data);
			db.close();
		})
	})
})

//书单
app.get('/book-list', (req, res) => {
	stealData("http://api.zhuishushenqi.com/book-list", res);
})




server.listen(port, host, () => {
	console.log(`Server is runing at ${host}:${port}`)
})