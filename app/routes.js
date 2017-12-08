var Task = require("./models/task");
var User = require("./models/user");
var send = require('gmail-send')({
    user: 'nicks.list.reminder@gmail.com', 
    pass: 'DevBootCamp123',
    //to:   'daniel.seiser@gmail.com',
    subject: "Nick's List Notification"
    //text:    'gmail-send example 1'        //PLAIN TEXT
    //html:    '<b>You have been selected</b>'            // HTML 
  });
// app/routes.js
module.exports = function(app, passport) {
       
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!     BEGIN PASSPORT LOGIN AND SIGNUP HANDLERS     !!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    

        //HOMEPAGE
        app.get('/', function(req, res) {
            res.render('index.ejs'); // load the index.ejs file
        });
    
        //LOGIN
        app.get('/login', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') }); 
        });

        //PROCESS LOGIN
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/list', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        //SIGNUP
        app.get('/signup', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        //PROCESS SIGNUP
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/list', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
       
        //PROFILE
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });
    
        //LOGOUT
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!     END PASSPORT LOGIN AND SIGNUP HANDLERS       !!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!     BEGIN TASK MANAGEMENT     !!!!!!!!!!!!!!!!!!!!!!!!!!! 
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   

        //LIST OF TASKS BY USER
        app.get('/list',isLoggedIn,function(req,res){
            Task
            .find({ userID: req.user._id },function(err,data){
                //console.log(data);
                res.render('list.ejs',{
                    tasks : data
                });
            })
        });
       
        
        //NEW TASK FORM (pass in all users other than self for drop down)
        app.get('/TaskForm',isLoggedIn,function(req,res){
            User.find({ _id: {'$ne' : req.user._id}},function(err,data){
                //console.log(data);
                res.render('TaskForm.ejs',{
                    users : data
                });
            })          
        })


        //CREATE A NEW TASK BASED OFF OF A FORM SUBMISSION        
        app.post('/task',isLoggedIn,function(req,res){//HANDLE POST REQUEST
            Task.create({  //CREATE TASK
                name            :  req.body.name,
                description     :  req.body.description,
                taskMaster      :  req.body.taskMaster,
                userID          :  req.user._id,
                userEmail       :  req.user.email,
                completeBy      :  req.body.completeBy,
                isComplete      :  false,
                isConfirmed     :  false
            }).then(
                function(req){//PASS IN THE REQUEST
                    User.find({_id : req.taskMaster},function(err,userData){//GET TASKMASTER EMAIL BASED ON FORM SUBMISSION
                        console.log('sending email to ' + userData[0].local.email);
                        send({//SEND EMAIL
                            to : userData[0].local.email,
                            subject : "Nick's List Notification - You've been made a taskmaster!",
                            html : "<b>You have been selected as a Nick's List Taskmaster!</b><br>This means you're in charge of making sure a friend completes his or her task.<br><a href='http://127.0.0.1:8080/'>Click Here to Login!</a>"
                        })                   
                    }).then(function(){
                        console.log('email sent')
                        res.redirect('/list');//REDIECT TO LIST
                    })
                })
            });
            
       
        //MASTER LIST
        app.get('/masterList',isLoggedIn,function(req,res){
            Task
            .find({ taskMaster: req.user._id },function(err,data){
                //console.log(data);
                res.render('masterList.ejs',{
                    tasks : data
                });
            })
        });

        app.post('/taskActor',isLoggedIn,function(req,res){
            if(req.body.action == 'complete'){
                    task.update,
                    tasks : data,
                };
                //UPDATE COMPLETE STATUS
                //REDIRECT TO LIST
                res.redirect('list.ejs"')
                
            }else if(req.body.action == 'confirm'){
                task.update,
                task : data,

                };
                //UPDATE CONFIRM STATUS
                //REDIRECT TO MASTERLIST
                res.redirect('/masterlist')                
        })
    };

//ROUTE MIDDLEWARE TO ENSURE USER IS LOGGED IN
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
    
