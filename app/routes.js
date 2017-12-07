var Task = require("./models/task");
var User = require("./models/user");
var send = require('gmail-send')({
    user: 'nicks.list.reminder@gmail.com', 
    pass: '',
    //to:   'daniel.seiser@gmail.com',
    subject: "Nick's List Notification"
    //text:    'gmail-send example 1'        //PLAIN TEXT
    //html:    '<b>You have been selected</b>'            // HTML 
  });
// app/routes.js
module.exports = function(app, passport) {
   
        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        app.get('/', function(req, res) {
            res.render('index.ejs'); // load the index.ejs file
        });
    
        // =====================================
        // LOGIN ===============================
        // =====================================
        // show the login form
        app.get('/login', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') }); 
        });    
        // process the login form
        // app.post('/login', do all our passport stuff here);
        // =====================================
        // SIGNUP ==============================
        // =====================================
        // show the signup form
        app.get('/signup', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });
    
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // =====================================
        // PROFILE SECTION =====================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });
    
        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });

        //GETS THE LIST OF TASKS BY CURRENTLY LOGGED IN USER. THIS CURRENTLY WORKS!
        app.get('/list',isLoggedIn,function(req,res){
            Task
            .find({ userID: req.user._id },function(err,data){
                console.log(data);
                res.render('list.ejs',{
                    tasks : data
                });
            })
        });
        //CREATE A NEW TASK BASED OFF OF A FORM SUBMISSION

        //switch this to do the create and then redirect to list.js
        //this probably doesn't needd a render
        app.get('/task',isLoggedIn,function(req,res){
            res.render('List.js',{
                user : req.user,
                tasks : Task     
                .create({
                     //REPLACE THIS STUFF WITH THE REQUEST SCOPE FROM THE FORM THAT KATE IS SO KINDLY POSTING TO US LAVEN HOYVEN 
                    name            :   'Dan Seiser',  //req.body.name
                    description     :   'TEST DESCRIPTION', //req.body.description
                    taskMaster      :   '',//req.body.taskMaster
                    userID          :   '5a22f1604319ac15a435d15f', // req.user._id
                    userEmail       :   'daniel.seiser@gmail.com',//req.user.email (I think)
                    completeBy      :   '01/01/2018' //req.body.completeBy
                }).then(
                    function(){
                    console.log('SENDING TASK CREATION EMAIL');
                   //Require module and setting default options 
                    send({
                        to : req.body.taskMaster,//'daniel.seiser@gmail.com',
                        subject : "Nick's List Notification - You've been made a taskmaster!",
                        html : "<b>You have been selected as a Nick's List Taskmaster!</b><br>This means you're in charge of making sure a friend completes his or her task.<br><a href='http://127.0.0.1:8080/'>Click Here to Login!</a>"
                    });
                    console.log('EMAIL SENT');
                })//CHANGE THIS TO REDIRECT TO LISTLAVEN MCFLAYVENHOYGLE
            })
        });
        
        app.get('/masterList',isLoggedIn,function(req,res){
            Task
            .find({ taskMaster: req.user._id },function(err,data){
                console.log(data);
                res.render('masterList.ejs',{
                    tasks : data
                });
            })
        });

        //CREATE THE FORM ROUTE HERE
        app.get('/TaskForm',isLoggedIn,function(req,res){//UPDATE THIS TO THE APPROPRIATE ROUTE TO CREATE A NEW ONE
            res.render('TaskForm.js',{
                user : req.user,
                users :  User.find()//UPDATE THIS FIND TO WHERE THE objectId is *not* the currently logged in user
            })
        })
    };
    
    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
    