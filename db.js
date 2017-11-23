
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var DB_CONN_STR = "mongodb://39.106.14.209:27017/zhuishushenqi";

module.exports = {
    getDb:function (callback) {
        MongoClient.connect(DB_CONN_STR,(err,db)=>{
            if(err){
                callback(err,null);
            }else{
                callback(null,db);
            }
        })
    }
}