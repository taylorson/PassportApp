// app/models/task.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var taskSchema = mongoose.Schema({
    task            : {
        name            :   String,
        description     :   String,
        taskMaster      :   String,
        userID          :   String     
    }  
});

// methods ======================



// create the model for users and expose it to our app
module.exports = mongoose.model('Task', taskSchema);