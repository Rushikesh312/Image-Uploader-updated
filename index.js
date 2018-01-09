var express = require('express');
var app = express();
var mysql = require('mysql'); // to use mysql database 
var multer=require('multer');  //to upload the files
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');

app.use(express.static('public'));  

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cookieParser());

//setting uploads folder for destination
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+"-"+file.originalname)
    }
})
//upload 2 files in the uploads folder
var upload = multer({ storage: storage });
app.use(multer({
     storage:storage
     }).array('myfiles',2));

//Connect to mysql database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mysql"
  });
con.connect(function(err) {
  if (err) throw err;
});

//Set default path for defalut route
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
//set addtional path for index file
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
//setting path for uploading files in the database & destination folder
app.post('/upload',  function (req, res, next) {
    var col_num=3;
    var col_num1=4;

  if(req.files){
        var number_of_files=req.files.length;
        var LEVEL=req.body.currlevel;        
        var qcheck="select * from image_db where level="+LEVEL;
        var q,qalter,qupdate;
             
        if(number_of_files==1){
           var file1=req.files[0].filename; 
           q= "insert into image_db (level,img1) values("+LEVEL+",'"+file1+"'); ";
           qalter="alter table image_db add img"+col_num+" varchar(1000);"; 
           qupdate= "update image_db set img"+col_num+"="+"'"+file1+"' "+"where level="+LEVEL;

        }
        else if(number_of_files==2){
            var file1=req.files[0].filename;
            var file2=req.files[1].filename;
            q= "insert into image_db (level,img1,img2) values("+LEVEL+",'"+file1+"','"+file2+"'); ";
            qalter="alter table image_db add img"+col_num+" varchar(1000) ,"+" add img"+col_num1+" varchar(1000);";
            qupdate= "update image_db set img"+col_num+"="+"'"+file1+"',"+"img"+col_num1+"="+" '"+file2+"' "+"where level="+LEVEL;
         }
            con.query(qcheck,function(err,result){
                
                if(result==""){
                    con.query(q,function(err,result){
                })
                }
                else{
                     if(result==null ){
                          con.query(q,function(err,result){
                          })
                      }
                      else{
                          con.query(qalter,function(err,result){
                          })
                          con.query(qupdate,function(err,result){
                              col_num+=1;
                              col_num1+=1;    
                          })
                      }
                }         
            });    
      res.sendFile( __dirname + "/" + "index.html" );
  }
  else{
      res.end("No files Atteched");
  }
})
//setting path for serving images with respect to level
app.get('/level:selectedlevel', function (req, res) {
    var data=req.params;
    var q1 = "select img1 from image_db where level ="+ data.selectedlevel;
    var q2 = "select img2 from image_db where level ="+data.selectedlevel;
    var totalResult;
    con.query(q1,function(err,result){
              var result=JSON.stringify(result);
              totalResult+=result.substring(10,result.length-3);
              totalResult+=" ";
    })
    con.query(q2,function(err,result){
              var result=JSON.stringify(result);
               totalResult+=result.substring(10,result.length-3);
               res.end(totalResult);
    })
});
var server = app.listen(8081);