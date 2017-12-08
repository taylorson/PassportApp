// app/models/task.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var task = mongoose.Schema({
    name            :   String,
    description     :   String,
    taskMaster      :   String,
    userID          :   String,
    userEmail       :   String,
    completeBy      :   Date,
    isComplete      :   Boolean,
    isConfirmed     :   Boolean
});

// methods ======================



// create the model for users and expose it to our app
module.exports = mongoose.model('Task', task);