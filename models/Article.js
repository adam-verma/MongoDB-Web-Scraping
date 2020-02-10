const mongoose = require('mongoose');

// Save a reference to the Schema constructor function
const Schema = mongoose.Schema

// Create a new Schema object with constructor
let ArticleSchema = new Schema({
    // give 'headline' its properties
    headline: {
        type: String,
        required: true
    },
    // give 'summary' its properties 
    summary: {
        type: String, 
        required: true, 
        maxlength: 140,
    },
    // 'note' stores the ObjectId associated to Model
    // Populates 
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

})

// Create model from mongoose's model scheme
let Article = mongoose.models("Article", ArticleSchema);

// Export the Article model 
module.exports = Article; 