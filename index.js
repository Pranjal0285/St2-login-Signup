var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sessiion =  require('express-session');
var flsh = require('connect-flash');
var db = mysql.createConnection({host:"localhost",user:"root",password:"",database:"st2"});app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine','ejs');
app.use(sessiion({
    secret: 'secret',
    cookie: {maxAge:60000},
    resave:false,
    saveUninitialized:false
}));
app.use(flsh());


//SignUp

app.get("/",function(req,res){
    res.render("signup",{ message : req.flash('message')});
});

app.post("/save",function(req,res){

    var name = req.body.fname;
    var gender = req.body.gender;
    var phone = req.body.phn;
    var username = req.body.username;
    var psswd = req.body.pswd;

    db.query("Select * FROM users WHERE username='"+username+"'",
    (err,result)=>{
        if(err){
            console.log(err);
        }else if(result.length>0){
           console.log("user already exists."); 
           req.flash('message', 'Username already exists.')
           res.redirect("/");
        }else if(result.length<=0){
            db.query("INSERT INTO users (Name,Gender,Mobile,Username,Password) VALUES('"+name+"','"+gender+"','"+phone+"','"+username+"','"+psswd+"')",
            (err,result)=>{
                console.log(err);
                res.redirect("/log");
            }); 
        
        }
    })

});


//Login

app.get("/log",function(req,res){
    res.render("login",{ message : req.flash('message')});
});

var usrname;
var passwd; 

app.post("/log",function(req,res){
    usrname = req.body.username;
    passwd = req.body.pswd;
    db.query("Select * FROM users WHERE Username='"+usrname+"' AND Password='"+passwd+"'",
    (err,result)=>{
        if(err){
            console.log(err);
        }else if(result.length>0){
            console.log("Login Successful!");
            res.redirect("/home");
        }else if(result.length<=0){
            console.log("Account not found.") ///////edit krna abhi/////////
            req.flash('message', 'Invalid Username or Password.')
            res.redirect("/log");
        }
    });
});


//Home

app.get("/home",function(req,res){
    db.query("Select * FROM users WHERE Username='"+usrname+"' AND Password='"+passwd+"'",
    (err,result)=>{
        if(err){
            console.log(err);
        }
        console.log("Welcome to Home Page");
        //console.log(result);
        res.render("home",{result:result});
    });
});

//View Profile


app.get("/profile",function(req,res){
    db.query("Select * FROM users WHERE Username='"+usrname+"' AND Password='"+passwd+"'",
    (err,result)=>{
        if(err){
            console.log(err);
        }
        console.log("View Your Profile");
        //console.log(result);
        res.render("profile",{result:result});
    });
});


//View All Users

app.get("/all",function(req,res){
    db.query("Select * FROM users",
    (err,result)=>{
        if(err){
            console.log(err);
        }
        console.log("View All Users");
        //console.log(result);
        res.render("allusers",{result:result});
    });
});


//Change Password

app.get("/change",function(req,res){
    db.query("Select * FROM users WHERE Username='"+usrname+"' AND Password='"+passwd+"'",
    (err,result)=>{
        if(err){
            console.log(err);
        }
        console.log("Change Password");
        //console.log(result);
        res.render("changepassword",{result:result});
    });
});

app.post("/change",function(req,res){
    var newpsswd = req.body.newpswd;
    db.query("UPDATE users SET Password='"+newpsswd+"' WHERE Username='"+usrname+"'",
    (err,result)=>{
        if(err){
            console.log(err);
        }
        console.log("Password Changed Successfully!");
        res.redirect("/log");
    });
});


//Logout

app.get("/logout",function(req,res){
    res.redirect("log");
});


//-------//

app.listen(5000,()=>{
    console.log("listening on 5000");
});