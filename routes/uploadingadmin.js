var express =   require('express');
var cloudinary = require('cloudinary');
var multer  =   require('multer');
var cloudinaryStorage = require('multer-storage-cloudinary');
var exphbs  =   require('express-handlebars');
var flash   =   require('connect-flash');
var session =   require('express-session');
var fs = require('fs');
var mongoose = require('mongoose');



// User Schema
var FileSchema = new mongoose.Schema({
	uploadfilename: {
		type: String ,
    index: {unique: true}
	},
    Semester : {
		type: String
	}
});

var File = module.exports = mongoose.model('File', FileSchema);


mongoose.Promise = global.Promise;

var go = express();



//Connect to the database
mongoose.connect('mongodb://DishLive:DishLive2018@ds115931.mlab.com:15931/dishlive');
var db = mongoose.connection;



var go =  express();

//flash
go.use(flash());

//Express Session
go.use(session({
  secret: 'secretsmmsmsmmm',
  saveUninitialized : true,
  resave : true
}));

//Global vars
go.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.file = req.file || null;
      next();
});


go.engine('handlebars', exphbs({defaultLayout:'layout'}));
go.set('view engine', 'handlebars');


//static files
go.use(express.static((__dirname, 'public')));

//storage method in multer
cloudinary.config({

    cloud_name: 'leonardm',
    api_key: '294321646377587',
    api_secret: 'emXVRSXwdf_KsRM3qMkH1EwAitU',

});
var storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: '',
	filename: function (req, file, cb) {
		var name=req.uploadfilename;
		cb(undefined, req.body.uploadfilename);
	}
});


var upload = multer({ storage : storage}).single('upload_file');

go.post('/adminloggedinbuzzer4%',function(req,res){

    upload(req , res , function(err) {

        if(err) {
          req.flash('error_msg','file not uploaded');
      res.redirect('/adminloggedinbuzzer4%');
        }

         req.flash('success_msg','file  uploaded succesfully');


         var  uploadfilename = req.body.uploadfilename;
           var  Semester  = req.body.Semester;


       var newFile = new File({
             uploadfilename : uploadfilename,

             Semester    : Semester
					 }).save(function(err,data){
					 if (err) throw err;
					   //data.push(req.body);
					  console.log(data);

					});

    res.redirect('/adminloggedinbuzzer4%');
    });
});

go.post('/userloggedinbuzzer4%',function(req,res){

    upload(req , res , function(err) {

        if(err) {
          req.flash('error_msg','file not uploaded');
      res.redirect('/userloggedininbuzzer4%');
        }

         req.flash('success_msg','file  uploaded succesfully');


         var  uploadfilename = req.body.uploadfilename;
           var  Semester  = req.body.Semester;


       var newFile = new File({
             uploadfilename : uploadfilename,

             Semester    : Semester
					 }).save(function(err,data){
					 if (err) {
						 req.flash('error_msg','file not uploaded');
             res.redirect('/userloggedinbuzzer4%');
					 }

					});

    res.redirect('/userloggedinbuzzer4%');
    });
});

//upload
go.get('/adminloggedinbuzzer4%', function(req, res){
File.find({},function(err,user){
 if (err) res.render("admin");
 res.render("admin",{data:user});
 });
});

go.get('/notesviewbuzzer4%', function(req, res){
File.find({},function(err,user){
 if (err) res.render("admin");
 res.render("notesview",{data:user});
 });
});



go.get("/upload/delete/:this",function(req,res){
	  File.find({uploadfilename : req.params.this.replace(/\-/g,"")}).remove(function(err,data){
	    if (err)  res.render("admin");
	    res.redirect('/adminloggedinbuzzer4%');
	  });
});

go.get("/admin/upload/:this",function(req,res){
	  File.find({Semester : req.params.this},function(err,user){
	    if (err) res.render("/admin") ;
	    res.render("admin",{data:user});
	  });
});

go.get("/userloggedin/upload/:this",function(req,res){
	  File.find({Semester : req.params.this},function(err,user){
	    if (err) res.render("userloggedin");
	    res.render("userloggedin",{data:user});
	  });
});



go.get('/userloggedinbuzzer4%', function(req, res){
File.find({},function(err,user){
 if (err) {
	 req.flash('error_msg','file not uploaded');
   res.render("userloggedin");}
   res.render("userloggedin",{data:user});
 });
});

module.exports = go;
