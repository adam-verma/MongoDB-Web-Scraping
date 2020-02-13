let mongoose = require('mongoose');

// Save a reference to the Schema constructor function
let Schema = mongoose.Schema

// Create a new Schema object with constructor
let NoteSchema = new Schema({
    // give 'headline' its properties
    title: {
        type: String
    },

    body: {
        type: String
    }

})

// Create model from mongoose's model scheme
let Note = mongoose.model("Note", NoteSchema);

// Export the Note model 
module.exports = Note;